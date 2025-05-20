
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  location?: string;
  accepted_terms: boolean;
}

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  userStore: Store | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<boolean>;
  logout: () => void;
  createStore: (storeDetails: Omit<Store, 'id'>) => Promise<Store | null>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userStore, setUserStore] = useState<Store | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
          if (profile?.role === 'seller') {
            await fetchUserStore(session.user.id);
          }
        } else {
          setProfile(null);
          setUserStore(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data as Profile);
      
      if (data.role === 'seller') {
        await fetchUserStore(userId);
      }

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Fetch user store if they are a seller
  const fetchUserStore = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          console.error('Error fetching store:', error);
        }
        return;
      }

      setUserStore(data as Store);
    } catch (error) {
      console.error('Error in fetchUserStore:', error);
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
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    setUser(null);
    setProfile(null);
    setUserStore(null);
    setIsAuthenticated(false);
    setSession(null);
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    
    navigate('/');
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
    
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([
          { 
            ...storeDetails,
            owner_id: user.id 
          }
        ])
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Store creation failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      const newStore = data as Store;
      setUserStore(newStore);
      
      toast({
        title: "Store created",
        description: `"${storeDetails.name}" has been successfully created!`,
      });
      
      return newStore;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
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

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...profileData } : null);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated!",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const value = {
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
