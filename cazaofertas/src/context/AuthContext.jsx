import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import supabase from '../services/supabase';
import AuthContext from './AuthContextInstance';

console.log('AuthContext.jsx: Inicializando proveedor de autenticación');

export function AuthProvider({ children }) {
  console.log('AuthContext.jsx: Renderizando AuthProvider');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const lastEventRef = useRef(null);
  const mountedRef = useRef(true);
  const initializingRef = useRef(true);
  const subscriptionRef = useRef(null); // Store subscription in a ref to avoid dependency issues

  const handleAuthChange = useCallback(async (event, session) => {
    const now = Date.now();
    // Evitar eventos duplicados en corto tiempo
    if (lastEventRef.current && now - lastEventRef.current < 1000) {
      console.log('[AuthContext] 🔄 Debouncing auth event:', event);
      return;
    }
    
    lastEventRef.current = now;
    console.log('[AuthContext] 📢 Auth event:', event);
    
    try {
      if (session?.user && mountedRef.current) {
        setUser(session.user);
        console.log('[AuthContext] ✅ Session updated for:', session.user.email);
      
        if ((!profile || profile.id !== session.user.id) && mountedRef.current) {
          const profileData = {
            id: session.user.id,
            nombre_usuario: session.user.nombre || session.user.email.split('@')[0],
            email: session.user.email,
            avatar_url: session.user.avatar_url,
            role: session.user.role || 'user'
          };
          
          console.log('[AuthContext] 👤 Profile updated:', profileData.nombre_usuario);
          setProfile(profileData);
          setError(null);
        }
      } else if (mountedRef.current) {
        setUser(null);
        setProfile(null);
        setError(null);
      }
    } catch (err) {
      console.error('[AuthContext] ❌ Unexpected error:', err);
      if (mountedRef.current) {
        setError(err);
      }
    } finally {
      if (mountedRef.current && initializingRef.current) {
        setLoading(false);
        initializingRef.current = false;
      }
    }
  }, []); // Remove profile from dependencies to avoid re-renders
  
  // Use a separate effect for initial setup - runs only once
  useEffect(() => {
    console.log('[AuthContext] 🚀 Initial setup');
    mountedRef.current = true;
    
    // Return cleanup function for when the component unmounts
    return () => {
      console.log('[AuthContext] 🧹 Final cleanup - component unmounting');
      mountedRef.current = false;
      
      if (subscriptionRef.current) {
        console.log('[AuthContext] 🔌 Final unsubscribe from auth events');
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Empty dependency array - runs once on mount
  
  // Separate effect for auth subscription
  useEffect(() => {
    if (!mountedRef.current) return;
    
    console.log('[AuthContext] 🔄 Setting up auth subscription');
    initializingRef.current = true;
    setLoading(true);
    
    const initAuth = async () => {
      try {
        // Clean up previous subscription if exists
        if (subscriptionRef.current) {
          console.log('[AuthContext] 🧹 Cleaning up previous subscription');
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
        
        console.log('[AuthContext] 🟡 Checking initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user && mountedRef.current) {
          console.log('[AuthContext] ✅ Session found:', session.user.email);
          setUser(session.user);
          const profileData = {
            id: session.user.id,
            nombre_usuario: session.user.nombre || session.user.email.split('@')[0],
            email: session.user.email,
            avatar_url: session.user.avatar_url,
            role: session.user.role || 'user'
          };
          setProfile(profileData);
        } else {
          // Ensure we set loading to false even if no user is found
          console.log('[AuthContext] ℹ️ No session found');
          setUser(null);
          setProfile(null);
        }
        
        // Subscribe to auth changes
        const { data } = supabase.auth.onAuthStateChange(handleAuthChange);
        subscriptionRef.current = data.subscription;
        
      } catch (error) {
        console.error('[AuthContext] 🔴 Error:', error);
        if (mountedRef.current) {
          setError(error);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          initializingRef.current = false;
        }
      }
    };

    const timeoutId = setTimeout(() => {
      initAuth();
    }, 100); // Small delay to prevent rapid re-initialization
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [handleAuthChange]); // Only depends on handleAuthChange

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };
  const register = async (email, password, username) => {
    try {
      setLoading(true);
      console.log('[AuthContext] 🔵 Registering user:', email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            nombre: username
          }
        }
      });
      
      if (error) {
        console.error('[AuthContext] 🔴 Registration error:', error);
        throw error;
      }
      
      console.log('[AuthContext] ✅ Registration successful, confirmation email sent');
      
      return { 
        data, 
        error: null,
        message: 'Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.'
      };
    } catch (error) {
      console.error('[AuthContext] 🔴 Registration exception:', error);
      return { 
        data: null, 
        error,
        message: error.message || 'Error al registrarse, por favor intenta de nuevo.'
      };
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('[AuthContext] 🔴 Logout error:', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUser,
    setProfile
  }), [user, profile, loading, error]);

  console.log('[AuthContext] 🔄 Current state:', { 
    authenticated: !!user, 
    loading, 
    hasError: !!error 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Inicializando aplicación...</p>
          <p className="text-xs text-gray-500 mt-2">Por favor, espere...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
