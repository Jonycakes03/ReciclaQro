import { supabase } from '@/lib/supabase';
import { Articulo } from '@/types';

export async function obtenerTodosArticulos(): Promise<Articulo[]> {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .order('creado_en', { ascending: false });

  if (error) {
    console.error('Error obteniendo artículos:', error);
    return [];
  }

  return data || [];
}

export async function obtenerArticuloPorId(id: string): Promise<Articulo | null> {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error obteniendo artículo:', error);
    return null;
  }

  return data;
}

export async function obtenerArticulosPorCategoria(
  categoria: string
): Promise<Articulo[]> {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .eq('categoria', categoria)
    .order('creado_en', { ascending: false });

  if (error) {
    console.error('Error obteniendo artículos por categoría:', error);
    return [];
  }

  return data || [];
}
