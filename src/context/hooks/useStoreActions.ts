
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Store } from '../types/AuthTypes';

interface UseStoreActionsProps {
  user: any;
  setUserStore: (store: Store | null) => void;
}

export const useStoreActions = ({ user, setUserStore }: UseStoreActionsProps) => {
  const { toast } = useToast();

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
      console.log('Creating store with details:', storeDetails);
      
      const { data: newStore, error } = await supabase
        .from('stores')
        .insert({
          name: storeDetails.name,
          description: storeDetails.description,
          logo: storeDetails.logo || '',
          owner_id: user.id,
          verified: false
        })
        .select()
        .single();

      if (error) {
        console.error('Store creation error:', error);
        toast({
          title: "Error",
          description: `Failed to create store: ${error.message}`,
          variant: "destructive"
        });
        return null;
      }

      console.log('Store created successfully:', newStore);
      setUserStore(newStore as Store);
      
      toast({
        title: "Success",
        description: `Store "${storeDetails.name}" created successfully!`,
      });
      
      return newStore as Store;
    } catch (error: any) {
      console.error('Unexpected error creating store:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while creating the store",
        variant: "destructive"
      });
      return null;
    }
  };

  return { createStore };
};
