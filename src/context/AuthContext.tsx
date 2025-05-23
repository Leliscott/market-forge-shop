
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types/AuthTypes';
import { useAuthOperations } from './hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    profile,
    setProfile,
    session,
    setSession,
    userStore,
    setUserStore,
    isAuthenticated,
    setIsAuthenticated,
    login,
    register,
    logout,
    createStore,
    updateProfile,
    loadUserProfile
  } = useAuthOperations();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);

        if (session?.user) {
          // Use setTimeout to prevent potential infinite loops
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          // Clear all user-related state when session ends
          setProfile(null);
          setUserStore(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isAuthenticated,
    userStore,
    login,
    register,
    logout,
    createStore,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
