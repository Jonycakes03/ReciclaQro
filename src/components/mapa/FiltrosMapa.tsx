'use client';

import React from 'react';

export function FiltrosMapa() {
  const materiales = ['Papel', 'Plástico', 'Vidrio', 'Metal', 'Electrónicos'];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold mb-3">Filtrar por material</h3>
      <div className="flex flex-wrap gap-2">
        {materiales.map((material) => (
          <button
            key={material}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
          >
            {material}
          </button>
        ))}
      </div>
    </div>
  );
}
