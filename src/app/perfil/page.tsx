'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/apiClient';
import type { CentroAcopioMapa } from '@/types/database';
import { Coordenadas } from '@/lib/geo';
import {
  APARATOS_RECICLAJE,
  AparatoReciclaje,
  NIVELES_RECICLAJE,
  calcularProgresoUsuario,
  validarGeocercaReciclaje,
  RADIO_GEOFENCE_METROS,
} from '@/lib/gamification';

interface RegistroHistorial {
  id: string;
  id_usuario: string;
  id_centro: string | null;
  tipo_aparato: string;
  xp_otorgada: number;
  fecha_entrega: string;
}

function PerfilContent() {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');

  // Estado del Dashboard
  const [tabActiva, setTabActiva] = useState<'historial' | 'niveles' | 'catalogo'>('historial');
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [centros, setCentros] = useState<CentroAcopioMapa[]>([]);

  // Estado del Modal de Registro
  const [modalAbierto, setModalAbierto] = useState(false);
  const [aparatoSeleccionado, setAparatoSeleccionado] = useState<AparatoReciclaje | null>(null);
  const [coordsUsuario, setCoordsUsuario] = useState<Coordenadas | null>(null);
  const [errorGps, setErrorGps] = useState<string | null>(null);
  const [obteniendoGps, setObteniendoGps] = useState(false);
  const [modoDemo, setModoDemo] = useState(false); // Para pruebas en aula/laboratorio
  const [centroSeleccionadoId, setCentroSeleccionadoId] = useState<string>('');
  const [enviandoRegistro, setEnviandoRegistro] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorRegistro, setErrorRegistro] = useState<string | null>(null);

  // Cargar catálogo de centros de acopio
  useEffect(() => {
    async function cargarCentros() {
      try {
        const res = await fetch('/api/centros');
        if (!res.ok) return;
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setCentros(json.data);
        }
      } catch (err) {
        console.error('Error cargando centros:', err);
      }
    }
    cargarCentros();
  }, []);

  // Cargar historial de reciclaje del usuario autenticado
  const cargarHistorial = useCallback(async () => {
    if (!user) return;
    try {
      setCargandoHistorial(true);
      const data = await apiFetch<{ historial: RegistroHistorial[] }>('/api/perfil?limit=50');
      if (data?.historial) {
        setHistorial(data.historial);
      }
    } catch (err) {
      console.warn('Error cargando historial de reciclaje:', err);
    } finally {
      setCargandoHistorial(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      cargarHistorial();
    }
  }, [user, cargarHistorial]);

  // Obtener geolocalización del usuario
  const solicitarUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorGps('Tu navegador no soporta geolocalización.');
      return;
    }
    setObteniendoGps(true);
    setErrorGps(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordsUsuario({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setObteniendoGps(false);
      },
      (err) => {
        console.warn('Error de geolocalización:', err);
        setObteniendoGps(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorGps('Permiso de ubicación denegado. Habilita el GPS para validar tu entrega.');
        } else {
          setErrorGps('No se pudo determinar tu ubicación exacta. Verifica tu señal GPS.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Abrir modal y solicitar GPS
  const handleAbrirModal = () => {
    setModalAbierto(true);
    setMensajeExito(null);
    setErrorRegistro(null);
    setAparatoSeleccionado(APARATOS_RECICLAJE[2]); // Celular por defecto
    solicitarUbicacion();
  };

  // Validación de geocerca
  const validacionGeocerca = validarGeocercaReciclaje(
    modoDemo && centros.length > 0 ? { lat: centros[0].lat, lng: centros[0].lng } : coordsUsuario,
    centros,
    RADIO_GEOFENCE_METROS
  );

  // Auto-seleccionar el centro más cercano válido
  useEffect(() => {
    if (validacionGeocerca.centroMasCercano) {
      setCentroSeleccionadoId(validacionGeocerca.centroMasCercano.id);
    } else if (centros.length > 0 && !centroSeleccionadoId) {
      setCentroSeleccionadoId(centros[0].id);
    }
  }, [validacionGeocerca.centroMasCercano, centros, centroSeleccionadoId]);

  // Manejador para registrar reciclaje
  const handleSubmitReciclaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aparatoSeleccionado) return;
    if (!validacionGeocerca.permitido && !modoDemo) {
      setErrorRegistro('Debes encontrarte físicamente en el centro de acopio para registrar.');
      return;
    }

    try {
      setEnviandoRegistro(true);
      setErrorRegistro(null);

      const centroId = centroSeleccionadoId || (validacionGeocerca.centroMasCercano ? validacionGeocerca.centroMasCercano.id : null);

      await apiFetch('/api/reciclaje', {
        method: 'POST',
        body: JSON.stringify({
          id_centro: centroId,
          tipo_aparato: aparatoSeleccionado.nombre,
          xp_otorgada: aparatoSeleccionado.xp,
        }),
      });

      setMensajeExito(`¡Genial! Has sumado +${aparatoSeleccionado.xp} XP por reciclar ${aparatoSeleccionado.nombre}.`);
      await refreshProfile();
      await cargarHistorial();

      // Cerrar modal tras 2.2 segundos
      setTimeout(() => {
        setModalAbierto(false);
        setMensajeExito(null);
      }, 2200);
    } catch (err) {
      console.error('Error al registrar reciclaje:', err);
      setErrorRegistro(err instanceof Error ? err.message : 'No se pudo guardar el registro.');
    } finally {
      setEnviandoRegistro(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-16 bg-slate-900 min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-300 font-medium">Cargando tu progreso ecológico...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario logeado
  if (!user) {
    return (
      <div className="flex-1 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
            <span className="text-5xl mb-4 inline-block">🌱</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Mi Progreso en ReciclaQro</h1>
            <p className="text-gray-600 max-w-xl mx-auto mb-8 text-base leading-relaxed">
              Registra tus entregas de residuos electrónicos en centros de acopio certificados, gana experiencia (XP), sube de nivel y visualiza tu impacto ambiental real en Querétaro.
            </p>

            {callbackError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6 max-w-md mx-auto">
                ⚠️ Hubo un error en la autenticación. Por favor intenta iniciar sesión nuevamente.
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="px-6 py-3 rounded-xl font-bold border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Crear Cuenta
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-100 text-left">
              <div className="p-4 bg-emerald-50/50 rounded-2xl">
                <span className="text-2xl mb-2 inline-block">📍</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Geolocalización Real</h3>
                <p className="text-xs text-gray-500">Valida tu presencia física en centros autorizados para registrar entregas.</p>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-2xl">
                <span className="text-2xl mb-2 inline-block">⚡</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">XP Proporcional</h3>
                <p className="text-xs text-gray-500">Aparatos más grandes o tóxicos otorgan mayor experiencia ambiental.</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-2xl">
                <span className="text-2xl mb-2 inline-block">👑</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">6 Rangos Ecológicos</h3>
                <p className="text-xs text-gray-500">Evoluciona desde Semilla Ecológica hasta Embajador Circular.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Progreso calculado
  const xpUsuario = profile?.experiencia_xp ?? 0;
  const progreso = calcularProgresoUsuario(xpUsuario);
  const totalAparatos = historial.length;
  // Estimación de impacto: promedio 85,000 L de agua protegida por entrega
  const aguaProtegidaLitros = totalAparatos * 85000;
  const metalesMitigadosKg = (totalAparatos * 2.4).toFixed(1);

  const getInicial = () => {
    if (profile?.nombre) return profile.nombre.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'C';
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header de Perfil */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-900/40">
                {progreso.infoNivel.icono}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-white">
                    {profile?.nombre || user.email?.split('@')[0]}
                  </h1>
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${progreso.infoNivel.colorBadge}`}>
                    Nivel {progreso.nivel} · {progreso.infoNivel.titulo}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleAbrirModal}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span className="text-lg">♻️</span>
                <span>Registrar Reciclaje</span>
              </button>
              <button
                onClick={() => signOut()}
                title="Cerrar Sesión"
                className="px-3.5 py-3 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer text-xs"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Barra de Progreso XP */}
          <div className="mt-8 pt-6 border-t border-slate-700/60">
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span>⚡ {xpUsuario} XP acumulada</span>
              </div>
              <div className="text-slate-400">
                {progreso.siguienteNivel ? (
                  <span>
                    Faltan <strong className="text-white">{progreso.xpFaltante} XP</strong> para Nivel {progreso.siguienteNivel.nivel} ({progreso.siguienteNivel.titulo})
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">¡Nivel Máximo de Honor Alcanzado! 👑</span>
                )}
              </div>
            </div>

            {/* Barra Visual */}
            <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-emerald-500/50"
                style={{ width: `${Math.max(5, progreso.porcentaje)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[0.7rem] text-slate-400 mt-2">
              <span>{progreso.infoNivel.titulo} ({progreso.xpNivelBase} XP)</span>
              <span>{progreso.porcentaje}% completado</span>
              {progreso.siguienteNivel && (
                <span>{progreso.siguienteNivel.titulo} ({progreso.xpParaSiguiente} XP)</span>
              )}
            </div>
          </div>
        </div>

        {/* Métricas de Impacto */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-emerald-400 text-xl mb-1">⚡</div>
            <div className="text-2xl font-extrabold text-white">{xpUsuario}</div>
            <div className="text-xs text-slate-400">Puntos de XP</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-cyan-400 text-xl mb-1">📦</div>
            <div className="text-2xl font-extrabold text-white">{totalAparatos}</div>
            <div className="text-xs text-slate-400">Aparatos Reciclados</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-blue-400 text-xl mb-1">💧</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">~{aguaProtegidaLitros.toLocaleString()} L</div>
            <div className="text-xs text-slate-400">Agua Protegida</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-purple-400 text-xl mb-1">🛡️</div>
            <div className="text-2xl font-extrabold text-white">~{metalesMitigadosKg} kg</div>
            <div className="text-xs text-slate-400">Residuo Peligroso Evitado</div>
          </div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex gap-2 border-b border-slate-800 mb-6 pb-2">
          <button
            onClick={() => setTabActiva('historial')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              tabActiva === 'historial'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Mi Historial ({historial.length})
          </button>
          <button
            onClick={() => setTabActiva('niveles')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              tabActiva === 'niveles'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏆 Niveles y Rangos
          </button>
          <button
            onClick={() => setTabActiva('catalogo')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              tabActiva === 'catalogo'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Tabla de XP por Aparato
          </button>
        </div>

        {/* Tab 1: Historial de Entregas */}
        {tabActiva === 'historial' && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Registro Histórico de Reciclaje</h2>

            {cargandoHistorial ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Cargando entregas...
              </div>
            ) : historial.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-700 rounded-2xl">
                <span className="text-4xl block mb-2">📦</span>
                <p className="text-base font-bold text-white mb-1">Aún no tienes reciclajes registrados</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Cuando lleves aparatos electrónicos a un centro de acopio autorizado, usa el botón &quot;Registrar Reciclaje&quot; con tu GPS activo para registrar tu entrega y ganar XP.
                </p>
                <button
                  onClick={handleAbrirModal}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Registrar mi primer reciclaje
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/80 text-xs text-slate-400">
                      <th className="pb-3 font-semibold">Aparato</th>
                      <th className="pb-3 font-semibold">Centro de Acopio</th>
                      <th className="pb-3 font-semibold">Fecha de Entrega</th>
                      <th className="pb-3 font-semibold text-right">XP Ganada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {historial.map((item) => {
                      const centro = centros.find((c) => c.id === item.id_centro);
                      const fecha = new Date(item.fecha_entrega).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      return (
                        <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3.5 font-medium text-white flex items-center gap-2">
                            <span>♻️</span>
                            <span>{item.tipo_aparato}</span>
                          </td>
                          <td className="py-3.5 text-slate-300 text-xs">
                            {centro ? centro.nombre : 'Centro de Acopio Certificado'}
                          </td>
                          <td className="py-3.5 text-slate-400 text-xs">{fecha}</td>
                          <td className="py-3.5 text-right font-bold text-emerald-400">
                            +{item.xp_otorgada} XP
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Niveles y Rangos */}
        {tabActiva === 'niveles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NIVELES_RECICLAJE.map((lvl) => {
              const esNivelActual = lvl.nivel === progreso.nivel;
              const alcanzado = xpUsuario >= lvl.xpMin;

              return (
                <div
                  key={lvl.nivel}
                  className={`p-5 rounded-2xl border transition-all ${
                    esNivelActual
                      ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                      : alcanzado
                      ? 'bg-slate-800/70 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lvl.icono}</span>
                      <div>
                        <h3 className="font-bold text-white text-base">
                          Nivel {lvl.nivel}: {lvl.titulo}
                        </h3>
                        <span className="text-xs text-emerald-400 font-semibold">
                          {lvl.xpMax === Infinity ? `${lvl.xpMin}+ XP` : `${lvl.xpMin} – ${lvl.xpMax - 1} XP`}
                        </span>
                      </div>
                    </div>
                    {esNivelActual && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[0.65rem] font-bold px-2 py-0.5 rounded-full">
                        TU RANGO ACTUAL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{lvl.descripcion}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Catálogo de Puntos XP por Aparato */}
        {tabActiva === 'catalogo' && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Escala de Puntos por Aparato Electrónico</h2>
            <p className="text-xs text-slate-400 mb-6">
              La experiencia otorgada depende del tamaño del residuo y de la toxicidad de sus componentes (metales pesados, retardantes de flama, gases refrigerantes y baterías).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {APARATOS_RECICLAJE.map((ap) => (
                <div key={ap.id} className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl flex items-start gap-3">
                  <span className="text-3xl p-2 bg-slate-800 rounded-xl">{ap.icono}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{ap.nombre}</h4>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
                        +{ap.xp} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ap.descripcion}</p>
                    <p className="text-[0.7rem] text-teal-300/80 mt-1.5 flex items-center gap-1">
                      <span>🌱</span>
                      <span>{ap.impactoAmbiental}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL INTERACTIVO: REGISTRO DE RECICLAJE CON GEOCERCA GPS                 */}
      {/* ========================================================================= */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="text-lg font-bold text-white">Registrar Reciclaje</h3>
                  <p className="text-xs text-slate-400">Verificación de presencia por geolocalización</p>
                </div>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {mensajeExito ? (
              <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center text-3xl animate-bounce">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-white">¡Reciclaje Registrado!</h4>
                <p className="text-sm text-emerald-400 max-w-xs">{mensajeExito}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReciclaje} className="flex-1 overflow-y-auto pt-4 space-y-5 pr-1">

                {/* 1. SECCIÓN DE ESTADO DE GEOCERCA */}
                <div className="p-4 rounded-2xl border transition-all text-xs space-y-2.5 bg-slate-800/80 border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[0.68rem]">
                      Validación de Ubicación GPS
                    </span>
                    {obteniendoGps ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Obteniendo GPS...
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={solicitarUbicacion}
                        className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        Actualizar GPS
                      </button>
                    )}
                  </div>

                  {errorGps && (
                    <div className="bg-red-950/40 border border-red-800/50 text-red-300 p-2.5 rounded-xl">
                      {errorGps}
                    </div>
                  )}

                  {/* Alerta de Geocerca */}
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      validacionGeocerca.permitido || modoDemo
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-amber-950/40 border-amber-600/60 text-amber-200'
                    }`}
                  >
                    <span className="text-lg">
                      {validacionGeocerca.permitido || modoDemo ? '✅' : '⚠️'}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-xs leading-snug">
                        {modoDemo
                          ? '📍 MODO PRUEBA EN AULA ACTIVO: Presencia simulada en el centro de acopio.'
                          : validacionGeocerca.mensaje}
                      </p>
                      {!validacionGeocerca.permitido && !modoDemo && (
                        <p className="text-[0.68rem] opacity-80">
                          Para salvaguardar la transparencia de los puntos XP, sólo es posible acreditar reciclaje estando dentro de un radio de {RADIO_GEOFENCE_METROS}m de un centro oficial.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggle para pruebas / demostración en aula */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[0.7rem] text-slate-400">
                    <span>¿Pruebas en salón o desarrollo?</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modoDemo}
                        onChange={(e) => setModoDemo(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span className={modoDemo ? 'text-emerald-400 font-bold' : ''}>
                        Modo Demostración
                      </span>
                    </label>
                  </div>
                </div>

                {/* 2. SELECTOR DE CENTRO DE ACOPIO */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Centro de Acopio
                  </label>
                  <select
                    value={centroSeleccionadoId}
                    onChange={(e) => setCentroSeleccionadoId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {centros.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.direccion ? `(${c.direccion})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. SELECTOR DE APARATO ELECTRÓNICO */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Selecciona el Aparato a Reciclar
                    </label>
                    {aparatoSeleccionado && (
                      <span className="text-xs font-bold text-emerald-400">
                        Otorga +{aparatoSeleccionado.xp} XP
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-800 rounded-xl bg-slate-950/50">
                    {APARATOS_RECICLAJE.map((ap) => {
                      const sel = aparatoSeleccionado?.id === ap.id;
                      return (
                        <button
                          key={ap.id}
                          type="button"
                          onClick={() => setAparatoSeleccionado(ap)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            sel
                              ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xl">{ap.icono}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate leading-tight">{ap.nombre}</p>
                            <span className="text-[0.68rem] text-emerald-400 font-bold block mt-0.5">
                              +{ap.xp} XP
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {aparatoSeleccionado && (
                    <p className="text-[0.72rem] text-slate-400 mt-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                      💡 <strong>Impacto:</strong> {aparatoSeleccionado.impactoAmbiental}
                    </p>
                  )}
                </div>

                {errorRegistro && (
                  <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl">
                    ⚠️ {errorRegistro}
                  </div>
                )}

                {/* BOTÓN SUBMIT */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={enviandoRegistro || (!validacionGeocerca.permitido && !modoDemo)}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {enviandoRegistro ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Acreditando XP...</span>
                      </>
                    ) : (
                      <>
                        <span>Acreditar Entrega (+{aparatoSeleccionado?.xp ?? 0} XP)</span>
                        <span>⚡</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-16 bg-slate-900 min-h-screen">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <PerfilContent />
    </Suspense>
  );
}
