'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PerfilPage() {
  const { user, profile, isLoading, signOut } = useAuth();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('default');

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 font-medium">Cargando perfil ciudadano...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-900 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white">
            Inicia Sesión para ver tu Progreso
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
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

  const getAvatarDisplay = () => {
    if (selectedAvatar === 'planta') return '🌱';
    if (selectedAvatar === 'planeta') return '🌎';
    if (selectedAvatar === 'reciclaje') return '♻️';
    return profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : 'C';
  };

  return (
    <div className="flex-1 bg-gray-900 min-h-screen">
      {/* Header - Dark Mode */}
      <header className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                RQ
              </div>
              <span className="font-bold text-base text-white">ReciclaQro</span>
            </Link>

            <nav className="flex gap-1 flex-1 overflow-x-auto">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors whitespace-nowrap"
              >
                Mapa
              </Link>
              <Link
                href="/educacion"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors whitespace-nowrap"
              >
                Aprende
              </Link>
              <button className="px-3.5 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white whitespace-nowrap">
                Mi progreso
              </button>
            </nav>

            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-sm text-white hidden sm:block">
                {profile?.nombre || user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="w-9 h-9 rounded-full bg-gray-700 border-2 border-emerald-600 flex items-center justify-center font-bold text-emerald-400 hover:scale-105 transition-transform cursor-pointer"
              >
                {getAvatarDisplay()}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[640px] mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold text-white mb-4">Mi progreso</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-emerald-600 flex items-center justify-center text-2xl font-bold text-emerald-400">
              {getAvatarDisplay()}
            </div>
            <div>
              <div className="font-bold text-lg text-white">
                {profile?.nombre || 'Ciudadano Reciclador'}
              </div>
              <div className="text-sm text-emerald-400 font-semibold">
                🏆 Nivel {nivelActual} · Guardián del Suelo
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="bg-gray-700 rounded-full h-2.5 overflow-hidden mt-3">
            <div
              className="bg-emerald-600 h-full"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1.5">
            {xpActual} / {xpMetaSiguiente} XP para el siguiente nivel
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-3 gap-3.5 mt-5">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-xl font-bold text-emerald-400">12 kg</div>
              <div className="text-xs text-gray-400">CO₂ evitado</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-xl font-bold text-emerald-400">5</div>
              <div className="text-xs text-gray-400">Dispositivos entregados</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-xl font-bold text-emerald-400">3</div>
              <div className="text-xs text-gray-400">Meses activo</div>
            </div>
          </div>

          {/* History */}
          <div className="space-y-0">
            <div className="flex justify-between items-center py-2.5 border-b border-gray-700 text-sm">
              <span>2 laptops viejas</span>
              <span className="text-emerald-400 font-bold text-xs">+300 XP</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-gray-700 text-sm">
              <span>1 microondas</span>
              <span className="text-emerald-400 font-bold text-xs">+150 XP</span>
            </div>
            <div className="flex justify-between items-center py-2.5 text-sm">
              <span>5 kg de cartón reciclado</span>
              <span className="text-emerald-400 font-bold text-xs">+75 XP</span>
            </div>
          </div>

          <button className="w-full bg-amber-500 text-gray-900 border-none py-2.5 px-4 rounded-xl font-bold cursor-pointer mt-4 hover:bg-amber-400 transition-colors">
            + Reportar un reciclaje
          </button>

          {/* Rewards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mt-4">
            <div className="bg-gray-700/50 border border-emerald-600 rounded-xl p-3.5 text-xs">
              🌱 Planta nativa gratis
              <div className="text-gray-400 text-xs mt-1">Disponible ahora</div>
            </div>
            <div className="bg-gray-700/50 border border-gray-700 rounded-xl p-3.5 text-xs">
              🔒 Descuento refrendo
              <div className="text-gray-400 text-xs mt-1">Nivel 5</div>
            </div>
            <div className="bg-gray-700/50 border border-gray-700 rounded-xl p-3.5 text-xs">
              🔒 Certificado de impacto
              <div className="text-gray-400 text-xs mt-1">Nivel 10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 w-[90%] max-w-[320px] text-center">
            <h3 className="text-lg font-bold text-white mb-2">Selecciona tu avatar</h3>
            <p className="text-xs text-gray-400 mb-5">
              Elige una imagen temática o tu foto por defecto.
            </p>
            <div className="flex justify-center gap-4 mb-5">
              <button
                onClick={() => setSelectedAvatar('default')}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                {profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : 'C'}
              </button>
              <button
                onClick={() => setSelectedAvatar('planta')}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                🌱
              </button>
              <button
                onClick={() => setSelectedAvatar('planeta')}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                🌎
              </button>
              <button
                onClick={() => setSelectedAvatar('reciclaje')}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                ♻️
              </button>
            </div>
            <button
              onClick={() => setAvatarModalOpen(false)}
              className="bg-transparent border border-gray-600 text-white py-2 px-4 rounded-lg cursor-pointer font-semibold w-full hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
