import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/supabase/server';
import { obtenerOCrearUsuario } from '@/lib/supabase/usuarios';
import { calcularProgresoUsuario } from '@/lib/gamification';

export const dynamic = 'force-dynamic';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_XP_POR_REGISTRO = 1000;

/**
 * POST /api/reciclaje (privado)
 * Body: { id_centro: string | null, tipo_aparato: string, xp_otorgada: number }
 *
 * 1. Inserta el registro en `registros_reciclaje`.
 * 2. Suma `xp_otorgada` a `usuarios.experiencia_xp`.
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    const { supabase, user } = auth;

    // --- Validación del body ---
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'El cuerpo debe ser JSON válido.' }, { status: 400 });
    }

    const { id_centro, tipo_aparato, xp_otorgada } = (body ?? {}) as Record<string, unknown>;

    if (id_centro != null && (typeof id_centro !== 'string' || !UUID_REGEX.test(id_centro))) {
      return NextResponse.json({ error: 'id_centro debe ser un UUID válido.' }, { status: 400 });
    }
    if (typeof tipo_aparato !== 'string' || !tipo_aparato.trim() || tipo_aparato.length > 100) {
      return NextResponse.json(
        { error: 'tipo_aparato es obligatorio (texto de hasta 100 caracteres).' },
        { status: 400 }
      );
    }
    if (
      typeof xp_otorgada !== 'number' ||
      !Number.isInteger(xp_otorgada) ||
      xp_otorgada <= 0 ||
      xp_otorgada > MAX_XP_POR_REGISTRO
    ) {
      return NextResponse.json(
        { error: `xp_otorgada debe ser un entero entre 1 y ${MAX_XP_POR_REGISTRO}.` },
        { status: 400 }
      );
    }

    // --- Asegurar que existe la fila del usuario ---
    const { usuario, error: errorUsuario } = await obtenerOCrearUsuario(supabase, user);
    if (errorUsuario || !usuario) {
      console.error('[POST /api/reciclaje] usuario:', errorUsuario);
      return NextResponse.json(
        { error: 'No se pudo obtener el perfil del usuario.' },
        { status: 500 }
      );
    }

    // --- 1. Insertar el registro ---
    const { data: registro, error: errorRegistro } = await supabase
      .from('registros_reciclaje')
      .insert({
        id_usuario: user.id,
        id_centro: id_centro ?? null,
        tipo_aparato: tipo_aparato.trim(),
        xp_otorgada,
      })
      .select('*')
      .single();

    if (errorRegistro || !registro) {
      console.error('[POST /api/reciclaje] insert:', errorRegistro);
      const status = errorRegistro?.code === '23503' ? 400 : 500; // FK: centro inexistente
      return NextResponse.json(
        {
          error:
            status === 400
              ? 'El centro de acopio indicado no existe.'
              : 'No se pudo guardar el registro de reciclaje.',
        },
        { status }
      );
    }

    // --- 2. Sumar XP y recalcular nivel al usuario ---
    const nuevaXp = (usuario.experiencia_xp ?? 0) + xp_otorgada;
    const progreso = calcularProgresoUsuario(nuevaXp);

    const { data: usuarioActualizado, error: errorUpdate } = await supabase
      .from('usuarios')
      .update({
        experiencia_xp: nuevaXp,
        nivel_actual: progreso.nivel,
      })
      .eq('id', user.id)
      .select('id, nombre, email, experiencia_xp, nivel_actual')
      .single();

    if (errorUpdate || !usuarioActualizado) {
      console.error('[POST /api/reciclaje] update xp:', errorUpdate);
      // Compensación: se revierte el registro para no dejar XP sin acreditar.
      const { error: errorRollback } = await supabase
        .from('registros_reciclaje')
        .delete()
        .eq('id', registro.id);
      if (errorRollback) {
        console.error('[POST /api/reciclaje] rollback falló:', errorRollback);
      }
      return NextResponse.json(
        { error: 'No se pudo actualizar la experiencia del usuario.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: { registro, usuario: usuarioActualizado } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/reciclaje] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
