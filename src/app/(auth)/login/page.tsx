'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailConfirmedParam = searchParams.get('confirmed');

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

    const { error } = await signInWithPassword(email.trim().toLowerCase(), password);

    if (error) {
      setStatus('error');
      const msg = error.message || '';

      if (msg.toLowerCase().includes('email not confirmed') || msg.toLowerCase().includes('unconfirmed')) {
        setErrorMessage(
          'Tu correo electrónico aún no ha sido verificado. Por favor revisa tu bandeja de entrada o spam y haz clic en el enlace de confirmación (solo se realiza una única vez al registrarte).'
        );
      } else if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Correo o contraseña incorrectos. Por favor verifica tus datos.');
      } else {
        setErrorMessage(msg || 'Error al iniciar sesión. Intenta nuevamente.');
      }
      return;
    }

    setStatus('idle');
    router.push('/perfil');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    const { error } = await resetPassword(email.trim().toLowerCase());

    if (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Error al enviar correo de recuperación.');
      return;
    }

    setResetEmailSent(true);
    setStatus('idle');
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold shadow-xs">
            🔐
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Accede con tu correo y contraseña registrados para ver tu progreso y registrar reciclajes.
          </p>
        </div>

        {emailConfirmedParam && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-4 text-xs flex items-start gap-2.5">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-bold">¡Correo confirmado con éxito!</p>
              <p className="text-emerald-800 text-[0.72rem] mt-0.5">
                Tu cuenta ya está activa. Ingresa tu contraseña a continuación para entrar.
              </p>
            </div>
          </div>
        )}

        {user ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
            <p className="text-sm font-semibold text-emerald-800">
              ¡Ya has iniciado sesión como {user.email}!
            </p>
            <Link
              href="/perfil"
              className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Ir a Mi Progreso →
            </Link>
          </div>
        ) : resetEmailSent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
            <div className="text-3xl">📬</div>
            <h3 className="text-sm font-bold text-emerald-900">
              ¡Correo enviado!
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada.
            </p>
            <button
              onClick={() => setResetEmailSent(false)}
              className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-900 pt-2 cursor-pointer"
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-700 leading-relaxed">
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
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
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={status === 'loading' || !email}
                  className="text-[0.72rem] text-slate-500 hover:text-emerald-700 font-medium disabled:opacity-40 cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>

            <div className="text-center text-xs pt-1">
              <span className="text-slate-500">¿Aún no tienes cuenta? </span>
              <Link
                href="/registro"
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Crear cuenta ciudadana
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-16 bg-slate-50 min-h-screen">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
