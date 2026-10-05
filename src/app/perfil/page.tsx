'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PerfilPage() {
  const { user, profile, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Cargando perfil ciudadano...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Inicia Sesión para ver tu Perfil
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            El sistema de gamificación y registro de reciclajes te permite acumular puntos XP, subir de nivel cívico y ganar medallas por cuidar el medio ambiente de Querétaro.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            Acceder con Magic Link
          </Link>
        </div>
      </div>
    );
  }

  const nivelActual = profile?.nivel ?? 1;
  const xpActual = profile?.xp ?? 0;
  const xpMetaSiguiente = nivelActual * 500;
  const porcentajeProgreso = Math.min(100, Math.round((xpActual / xpMetaSiguiente) * 100));

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Cabecera del Usuario */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center text-2xl font-black shadow-md">
              {profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {profile?.nombre || 'Ciudadano Reciclador'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Nivel {nivelActual}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-xl transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Nivel y Barra de Progreso XP */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Progreso de Experiencia (XP)</h2>
              <p className="text-xs text-slate-500">Recicla aparatos electrónicos para subir de nivel.</p>
            </div>
            <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-mono">
              {xpActual} / {xpMetaSiguiente} XP
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${porcentajeProgreso}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Nivel {nivelActual}</span>
            <span>{porcentajeProgreso}% completado</span>
            <span>Nivel {nivelActual + 1}</span>
          </div>
        </div>

        {/* Historial de Reciclaje y Medallas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historial de entregas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Entregas de RAEE Registradas</h3>
              <span className="text-[11px] text-slate-400">Querétaro</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-900">Punto Verde Parque Querétaro 2000</p>
                  <p className="text-[11px] text-slate-500">1x Laptop vieja, 2x Cables HDMI</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  +120 XP
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-900">Centro Acopio Municipal Corregidora</p>
                  <p className="text-[11px] text-slate-500">10x Baterías alcalinas AA</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  +50 XP
                </span>
              </div>
            </div>
          </div>

          {/* Medallas y Logros */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Medallas Ambientales</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
                <div className="text-2xl mb-1">🌱</div>
                <p className="text-xs font-bold text-emerald-900">Paso Inicial</p>
                <p className="text-[10px] text-emerald-700">Primer dispositivo reciclado</p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
                <div className="text-2xl mb-1">🔋</div>
                <p className="text-xs font-bold text-emerald-900">Guardián del Agua</p>
                <p className="text-[10px] text-emerald-700">Reciclaje de pilas/baterías</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center opacity-60">
                <div className="text-2xl mb-1">💻</div>
                <p className="text-xs font-bold text-slate-700">Héroe del Silicio</p>
                <p className="text-[10px] text-slate-500">5 computadoras recicladas</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center opacity-60">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs font-bold text-slate-700">Embajador Qro</p>
                <p className="text-[10px] text-slate-500">Alcanza el Nivel 10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
