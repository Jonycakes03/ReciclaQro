'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PerfilPage() {
  const { user, profile, isLoading, signInWithOtp, signOut } = useAuth();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('default');
  const [email, setEmail] = useState('');
  const [authPanelOpen, setAuthPanelOpen] = useState(callbackError ? true : false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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

  // Si no hay usuario logeado, mostramos la interfaz "Ingresar / Mi progreso" estilo prototipo
  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;
      setStatus('loading');
      setErrorMsg('');
      const { error } = await signInWithOtp(email);
      if (error) {
        console.error('Error enviando magic link:', error.message);
        setErrorMsg(error.message || 'Error al enviar el enlace. Intenta nuevamente.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    };

    return (
      <div className="flex-1 min-h-screen bg-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi progreso</h1>
          
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-5 text-sm text-gray-500 mb-6 max-w-2xl">
            <strong className="text-gray-900">El registro es opcional.</strong> Solo lo necesitas si quieres llevar el conteo de tu impacto y ganar puntos. Consultar el mapa y el hub educativo no lo requiere.
          </div>

          {callbackError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4 max-w-md">
              ⚠️ El enlace mágico expiró o ya fue usado. Por favor solicita uno nuevo con tu correo.
            </div>
          )}
          
          <div className="flex gap-2.5 mt-2 flex-wrap mb-4">
            <button 
              onClick={() => setAuthPanelOpen(!authPanelOpen)}
              className="px-5 py-3 rounded-xl font-bold cursor-pointer border border-emerald-600 bg-emerald-600 text-white transition-colors hover:bg-emerald-700 shadow-sm"
            >
              ✨ Acceder con mi correo
            </button>
          </div>

          {/* Auth Panel */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out max-w-[360px] bg-white border border-gray-200 rounded-2xl shadow-sm ${
              authPanelOpen ? 'max-h-[500px] opacity-100 p-5 mt-2' : 'max-h-0 opacity-0 p-0 mt-0 border-transparent'
            }`}
          >
            {status === 'success' ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="font-bold text-gray-900 mb-2">¡Enlace enviado!</h3>
                <p className="text-sm text-gray-500">
                  Revisa tu bandeja de entrada en <strong>{email}</strong>. Da clic en el enlace mágico para iniciar sesión.
                </p>
                <button 
                  onClick={() => {
                    setStatus('idle');
                    setAuthPanelOpen(false);
                  }}
                  className="mt-4 px-4 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                {status === 'error' && errorMsg && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 mb-3">
                    {errorMsg}
                  </div>
                )}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-xs font-semibold text-gray-600">Correo electrónico</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Te enviaremos un enlace mágico a tu correo para entrar — no necesitas crear ni recordar una contraseña.
                </div>
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-emerald-600 text-white border-none px-4 py-2.5 rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 disabled:opacity-70 shadow-sm"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar enlace mágico ➔'}
                </button>
                {status === 'error' && (
                  <p className="text-xs text-red-500 mt-3 text-center">Hubo un error al enviar el enlace. Intenta de nuevo.</p>
                )}
              </form>
            )}
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mt-6 max-w-[360px]">
            ¿Primera vez aquí o ya tienes cuenta? No importa: con Magic Links tu correo es todo lo que necesitas para entrar o registrarte.
          </p>
        </div>
      </div>
    );
  }

  // Si HAY usuario logeado, mostramos el dashboard en progreso (dark mode)
  const getAvatarDisplay = () => {
    if (selectedAvatar === 'planta') return '🌱';
    if (selectedAvatar === 'planeta') return '🌎';
    if (selectedAvatar === 'reciclaje') return '♻️';
    return profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'C';
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

            <div className="flex items-center gap-2.5 relative">
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

      {/* Main Content - Placeholder en progreso */}
      <div className="max-w-[640px] mx-auto px-4 py-8 pb-16 text-center mt-10">
        <h1 className="text-2xl font-bold text-white mb-6">Mi progreso</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="text-5xl mb-2">🚧</div>
          <h2 className="text-xl font-bold text-emerald-400">Sección en progreso backend-frontend</h2>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Actualmente estamos conectando el frontend con el backend para mostrar tus estadísticas reales de XP, recompensas e historial de reciclaje.
            ¡Vuelve pronto para ver tus logros!
          </p>
          <button 
            onClick={() => signOut()}
            className="mt-6 px-5 py-2.5 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
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
                onClick={() => { setSelectedAvatar('default'); setAvatarModalOpen(false); }}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                {profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'C'}
              </button>
              <button
                onClick={() => { setSelectedAvatar('planta'); setAvatarModalOpen(false); }}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                🌱
              </button>
              <button
                onClick={() => { setSelectedAvatar('planeta'); setAvatarModalOpen(false); }}
                className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-2xl cursor-pointer transition-all hover:border-emerald-600 hover:scale-110 text-emerald-400 font-bold"
              >
                🌎
              </button>
              <button
                onClick={() => { setSelectedAvatar('reciclaje'); setAvatarModalOpen(false); }}
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
