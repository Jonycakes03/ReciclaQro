import { supabase } from '@/lib/supabase';
import { Usuario, RegistroReciclaje } from '@/types';

export async function obtenerUsuario(userId: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }

  return data;
}

export async function actualizarXP(userId: string, xpGanada: number): Promise<boolean> {
  const { error } = await supabase.rpc('incrementar_xp', {
    user_id: userId,
    xp_a_sumar: xpGanada,
  });

  if (error) {
    console.error('Error actualizando XP:', error);
    return false;
  }

  return true;
}

export async function obtenerHistorialReciclaje(
  userId: string
): Promise<RegistroReciclaje[]> {
  const { data, error } = await supabase
    .from('registros_reciclaje')
    .select('*, centros_acopio(nombre, direccion)')
    .eq('usuario_id', userId)
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }

  return data || [];
}

export async function registrarReciclaje(
  userId: string,
  centroId: string,
  materiales: string[]
): Promise<boolean> {
  // Calcular XP basado en materiales
  const xpGanada = materiales.length * 10;

  const { error } = await supabase.from('registros_reciclaje').insert({
    usuario_id: userId,
    centro_acopio_id: centroId,
    materiales,
    xp_ganada: xpGanada,
    fecha: new Date().toISOString(),
  });

  if (error) {
    console.error('Error registrando reciclaje:', error);
    return false;
  }

  // Actualizar XP del usuario
  await actualizarXP(userId, xpGanada);

  return true;
}
