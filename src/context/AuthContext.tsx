'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { apiFetch } from '@/lib/apiClient';
import { Usuario, AuthContextType, PerfilResponse } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Obtiene el perfil vía GET /api/perfil (el servidor lo crea si es la primera visita)
  const fetchProfile = useCallback(async (accessToken: string): Promise<Usuario | null> => {
    try {
      const data = await apiFetch<PerfilResponse>('/api/perfil?limit=1', { accessToken });
      return data.usuario;
    } catch (err) {
      console.error('Error al obtener el perfil:', err);
      return null;
    }
  }, []);

  // Refresca el perfil (p. ej. después de registrar un reciclaje y sumar XP)
  const refreshProfile = useCallback(async () => {
    if (!session?.access_token) return;
    const userProfile = await fetchProfile(session.access_token);
    if (userProfile) setProfile(userProfile);
  }, [session, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // onAuthStateChange emite INITIAL_SESSION al suscribirse, además de login, logout y refresh.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        if (!isMounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (!newSession?.user) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        // El refresco de token no cambia el perfil: evitamos una petición innecesaria.
        if (event === 'TOKEN_REFRESHED') {
          setIsLoading(false);
          return;
        }

        // Se difiere para no llamar a la red dentro del callback de auth.
        setTimeout(async () => {
          const userProfile = await fetchProfile(newSession.access_token);
          if (!isMounted) return;
          setProfile(userProfile);
          setIsLoading(false);
        }, 0);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);


  // Inicio de sesión con Magic Link (sin contraseña)
  const signInWithOtp = async (email: string) => {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Alias para compatibilidad con el código existente
  const signInWithEmail = signInWithOtp;

  // Cierre de sesión
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    signInWithOtp,
    signInWithEmail,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom Hook para consumir el contexto de autenticación en cualquier componente cliente.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
