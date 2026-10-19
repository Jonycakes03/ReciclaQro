import { apiFetch } from '@/lib/apiClient';
import type {
  PerfilResponse,
  RegistrarReciclajeInput,
  RegistrarReciclajeResponse,
} from '@/types';

/** Perfil (XP, nivel) e historial del usuario autenticado. GET /api/perfil */
export function obtenerPerfil(limit?: number): Promise<PerfilResponse> {
  const query = limit ? `?limit=${limit}` : '';
  return apiFetch<PerfilResponse>(`/api/perfil${query}`);
}

/** Registra un reciclaje y suma la XP al usuario. POST /api/reciclaje */
export function registrarReciclaje(
  input: RegistrarReciclajeInput
): Promise<RegistrarReciclajeResponse> {
  return apiFetch<RegistrarReciclajeResponse>('/api/reciclaje', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
