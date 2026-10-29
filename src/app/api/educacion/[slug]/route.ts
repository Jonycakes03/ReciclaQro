import { NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/educacion/[slug] — Obtener un artículo educativo por su slug.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const supabase = createSupabasePublicClient();

    const { data, error } = await supabase
      .from('material_educativo')
      .select('id, slug, titulo, descripcion, contenido, categoria, nivel, tipo, tiempo_lectura, url_imagen, fecha_publicacion')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`[GET /api/educacion/${slug}]`, error);
      return NextResponse.json(
        { error: 'Error al consultar el material educativo.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Material educativo no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/educacion/[slug]] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
