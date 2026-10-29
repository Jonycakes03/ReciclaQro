'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('Verificando tu cuenta...');

  useEffect(() => {
    const manejarCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (!code) {
        // Sin código: verificar si ya hay sesión activa
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/perfil');
        } else {
          router.replace('/login?confirmed=true');
        }
        return;
      }

      // Intercambio de código PKCE para verificar y crear sesión
      setMensaje('Confirmando tu correo electrónico...');
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[auth/callback] Error al confirmar correo:', error.message);
        router.replace('/login?error=confirmation_failed');
      } else {
        setMensaje('¡Correo confirmado con éxito! Accediendo a tu cuenta...');
        router.replace('/perfil');
      }
    };

    manejarCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl max-w-sm w-full flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Verificación de Cuenta</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">{mensaje}</p>
        </div>
      </div>
    </div>
  );
}
