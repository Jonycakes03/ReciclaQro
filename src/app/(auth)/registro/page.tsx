'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegistroPage() {
  const { signUpWithPassword, user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validaciones
    if (!nombre.trim()) {
      setStatus('error');
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }

    const edadNum = Number(edad);
    if (!edad || isNaN(edadNum) || edadNum < 5 || edadNum > 120) {
      setStatus('error');
      setErrorMessage('Por favor ingresa una edad válida (entre 5 y 120 años).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setStatus('loading');

    const { error } = await signUpWithPassword({
      email: email.trim().toLowerCase(),
      password,
      nombre: nombre.trim(),
      edad: edadNum,
    });

    if (error) {
      setStatus('error');
      // Traducir mensajes comunes de Supabase
      if (error.message.includes('User already registered')) {
        setErrorMessage('Ya existe una cuenta con este correo. Prueba iniciando sesión.');
      } else if (error.message.includes('Password should be at least')) {
        setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      } else {
        setErrorMessage(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
      }
      return;
    }

    setStatus('success');
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold shadow-xs">
            🌱
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Crear Cuenta Ciudadana
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Únete a la red de reciclaje de Querétaro y empieza a acumular experiencia y beneficios ambientales.
          </p>
        </div>

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
        ) : status === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              📬
            </div>
            <h3 className="text-lg font-bold text-emerald-950">
              ¡Revisa tu correo electrónico!
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Hemos enviado un correo a <strong className="font-semibold text-emerald-950">{email}</strong> con un enlace para confirmar tu cuenta.
            </p>
            <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200/70 text-left text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>ℹ️</span> <span>Confirmación única:</span>
              </p>
              <p className="text-[0.73rem] text-emerald-800">
                Solo debes confirmar tu correo esta primera vez. A partir de entonces, iniciarás sesión directamente con tu correo y contraseña sin necesidad de volver a confirmar.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full inline-block py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                Ir a Iniciar Sesión →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Valeria Gómez"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Edad */}
            <div>
              <label htmlFor="edad" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Edad
              </label>
              <input
                type="number"
                id="edad"
                required
                min={5}
                max={120}
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Ej. 22"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Correo */}
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
                placeholder="valeria@ejemplo.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Botón Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando tu cuenta...</span>
                  </>
                ) : (
                  'Crear Cuenta y Enviar Confirmación'
                )}
              </button>
            </div>

            <div className="text-center text-xs pt-1">
              <span className="text-slate-500">¿Ya tienes cuenta? </span>
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
