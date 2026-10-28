import { NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { parseUbicacion } from '@/lib/geo';
import type { CentroAcopioMapa } from '@/types/database';

export const dynamic = 'force-dynamic';

/**
 * GET /api/centros — Centros de acopio activos (público).
 * Devuelve `lat`/`lng` ya decodificados (la columna `ubicacion` llega como EWKB hexadecimal).
 */
export async function GET() {
  try {
    const supabase = createSupabasePublicClient();

    const { data, error } = await supabase
      .from('centros_acopio')
      .select('id, nombre, direccion, ubicacion, horarios, categorias_aceptadas, activo')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('[GET /api/centros]', error);
      return NextResponse.json(
        { error: 'No se pudieron obtener los centros de acopio.' },
        { status: 500 }
      );
    }

    const centros: CentroAcopioMapa[] = [];
    for (const { ubicacion, ...resto } of data ?? []) {
      const coords = parseUbicacion(ubicacion);
      if (!coords) {
        console.warn(`[GET /api/centros] Ubicación inválida, se omite: ${resto.nombre}`);
        continue;
      }
      centros.push({ ...resto, lat: coords.lat, lng: coords.lng });
    }

    return NextResponse.json({ data: centros }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/centros] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
