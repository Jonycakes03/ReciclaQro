import React from 'react';

interface TarjetaArticuloProps {
  id: string;
  titulo: string;
  descripcion: string;
}

export function TarjetaArticulo({ id, titulo, descripcion }: TarjetaArticuloProps) {
  return (
    <a
      href={`/educacion/${id}`}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h2 className="text-xl font-semibold mb-2">{titulo}</h2>
      <p className="text-gray-600">{descripcion}</p>
    </a>
  );
}
