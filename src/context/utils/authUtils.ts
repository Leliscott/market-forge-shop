
import { supabase } from '@/integrations/supabase/client';
import { Profile, Store } from '../types/AuthTypes';
import { Toast } from '@/components/ui/use-toast';

// Fetch user profile from database
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Fetch user store if they are a seller
export const fetchUserStore = async (userId: string): Promise<Store | null> => {
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
      return null;
    }

    return data as Store;
  } catch (error) {
    console.error('Error in fetchUserStore:', error);
    return null;
  }
};

// Create a new store
export const createStoreInDb = async (
  userId: string, 
  storeDetails: Omit<Store, 'id'>, 
  toast: (props: Toast) => void
): Promise<Store | null> => {
  try {
    const { data, error } = await supabase
      .from('stores')
      .insert([
        { 
          ...storeDetails,
          owner_id: userId 
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
    
    toast({
      title: "Store created",
      description: `"${storeDetails.name}" has been successfully created!`,
    });
    
    return data as Store;
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<Profile>,
  toast: (props: Toast) => void
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);

    if (error) {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

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
