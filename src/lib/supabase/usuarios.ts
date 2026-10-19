import type { User } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '@/lib/supabase/server';
import type { Usuario } from '@/types/database';

/**
 * Obtiene la fila de `public.usuarios` del usuario autenticado.
 * Si aún no existe (primer login con Magic Link), la crea con valores iniciales.
 */
export async function obtenerOCrearUsuario(
  supabase: TypedSupabaseClient,
  authUser: User
): Promise<{ usuario: Usuario | null; error: string | null }> {
  const { data: existente, error: errorLectura } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (errorLectura) return { usuario: null, error: errorLectura.message };
  if (existente) return { usuario: existente, error: null };

  const { data: creado, error: errorInsert } = await supabase
    .from('usuarios')
    .insert({
      id: authUser.id,
      email: authUser.email ?? '',
      nombre:
        (authUser.user_metadata?.nombre as string | undefined) ??
        authUser.email?.split('@')[0] ??
        null,
      experiencia_xp: 0,
      nivel_actual: 1,
    })
    .select('*')
    .single();

  if (errorInsert) {
    // Otra petición concurrente creó la fila primero: la releemos.
    if (errorInsert.code === '23505') {
      const { data: releida, error: errorRelectura } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (releida) return { usuario: releida, error: null };
      return { usuario: null, error: errorRelectura?.message ?? errorInsert.message };
    }
    return { usuario: null, error: errorInsert.message };
  }
  return { usuario: creado, error: null };
}
