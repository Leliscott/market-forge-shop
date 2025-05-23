
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Profile, Store } from '../types/AuthTypes';
import { fetchUserProfile, fetchUserStore, createStoreInDb, updateUserProfile } from '../utils/authUtils';

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userStore, setUserStore] = useState<Store | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadUserProfile = async (userId: string) => {
    const profileData = await fetchUserProfile(userId);
    setProfile(profileData);
    
    if (profileData?.role === 'seller') {
      const storeData = await fetchUserStore(userId);
      setUserStore(storeData);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'buyer' | 'seller'
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Registration error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear local state first
      setUser(null);
      setProfile(null);
      setUserStore(null);
      setIsAuthenticated(false);
      setSession(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      
      // Navigate to home page
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: "An unexpected error occurred during logout",
        variant: "destructive"
      });
    }
  };

  const createStore = async (storeDetails: Omit<Store, 'id'>): Promise<Store | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a store.",
        variant: "destructive"
      });
      return null;
    }
    
    const newStore = await createStoreInDb(user.id, storeDetails, toast);
    if (newStore) {
      setUserStore(newStore);
    }
    return newStore;
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive"
      });
      return false;
    }

    const success = await updateUserProfile(user.id, profileData, toast);
    if (success) {
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
    }
    return success;
  };

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
    setIsAuthenticated,
    login,
    register,
    logout,
    createStore,
    updateProfile,
    loadUserProfile
  };
};
