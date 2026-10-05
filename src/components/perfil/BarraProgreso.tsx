import React from 'react';

interface BarraProgresoProps {
  xp: number;
  nivel: number;
}

export function BarraProgreso({ xp, nivel }: BarraProgresoProps) {
  const xpSiguienteNivel = Math.pow(nivel, 2) * 100;
  const xpTotalParaNivel = Math.pow(nivel - 1, 2) * 100;
  const xpEnNivel = xp - xpTotalParaNivel;
  const xpTotalEnNivel = xpSiguienteNivel - xpTotalParaNivel;
  const porcentaje = Math.min(100, Math.max(0, (xpEnNivel / xpTotalEnNivel) * 100));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Nivel {nivel}</span>
        <span className="text-gray-600">{xp} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-600 h-4 rounded-full transition-all duration-300"
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {xpEnNivel} / {xpTotalEnNivel} XP para el siguiente nivel
      </p>
    </div>
  );
}
