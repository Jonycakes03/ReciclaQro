/**
 * Filtros de residuos RAEE para el mapa.
 *
 * `categorias_aceptadas` en la base es texto libre (p. ej. "Electrónicos", "Pilas Alcalinas",
 * "Línea blanca y refrigeración"), así que cada filtro agrupa por patrón sobre el texto
 * normalizado (sin acentos y en minúsculas).
 */

export type GrupoRAEE = {
  id: string;
  nombre: string;
  icono: string;
  /** `null` = sin filtro (todos los centros). */
  patron: RegExp | null;
};

export const GRUPOS_RAEE: GrupoRAEE[] = [
  { id: 'todos', nombre: 'Todos', icono: '⚡', patron: null },
  { id: 'electronicos', nombre: 'Electrónicos', icono: '💻', patron: /electronic|computo|laptop|celular|telefon/ },
  { id: 'pilas', nombre: 'Pilas y baterías', icono: '🔋', patron: /pila|acumulador|bateri/ },
  { id: 'cables', nombre: 'Cables', icono: '🔌', patron: /cable/ },
  { id: 'linea_blanca', nombre: 'Línea blanca', icono: '🧊', patron: /linea blanca|refriger|electrodomest/ },
];

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function centroAcepta(categorias: string[], grupo: GrupoRAEE): boolean {
  if (!grupo.patron) return true;
  return categorias.some((c) => grupo.patron!.test(normalizar(c)));
}
