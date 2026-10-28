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
 * POST /api/perfil — Crea explícitamente la fila del usuario (usado en /crear-contrasena).
 * Body opcional: { nombre?: string }
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

    const { usuario, error: errorUsuario } = await obtenerOCrearUsuario(supabase, user);
    if (errorUsuario || !usuario) {
      console.error('[POST /api/perfil] usuario:', errorUsuario);
      return NextResponse.json(
        { error: 'No se pudo crear el perfil del usuario.' },
        { status: 500 }
      );
    }

    // Si se proporcionó un nombre y el usuario no tiene uno, actualizarlo
    if (nombre && !usuario.nombre) {
      const { error: errorUpdate } = await supabase
        .from('usuarios')
        .update({ nombre })
        .eq('id', user.id);

      if (errorUpdate) {
        console.error('[POST /api/perfil] update nombre:', errorUpdate);
        // No fallamos el request si el update falla, el usuario ya fue creado
      }
    }

    return NextResponse.json(
      {
        data: {
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre || nombre || null,
            email: usuario.email,
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
