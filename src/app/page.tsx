'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/apiClient';
import { distanciaKm, type Coordenadas } from '@/lib/geo';
import { GRUPOS_RAEE, centroAcepta, normalizar } from '@/features/map/categorias';
import type { CentroAcopioMapa } from '@/types';

// mapbox-gl necesita `window`: se carga solo en el navegador.
const MapboxView = dynamic(() => import('@/features/map/MapboxView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-xs text-slate-500">
      Cargando mapa…
    </div>
  ),
});

type CentroConDistancia = CentroAcopioMapa & { distancia: number | null };

export default function HomePage() {
  const [centros, setCentros] = useState<CentroAcopioMapa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [grupoId, setGrupoId] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<Coordenadas | null>(null);
  const [localizando, setLocalizando] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);

  // Carga de centros desde GET /api/centros (público, sin token)
  useEffect(() => {
    let activo = true;
    apiFetch<CentroAcopioMapa[]>('/api/centros', { accessToken: null })
      .then((data) => {
        if (activo) setCentros(data ?? []);
      })
      .catch((err: Error) => {
        if (activo) setErrorCarga(err.message || 'No se pudieron cargar los centros.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  // Filtros + búsqueda + distancia (ordena por cercanía si hay ubicación)
  const visibles = useMemo<CentroConDistancia[]>(() => {
    const grupo = GRUPOS_RAEE.find((g) => g.id === grupoId) ?? GRUPOS_RAEE[0];
    const termino = normalizar(busqueda.trim());

    const lista = centros
      .filter((c) => centroAcepta(c.categorias_aceptadas, grupo))
      .filter(
        (c) =>
          !termino || normalizar(`${c.nombre} ${c.direccion ?? ''}`).includes(termino)
      )
      .map((c) => ({
        ...c,
        distancia: userLocation ? distanciaKm(userLocation, { lat: c.lat, lng: c.lng }) : null,
      }));

    if (userLocation) lista.sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0));
    return lista;
  }, [centros, grupoId, busqueda, userLocation]);

  // Si el centro seleccionado queda fuera del filtro, se deselecciona.
  useEffect(() => {
    if (selectedId && !visibles.some((c) => c.id === selectedId)) setSelectedId(null);
  }, [visibles, selectedId]);

  // Al seleccionar desde el mapa, desplaza la tarjeta correspondiente a la vista.
  useEffect(() => {
    if (!selectedId) return;
    document
      .getElementById(`centro-${selectedId}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  const handleGeolocalizacion = () => {
    setErrorUbicacion(null);
    if (!('geolocation' in navigator)) {
      setErrorUbicacion('Tu navegador no soporta geolocalización.');
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocalizando(false);
      },
      () => {
        setLocalizando(false);
        setErrorUbicacion('No se pudo acceder a tu ubicación. Revisa los permisos del navegador.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <span>🌿 Querétaro Limpio &amp; Circular</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Recicla tus aparatos electrónicos en <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy underline-offset-6">Querétaro</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Ubica centros de acopio para residuos de manejo especial (RAEE). Evita que metales pesados contaminen nuestros mantos acuíferos y gana puntos XP por tu compromiso ciudadano.
            </p>

            {/* Badges de impacto */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                📍 <strong>Cercanía</strong> según tu ubicación
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                🗺️ <strong>Mapa</strong> interactivo
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
                placeholder="Buscar por nombre, colonia o municipio (ej. San Juan del Río, Corregidora)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Botón de Geolocalización */}
            <button
              onClick={handleGeolocalizacion}
              disabled={localizando}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70 text-white rounded-xl text-sm font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <svg className={`w-4 h-4 ${localizando ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {localizando ? 'Localizando...' : userLocation ? 'Actualizar mi ubicación' : 'Centros Cerca de Mí'}
            </button>
          </div>

          {errorUbicacion && (
            <p className="text-xs text-red-600 pt-2">{errorUbicacion}</p>
          )}

          {/* Chips de residuos RAEE */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
            {GRUPOS_RAEE.map((grupo) => {
              const active = grupoId === grupo.id;
              return (
                <button
                  key={grupo.id}
                  onClick={() => setGrupoId(grupo.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{grupo.icono}</span>
                  <span>{grupo.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAPA INTERACTIVO & LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: listado (4 cols) */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Centros de Acopio</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  {visibles.length} {visibles.length === 1 ? 'resultado' : 'resultados'}
                </span>
              </h2>
              {userLocation && (
                <span className="text-xs text-slate-400">Ordenados por cercanía</span>
              )}
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {cargando && (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-28 rounded-xl bg-slate-200/70 animate-pulse" />
                  ))}
                </div>
              )}

              {!cargando && errorCarga && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700">
                  {errorCarga}
                </div>
              )}

              {!cargando && !errorCarga && visibles.length === 0 && (
                <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                  {centros.length === 0
                    ? 'Aún no hay centros de acopio registrados.'
                    : 'Ningún centro coincide con tu búsqueda o filtro.'}
                </div>
              )}

              {visibles.map((centro) => {
                const isSelected = selectedId === centro.id;
                return (
                  <div
                    key={centro.id}
                    id={`centro-${centro.id}`}
                    onClick={() => setSelectedId(isSelected ? null : centro.id)}
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
                      {centro.distancia !== null && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          {centro.distancia < 10
                            ? centro.distancia.toFixed(1)
                            : Math.round(centro.distancia)}{' '}
                          km
                        </span>
                      )}
                    </div>

                    {centro.direccion && (
                      <p className="text-xs text-slate-500 mb-2.5 line-clamp-2">{centro.direccion}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {centro.categorias_aceptadas.slice(0, 4).map((cat) => (
                        <span key={cat} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {cat}
                        </span>
                      ))}
                      {centro.categorias_aceptadas.length > 4 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5">
                          +{centro.categorias_aceptadas.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="line-clamp-1">🕒 {centro.horarios ?? 'Horario no disponible'}</span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${centro.lat},${centro.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-600 font-semibold hover:underline shrink-0"
                      >
                        Cómo llegar →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: mapa (8 cols) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="relative w-full h-[420px] sm:h-[580px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
              <MapboxView
                centros={visibles}
                selectedId={selectedId}
                onSelect={setSelectedId}
                userLocation={userLocation}
              />
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
                Utiliza el mapa con geolocalización para encontrar qué centro recibe exactamente los aparatos que quieres desechar.
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
                Gana XP &amp; Sube de Nivel
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
