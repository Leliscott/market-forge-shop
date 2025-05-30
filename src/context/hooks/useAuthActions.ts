
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Profile, Store } from '../types/AuthTypes';
import { fetchUserProfile, fetchUserStore, updateUserProfile } from '../utils/authUtils';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

interface UseAuthActionsProps {
  user: any;
  setUser: (user: any) => void;
  setProfile: (profile: Profile | null) => void;
  setUserStore: (store: Store | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setSession: (session: any) => void;
}

export const useAuthActions = ({
  user,
  setUser,
  setProfile,
  setUserStore,
  setIsAuthenticated,
  setSession
}: UseAuthActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendWelcomeEmail } = useEmailNotifications();

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

      // Send welcome email
      try {
        await sendWelcomeEmail(email, name, role);
      } catch (emailError) {
        console.log('Welcome email failed:', emailError);
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
      setUser(null);
      setProfile(null);
      setUserStore(null);
      setIsAuthenticated(false);
      setSession(null);
      
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
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
    }
    return success;
  };

  return {
    login,
    register,
    logout,
    updateProfile,
    loadUserProfile
  };
};
