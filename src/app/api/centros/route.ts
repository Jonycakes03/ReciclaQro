import { NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** GET /api/centros — Centros de acopio activos (público). */
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

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/centros] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
