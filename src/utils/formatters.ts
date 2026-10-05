export function formatearFecha(fecha: string): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatearFechaHora(fecha: string): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calcularNivel(xp: number): number {
  // Fórmula: nivel = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpParaSiguienteNivel(nivel: number): number {
  // XP necesaria para alcanzar el siguiente nivel
  return Math.pow(nivel, 2) * 100;
}

export function xpActualEnNivel(xp: number, nivel: number): number {
  // XP ganada en el nivel actual
  const xpTotalParaNivel = Math.pow(nivel - 1, 2) * 100;
  return xp - xpTotalParaNivel;
}

export function xpFaltanteParaSiguienteNivel(xp: number, nivel: number): number {
  const xpSiguienteNivel = xpParaSiguienteNivel(nivel);
  return xpSiguienteNivel - xp;
}

export function porcentajeProgresoNivel(xp: number, nivel: number): number {
  const xpSiguienteNivel = xpParaSiguienteNivel(nivel);
  const xpTotalParaNivel = Math.pow(nivel - 1, 2) * 100;
  const xpEnNivel = xp - xpTotalParaNivel;
  const xpTotalEnNivel = xpSiguienteNivel - xpTotalParaNivel;
  
  return Math.min(100, Math.max(0, (xpEnNivel / xpTotalEnNivel) * 100));
}
