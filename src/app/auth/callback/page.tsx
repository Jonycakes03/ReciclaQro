'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('Verificando tu acceso...');

  useEffect(() => {
    const manejarCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (!code) {
        // Sin código — puede ser flujo implícito (hash token)
        // onAuthStateChange lo manejará si hay sesión en el hash
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/perfil');
        } else {
          router.replace('/perfil?error=auth_callback_failed');
        }
        return;
      }

      // Intercambio PKCE: el browser tiene el code_verifier disponible
      setMensaje('Intercambiando código de acceso...');
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[auth/callback] Error al intercambiar código:', error.message);
        router.replace('/perfil?error=auth_callback_failed');
      } else {
        setMensaje('¡Acceso verificado! Redirigiendo...');
        router.replace('/perfil');
      }
    };

    manejarCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">{mensaje}</p>
      </div>
    </div>
  );
}
