import { NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/educacion — Catálogo de material educativo (público).
 * Query opcional: ?categoria=baterias
 */
export async function GET(request: Request) {
  try {
    const categoria = new URL(request.url).searchParams.get('categoria');
    const supabase = createSupabasePublicClient();

    let query = supabase
      .from('material_educativo')
      .select('id, titulo, contenido, categoria, url_imagen, fecha_publicacion')
      .order('fecha_publicacion', { ascending: false });

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/educacion]', error);
      return NextResponse.json(
        { error: 'No se pudo obtener el material educativo.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/educacion] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
