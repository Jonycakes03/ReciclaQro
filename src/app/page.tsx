'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Categorías oficiales de RAEE para filtrado
const CATEGORIAS_RAEE = [
  { id: 'todos', nombre: 'Todos los RAEE', icono: '⚡' },
  { id: 'computo', nombre: 'Cómputo & Laptops', icono: '💻' },
  { id: 'telefonia', nombre: 'Celulares & Tablets', icono: '📱' },
  { id: 'baterias', nombre: 'Pilas & Baterías', icono: '🔋' },
  { id: 'linea_blanca', nombre: 'Línea Blanca & Microondas', icono: '🔌' },
  { id: 'audio_video', nombre: 'TVs & Monitores', icono: '🖥️' },
  { id: 'cables', nombre: 'Cables & Periféricos', icono: '🎧' },
];

// Datos demo preparados para la vista previa del mapa antes de conectar Supabase/PostGIS
const CENTROS_DESTACADOS_PREVIEW = [
  {
    id: '1',
    nombre: 'Punto Verde Parque Querétaro 2000',
    direccion: 'Blvd. Bernardo Quintana s/n, Parque Querétaro 2000',
    municipio: 'Querétaro',
    horario: 'Lun - Sáb: 8:00 AM - 4:00 PM',
    distancia: '1.2 km',
    materiales: ['Cómputo', 'Celulares', 'Pilas', 'Cables'],
    activo: true,
  },
  {
    id: '2',
    nombre: 'Centro de Acopio Municipal Corregidora',
    direccion: 'Av. Paseo Constituyentes 1200, El Pueblito',
    municipio: 'Corregidora',
    horario: 'Lun - Vie: 9:00 AM - 5:00 PM',
    distancia: '3.8 km',
    materiales: ['Línea Blanca', 'Monitores', 'Pilas', 'Electrónicos'],
    activo: true,
  },
  {
    id: '3',
    nombre: 'Módulo Juriquilla Santa Rosa',
    direccion: 'Av. de las Ciencias 200, Juriquilla',
    municipio: 'Querétaro',
    horario: 'Mié - Dom: 10:00 AM - 6:00 PM',
    distancia: '6.4 km',
    materiales: ['Celulares', 'Laptops', 'Pequeños enseres'],
    activo: true,
  },
];

export default function HomePage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [centroSeleccionado, setCentroSeleccionado] = useState(CENTROS_DESTACADOS_PREVIEW[0]);
  const [localizando, setLocalizando] = useState(false);

  const handleGeolocalizacion = () => {
    setLocalizando(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocalizando(false);
          alert(
            `📍 Coordenadas detectadas: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}.\n` +
            `En la siguiente iteración, este evento disparará la consulta PostGIS: rpc('buscar_centros_cercanos').`
          );
        },
        () => {
          setLocalizando(false);
          alert('No se pudo acceder a tu ubicación. Puedes buscar por municipio o colonia.');
        }
      );
    } else {
      setLocalizando(false);
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <span>🌿 Querétaro Limpio & Circular</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Recicla tus aparatos electrónicos en <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy underline-offset-6">Querétaro</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Ubica centros de acopio autorizados para residuos de manejo especial (RAEE). Evita que metales pesados contaminen nuestros mantos acuíferos y gana puntos XP por tu compromiso ciudadano.
            </p>

            {/* Badges de impacto */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                📍 <strong>PostGIS</strong> Cercanía en tiempo real
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                🛡️ <strong>100%</strong> Centros Verificados
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                🎮 <strong>Gamificación</strong> Sube de nivel
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE FILTROS & BÚSQUEDA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20 w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Input de búsqueda */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por municipio, colonia o centro (ej. Juriquilla, Centro, Corregidora)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Botón de Geolocalización */}
            <button
              onClick={handleGeolocalizacion}
              disabled={localizando}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <svg className={`w-4 h-4 ${localizando ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {localizando ? 'Localizando...' : 'Centros Cerca de Mí'}
            </button>
          </div>

          {/* Chips de Categorías de Residuos RAEE */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
            {CATEGORIAS_RAEE.map((cat) => {
              const active = categoriaSeleccionada === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.icono}</span>
                  <span>{cat.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONTENEDOR DEL MAPA INTERACTIVO & LISTADO (Preparado para Mapbox) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Panel de Centros Encontrados (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Centros de Acopio</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  {CENTROS_DESTACADOS_PREVIEW.length} disponibles
                </span>
              </h2>
              <span className="text-xs text-slate-400">Querétaro y Zona Metro</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {CENTROS_DESTACADOS_PREVIEW.map((centro) => {
                const isSelected = centroSeleccionado.id === centro.id;
                return (
                  <div
                    key={centro.id}
                    onClick={() => setCentroSeleccionado(centro)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                        {centro.nombre}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        {centro.distancia}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-2.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{centro.direccion}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {centro.materiales.map((m, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>🕒 {centro.horario}</span>
                      <span className="text-emerald-600 font-semibold hover:underline">
                        Ver detalles →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Vista del Mapa (8 cols) */}
          <div className="lg:col-span-8">
            <div className="relative w-full h-[580px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex flex-col justify-between p-6">
              {/* Fondo simulando la red cartográfica de Querétaro */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#059669 1px, transparent 1px), radial-gradient(#059669 1px, #f8fafc 1px)`,
                  backgroundSize: '32px 32px',
                  backgroundPosition: '0 0, 16px 16px'
                }}
              />

              {/* Header flotante en el mapa */}
              <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Mapbox GL JS Viewer (Contenedor Listo)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono">
                  QRO: [20.5888, -100.3899]
                </span>
              </div>

              {/* Pin central visual para previsualización */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center p-6 max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-xs">
                  🗺️
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Módulo de Mapa Interactivo
                </h4>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Este contenedor está listo para recibir el componente <code>&lt;MapboxView /&gt;</code> conectado a Mapbox GL JS y la función espacial PostGIS de Supabase.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                    Pines Dinámicos
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                    Radio de Cercanía
                  </span>
                </div>
              </div>

              {/* Popup informativo inferior */}
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">Seleccionado:</span>
                  <span className="truncate">{centroSeleccionado.nombre}</span>
                </div>
                <span className="text-slate-300 font-mono text-[11px]">
                  {centroSeleccionado.municipio}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN CÓMO FUNCIONA / GAMIFICACIÓN */}
      <section className="bg-white border-t border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              ¿Cómo funciona ReciclaQro?
            </h2>
            <p className="text-sm text-slate-600">
              Unimos tecnología geográfica, educación ciudadana y gamificación para transformar la gestión de RAEE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Ubica tu centro más cercano
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Utiliza el mapa con geolocalización PostGIS para encontrar qué centro recibe exactamente los aparatos que quieres desechar.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Entrega tus aparatos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Llévalos en los horarios indicados. El personal calificado se asegura de que sus componentes tóxicos no toquen la tierra queretana.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Gana XP & Sube de Nivel
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Registra tu entrega en tu perfil ciudadano voluntario, desbloquea medallas ambientales y acumula puntos de experiencia ecológica.
              </p>
            </div>
          </div>

          {/* CTA Hub Educativo */}
          <div className="mt-10 p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="text-lg font-bold mb-1">
                ¿Tienes dudas sobre cómo preparar tus dispositivos?
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                Aprende cómo borrar tus datos personales antes de reciclar una laptop o celular, y por qué las pilas jamás deben perforarse.
              </p>
            </div>
            <Link
              href="/educacion"
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-xs whitespace-nowrap"
            >
              Explorar Hub Educativo →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
