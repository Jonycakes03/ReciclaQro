'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { signInWithPassword, resetPassword, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setStatus('loading');
    setErrorMessage('');

    const { error } = await signInWithPassword(email, password);

    if (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      return;
    }

    setStatus('idle');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    const { error } = await resetPassword(email);

    if (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Error al enviar correo de recuperación.');
      return;
    }

    setResetEmailSent(true);
    setStatus('idle');
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold shadow-xs">
            🔐
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Ingresa tu correo y contraseña para acceder a tu cuenta.
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
              Ir a Mi Progreso →
            </Link>
          </div>
        ) : resetEmailSent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
            <div className="text-3xl">📬</div>
            <h3 className="text-sm font-bold text-emerald-900">
              ¡Correo enviado!
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada.
            </p>
            <button
              onClick={() => setResetEmailSent(false)}
              className="text-xs font-medium text-emerald-800 underline hover:text-emerald-900 pt-2"
            >
              Volver al login
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

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            <div className="flex items-center justify-between text-xs">
              <Link
                href="/registro"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Crear cuenta
              </Link>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={status === 'loading' || !email}
                className="text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Al ingresar aceptas participar en el programa ciudadano voluntario de ReciclaQro.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
