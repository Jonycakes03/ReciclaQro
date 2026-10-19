import { supabase } from '@/lib/supabaseClient';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type ApiFetchOptions = RequestInit & {
  /**
   * Access token explícito. Úsalo dentro de `onAuthStateChange`, donde llamar a
   * `supabase.auth.getSession()` puede provocar un bloqueo (deadlock).
   */
  accessToken?: string | null;
};

/**
 * Cliente de la API interna (`/api/*`). Adjunta `Authorization: Bearer <token>` cuando hay
 * sesión (la sesión de supabase-js vive en localStorage, no en cookies) y desenvuelve
 * la respuesta `{ data }` / `{ error }` de los Route Handlers.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { accessToken, headers, ...init } = options;

  let token = accessToken;
  if (token === undefined) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token ?? null;
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  let body: { data?: T; error?: string } | null = null;
  try {
    body = await response.json();
  } catch {
    // respuesta sin JSON
  }

  if (!response.ok) {
    throw new ApiError(body?.error ?? `Error ${response.status} en ${path}`, response.status);
  }

  return body?.data as T;
}
