import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/supabase/server';
import { obtenerOCrearUsuario } from '@/lib/supabase/usuarios';

export const dynamic = 'force-dynamic';

/**
 * GET /api/perfil — Perfil del usuario actual + historial de reciclaje (privado).
 * Query opcional: ?limit=50 (máx. 200)
 */
export async function GET(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    const { supabase, user } = auth;

    const limitParam = Number(new URL(request.url).searchParams.get('limit') ?? 50);
    const limit = Number.isInteger(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;

    const { usuario, error: errorUsuario } = await obtenerOCrearUsuario(supabase, user);
    if (errorUsuario || !usuario) {
      console.error('[GET /api/perfil] usuario:', errorUsuario);
      return NextResponse.json(
        { error: 'No se pudo obtener el perfil del usuario.' },
        { status: 500 }
      );
    }

    const { data: historial, error: errorHistorial } = await supabase
      .from('registros_reciclaje')
      .select('id, id_usuario, id_centro, tipo_aparato, xp_otorgada, fecha_entrega')
      .eq('id_usuario', user.id)
      .order('fecha_entrega', { ascending: false })
      .limit(limit);

    if (errorHistorial) {
      console.error('[GET /api/perfil] historial:', errorHistorial);
      return NextResponse.json(
        { error: 'No se pudo obtener el historial de reciclaje.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: {
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            edad: usuario.edad ?? null,
            experiencia_xp: usuario.experiencia_xp ?? 0,
            nivel_actual: usuario.nivel_actual ?? 1,
            fecha_registro: usuario.fecha_registro,
          },
          historial: historial ?? [],
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[GET /api/perfil] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

/**
 * POST /api/perfil — Crea explícitamente la fila del usuario.
 * Body opcional: { nombre?: string, edad?: number }
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    const { supabase, user } = auth;

    const body = await request.json().catch(() => ({}));
    const nombre = body.nombre as string | undefined;
    const edad = body.edad as number | undefined;

    const { usuario, error: errorUsuario } = await obtenerOCrearUsuario(supabase, user);
    if (errorUsuario || !usuario) {
      console.error('[POST /api/perfil] usuario:', errorUsuario);
      return NextResponse.json(
        { error: 'No se pudo crear el perfil del usuario.' },
        { status: 500 }
      );
    }

    // Actualizar nombre o edad si fueron provistos
    const updates: Partial<{ nombre: string; edad: number }> = {};
    if (nombre && !usuario.nombre) updates.nombre = nombre;
    if (edad && usuario.edad == null) updates.edad = edad;

    if (Object.keys(updates).length > 0) {
      const { error: errorUpdate } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', user.id);

      if (errorUpdate) {
        console.error('[POST /api/perfil] update perfil:', errorUpdate);
      }
    }

    return NextResponse.json(
      {
        data: {
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre || nombre || null,
            email: usuario.email,
            edad: usuario.edad ?? edad ?? null,
            experiencia_xp: usuario.experiencia_xp ?? 0,
            nivel_actual: usuario.nivel_actual ?? 1,
            fecha_registro: usuario.fecha_registro,
          },
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/perfil] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
