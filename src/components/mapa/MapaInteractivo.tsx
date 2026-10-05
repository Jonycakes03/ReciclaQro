'use client';

import React, { useEffect, useRef } from 'react';

export function MapaInteractivo() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicializar Mapbox GL aquí
    // Este es un placeholder - requiere configuración de Mapbox
    console.log('Mapa inicializado');
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[600px] bg-gray-200 rounded-lg"
      style={{ minHeight: '600px' }}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Mapa interactivo de centros de acopio</p>
      </div>
    </div>
  );
}
