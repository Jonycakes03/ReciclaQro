import { supabase } from '@/lib/supabase';
import { CentroAcopio } from '@/types';

export async function obtenerCentrosCercanos(
  lat: number,
  lng: number,
  radioKm: number = 5
): Promise<CentroAcopio[]> {
  // Consulta geoespacial usando PostGIS
  const { data, error } = await supabase
    .rpc('centros_cercanos', {
      lat,
      lng,
      radio_km: radioKm,
    });

  if (error) {
    console.error('Error obteniendo centros cercanos:', error);
    return [];
  }

  return data || [];
}

export async function obtenerTodosCentros(): Promise<CentroAcopio[]> {
  const { data, error } = await supabase
    .from('centros_acopio')
    .select('*')
    .order('nombre');

  if (error) {
    console.error('Error obteniendo todos los centros:', error);
    return [];
  }

  return data || [];
}

export async function obtenerCentroPorId(id: string): Promise<CentroAcopio | null> {
  const { data, error } = await supabase
    .from('centros_acopio')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error obteniendo centro:', error);
    return null;
  }

  return data;
}
