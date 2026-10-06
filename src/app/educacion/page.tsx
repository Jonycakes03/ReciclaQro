'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ARTICULOS = [
  {
    id: 'celular-basura',
    nivel: 'BÁSICO',
    tipo: 'ARTÍCULO',
    titulo: '¿Por qué tirar un celular a la basura es peligroso?',
    descripcion: 'Metales pesados como plomo y mercurio pueden contaminar el suelo y el agua.',
    tiempo: '4 min de lectura',
  },
  {
    id: 'tipos-centros-acopio',
    nivel: 'BÁSICO',
    tipo: 'INFOGRAFÍA',
    titulo: 'Qué acepta cada tipo de centro de acopio',
    descripcion: 'Guía visual rápida para saber a dónde llevar cada aparato.',
    tiempo: 'Vista rápida',
  },
  {
    id: 'economia-circular',
    nivel: 'AVANZADO',
    tipo: 'ARTÍCULO',
    titulo: 'De la chatarra a la economía circular',
    descripcion: 'Modelo económico y logístico detrás del reciclaje de RAEE, pensado para docentes.',
    tiempo: '6 min de lectura',
  },
  {
    id: 'raee-aula',
    nivel: 'AVANZADO',
    tipo: 'GUÍA DOCENTE',
    titulo: 'RAEE en el aula: actividades para escuelas',
    descripcion: 'Plan de actividades y datos técnicos para trabajar el tema con estudiantes.',
    tiempo: '8 min de lectura',
  },
  {
    id: 'clasifica-residuos',
    nivel: 'BÁSICO',
    tipo: 'QUIZ',
    titulo: 'Identifica el residuo correcto',
    descripcion: 'Pon a prueba si sabes clasificar pilas, cables y electrodomésticos.',
    tiempo: '3 min',
  },
];

const NIVEL_STYLES: Record<string, { badge: string; dot: string }> = {
  BÁSICO: {
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-600',
  },
  AVANZADO: {
    badge: 'bg-blue-50 text-blue-800 border border-blue-200',
    dot: 'bg-blue-600',
  },
};

const TIPO_COLOR: Record<string, string> = {
  ARTÍCULO: 'text-amber-500',
  INFOGRAFÍA: 'text-purple-500',
  QUIZ: 'text-rose-500',
  'GUÍA DOCENTE': 'text-cyan-500',
};

export default function EducacionPage() {
  const [filtro, setFiltro] = useState<'todos' | 'basico' | 'avanzado'>('todos');

  const articulosFiltrados = ARTICULOS.filter((a) => {
    if (filtro === 'todos') return true;
    if (filtro === 'basico') return a.nivel === 'BÁSICO';
    if (filtro === 'avanzado') return a.nivel === 'AVANZADO';
    return true;
  });

  const chips = [
    { id: 'todos', label: 'Todos' },
    { id: 'basico', label: 'Básico · Ciudadanos' },
    { id: 'avanzado', label: 'Avanzado · Escuelas' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Aprende sobre RAEE</h1>
        <p className="text-gray-500 text-sm mb-6">
          Artículos, infografías y quizzes, organizados por nivel técnico.
        </p>

        {/* Chips de filtro */}
        <div className="flex gap-2 flex-wrap mb-6">
          {chips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFiltro(chip.id as typeof filtro)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                filtro === chip.id
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Quiz Hero Banner */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-7 mb-8 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-xl font-bold mb-2">¿Cuánto sabes sobre reciclaje electrónico?</h2>
            <p className="text-[#B7C3D6] text-sm max-w-md">
              Responde 5 preguntas rápidas y descubre qué tanto puedes mejorar tus hábitos de reciclaje.
            </p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-colors whitespace-nowrap text-sm">
            Comenzar quiz
          </button>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articulosFiltrados.map((art) => {
            const nivelStyle = NIVEL_STYLES[art.nivel] ?? NIVEL_STYLES['BÁSICO'];
            const tipoColor = TIPO_COLOR[art.tipo] ?? 'text-gray-400';

            return (
              <Link
                key={art.id}
                href={`/educacion/${art.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 hover:border-emerald-400 hover:shadow-md transition-all group"
              >
                {/* Badge nivel */}
                <span className={`self-start text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${nivelStyle.badge}`}>
                  {art.nivel}
                </span>

                {/* Tipo */}
                <span className={`text-xs font-bold tracking-wide ${tipoColor}`}>
                  {art.tipo}
                </span>

                {/* Título */}
                <h3 className="font-bold text-gray-900 text-[0.97rem] leading-snug group-hover:text-emerald-700 transition-colors">
                  {art.titulo}
                </h3>

                {/* Descripción */}
                <p className="text-gray-500 text-sm flex-1 leading-relaxed">
                  {art.descripcion}
                </p>

                {/* Tiempo */}
                <span className="text-gray-400 text-xs mt-1">{art.tiempo}</span>
              </Link>
            );
          })}
        </div>

        {articulosFiltrados.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No hay contenido para el nivel seleccionado.
          </div>
        )}

      </div>
    </div>
  );
}
