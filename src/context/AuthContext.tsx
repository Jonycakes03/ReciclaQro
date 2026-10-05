'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Usuario, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carga o crea el perfil en la tabla 'usuarios'
  const fetchOrCreateProfile = useCallback(async (currentUser: User): Promise<Usuario | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error al obtener perfil de usuario:', error.message);
        return null;
      }

      if (data) {
        return data as Usuario;
      }

      // Si no existe aún en la tabla (registro nuevo con Magic Link), inicializamos el perfil
      const nuevoPerfil: Partial<Usuario> = {
        id: currentUser.id,
        email: currentUser.email || '',
        nombre: currentUser.user_metadata?.nombre || currentUser.email?.split('@')[0] || 'Ciudadano Qro',
        nivel: 1,
        xp: 0,
      };

      const { data: inserted, error: insertError } = await supabase
        .from('usuarios')
        .insert(nuevoPerfil)
        .select()
        .single();

      if (insertError) {
        console.warn('Aviso al auto-crear perfil (RLS o trigger existente):', insertError.message);
        return nuevoPerfil as Usuario;
      }

      return inserted as Usuario;
    } catch (err) {
      console.error('Error inesperado sincronizando perfil:', err);
      return null;
    }
  }, []);

  // Función para refrescar el perfil (después de sumar XP o editar perfil)
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const userProfile = await fetchOrCreateProfile(user);
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [user, fetchOrCreateProfile]);

  useEffect(() => {
    let isMounted = true;

    // 1. Obtener la sesión inicial existente
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al recuperar sesión inicial:', error.message);
        }

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            const userProfile = await fetchOrCreateProfile(initialSession.user);
            if (isMounted) setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error('Error en inicialización de Auth:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // 2. Suscripción a cambios de estado de autenticación (Login, Magic Link callback, Logout, Token Refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        if (!isMounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const userProfile = await fetchOrCreateProfile(newSession.user);
          if (isMounted) setProfile(userProfile);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

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
