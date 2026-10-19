import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Lee las credenciales públicas de Supabase.
 * Acepta tanto la clave anónima clásica como la nueva "publishable key".
 */
function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY (o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).'
    );
  }
  return { url, key };
}

/**
 * Cliente anónimo sin sesión, para endpoints públicos (respeta RLS como rol `anon`).
 */
export function createSupabasePublicClient(): TypedSupabaseClient {
  const { url, key } = getSupabaseEnv();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cliente basado en cookies (`@supabase/ssr`). Útil si la sesión se guarda en cookies.
 */
export async function createSupabaseServerClient(): Promise<TypedSupabaseClient> {
  const { url, key } = getSupabaseEnv();
  const cookieStore = await cookies(); // Next.js 15: cookies() es asíncrono

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Se ignora si se invoca desde un Server Component (el middleware refresca la sesión).
        }
      },
    },
  });
}

export type AuthContext = {
  supabase: TypedSupabaseClient;
  user: User;
};

/**
 * Resuelve el usuario autenticado de una petición y devuelve un cliente que actúa
 * en su nombre (RLS aplicado con su JWT). Devuelve `null` si no hay sesión válida.
 *
 * Orden de resolución:
 *  1. Header `Authorization: Bearer <access_token>` — necesario porque el cliente del
 *     navegador (`supabase-js`) guarda la sesión en localStorage, no en cookies.
 *  2. Cookies de sesión (`@supabase/ssr`).
 *
 * Siempre se valida con `auth.getUser()` (verifica el JWT contra Supabase Auth);
 * nunca se confía en `getSession()` en el servidor.
 */
export async function getAuthContext(request: Request): Promise<AuthContext | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (token) {
    const { url, key } = getSupabaseEnv();
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return { supabase, user: data.user };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, user: data.user };
}
