
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile, Store } from '../types/AuthTypes';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userStore, setUserStore] = useState<Store | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    user,
    setUser,
    profile,
    setProfile,
    session,
    setSession,
    userStore,
    setUserStore,
    isAuthenticated,
    setIsAuthenticated
  };
};
