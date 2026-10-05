'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signInWithEmail, user } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await signInWithEmail(email);
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Error al enviar el enlace. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold shadow-xs">
            ✉️
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Acceso Ciudadano
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Ingresa tu correo para recibir un enlace de acceso seguro (Magic Link). Sin contraseñas que recordar.
          </p>
        </div>

        {user ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-3">
            <p className="text-sm font-semibold text-emerald-800">
              ¡Ya has iniciado sesión como {user.email}!
            </p>
            <Link
              href="/perfil"
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Ir a Mi Perfil →
            </Link>
          </div>
        ) : status === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
            <div className="text-3xl">📬</div>
            <h3 className="text-sm font-bold text-emerald-900">
              ¡Revisa tu bandeja de entrada!
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Hemos enviado un enlace mágico a <strong>{email}</strong>. Haz clic en el enlace de tu correo para iniciar sesión automáticamente.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-xs font-medium text-emerald-800 underline hover:text-emerald-900 pt-2"
            >
              ¿Usar otro correo?
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {status === 'loading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Enviando enlace...</span>
                </>
              ) : (
                'Enviar Magic Link'
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Al ingresar aceptas participar en el programa ciudadano voluntario de ReciclaQro.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
