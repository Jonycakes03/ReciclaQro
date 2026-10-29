'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { apiFetch } from '@/lib/apiClient';

// Marcar como dynamic para evitar error de pre-renderización
export const dynamic = 'force-dynamic';

export default function CrearContrasenaPage() {
  const router = useRouter();
  const { user, session, refreshProfile } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Si no hay sesión, redirigir a login dentro de useEffect
  useEffect(() => {
    if (!loading && !session && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [session, loading, router]);

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validaciones
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Actualizar contraseña en Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { password_set: true },
      });

      if (updateError) {
        throw updateError;
      }

      // Crear fila en usuarios explícitamente (POST /api/perfil)
      // Esto asegura que el usuario existe en la base de datos
      if (session.access_token) {
        try {
          await apiFetch('/api/perfil', {
            method: 'POST',
            accessToken: session.access_token,
            body: JSON.stringify({}),
          });
        } catch (apiError) {
          console.error('Error al crear perfil:', apiError);
          // No fallamos el flujo si el perfil ya existe
        }
      }

      // Refrescamos el perfil para asegurar que existe
      await refreshProfile();

      setSuccess(true);
      
      // Redirigir a /perfil después de 2 segundos
      setTimeout(() => {
        router.push('/perfil');
      }, 2000);

    } catch (err) {
      console.error('Error al establecer contraseña:', err);
      setError(err instanceof Error ? err.message : 'Error al establecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña establecida!</h2>
            <p className="text-gray-600">Tu cuenta está lista. Redirigiendo a tu perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Contraseña</h1>
          <p className="text-gray-600">
            Establece una contraseña para tu cuenta: <span className="font-medium text-emerald-600">{user?.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Estableciendo contraseña...' : 'Establecer Contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            La contraseña debe tener al menos 8 caracteres
          </p>
        </div>
      </div>
    </div>
  );
}
