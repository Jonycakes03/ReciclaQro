'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CentroAcopioMapa } from '@/types';
import type { Coordenadas } from '@/lib/geo';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const TOKEN_VALIDO = MAPBOX_TOKEN.startsWith('pk.') && !MAPBOX_TOKEN.includes('tu_mapbox');

/** Querétaro, Qro. (vista inicial cuando aún no hay centros). */
const VISTA_INICIAL = { longitude: -100.3899, latitude: 20.5888, zoom: 10.5 };

type Props = {
  centros: CentroAcopioMapa[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  userLocation: Coordenadas | null;
};

export default function MapboxView({ centros, selectedId, onSelect, userLocation }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [cargado, setCargado] = useState(false);

  const seleccionado = centros.find((c) => c.id === selectedId) ?? null;

  // Encuadrar todos los centros visibles cuando cambia el conjunto (filtros/búsqueda/carga).
  const clave = centros.map((c) => c.id).join('|');
  useEffect(() => {
    const mapa = mapRef.current;
    if (!cargado || !mapa || centros.length === 0) return;

    const lngs = centros.map((c) => c.lng);
    const lats = centros.map((c) => c.lat);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    if (minLng === maxLng && minLat === maxLat) {
      mapa.flyTo({ center: [minLng, minLat], zoom: 12, duration: 600 });
    } else {
      mapa.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 70, maxZoom: 14, duration: 600 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargado, clave]);

  // Volar al centro seleccionado.
  useEffect(() => {
    const mapa = mapRef.current;
    if (!cargado || !mapa || !seleccionado) return;
    mapa.flyTo({
      center: [seleccionado.lng, seleccionado.lat],
      zoom: Math.max(mapa.getZoom(), 13),
      duration: 700,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargado, selectedId]);

  // Volar a la ubicación del usuario cuando se obtiene.
  useEffect(() => {
    const mapa = mapRef.current;
    if (!cargado || !mapa || !userLocation) return;
    mapa.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12, duration: 800 });
  }, [cargado, userLocation]);

  if (!TOKEN_VALIDO) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 p-6">
        <div className="max-w-sm text-center bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-2">
          <div className="text-3xl">🗺️</div>
          <h4 className="font-bold text-slate-900">Falta el token de Mapbox</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Define <code className="bg-slate-100 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> con tu
            token público (<code className="bg-slate-100 px-1 rounded">pk.…</code>) en{' '}
            <code className="bg-slate-100 px-1 rounded">.env.local</code> y reinicia el servidor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={VISTA_INICIAL}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
      onLoad={() => setCargado(true)}
      onClick={() => onSelect(null)}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {centros.map((centro) => {
        const activo = centro.id === selectedId;
        return (
          <Marker
            key={centro.id}
            longitude={centro.lng}
            latitude={centro.lat}
            anchor="bottom"
            style={{ zIndex: activo ? 10 : 1 }}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelect(centro.id);
            }}
          >
            <button
              type="button"
              aria-label={`Ver ${centro.nombre}`}
              className="cursor-pointer transition-transform hover:scale-110"
              style={{ transform: activo ? 'scale(1.25)' : undefined, transformOrigin: 'bottom center' }}
            >
              <svg width="30" height="40" viewBox="0 0 30 40" fill="none">
                <path
                  d="M15 0C6.7 0 0 6.7 0 15c0 11.3 15 25 15 25s15-13.7 15-25C30 6.7 23.3 0 15 0z"
                  fill={activo ? '#047857' : '#10b981'}
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="15" cy="15" r="5.5" fill="white" />
              </svg>
            </button>
          </Marker>
        );
      })}

      {userLocation && (
        <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
          <span className="relative flex h-4 w-4" title="Tu ubicación">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow" />
          </span>
        </Marker>
      )}

      {seleccionado && (
        <Popup
          longitude={seleccionado.lng}
          latitude={seleccionado.lat}
          anchor="bottom"
          offset={42}
          maxWidth="290px"
          closeOnClick={false}
          onClose={() => onSelect(null)}
        >
          <div className="space-y-1.5 pr-2">
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{seleccionado.nombre}</h3>
            {seleccionado.direccion && (
              <p className="text-xs text-slate-600 leading-snug">{seleccionado.direccion}</p>
            )}
            {seleccionado.horarios && (
              <p className="text-xs text-slate-700">🕒 {seleccionado.horarios}</p>
            )}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {seleccionado.categorias_aceptadas.slice(0, 6).map((cat) => (
                <span key={cat} className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                  {cat}
                </span>
              ))}
              {seleccionado.categorias_aceptadas.length > 6 && (
                <span className="text-[10px] text-slate-500 px-1 py-0.5">
                  +{seleccionado.categorias_aceptadas.length - 6}
                </span>
              )}
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${seleccionado.lat},${seleccionado.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-emerald-700 hover:underline pt-1"
            >
              Cómo llegar →
            </a>
          </div>
        </Popup>
      )}
    </Map>
  );
}
