
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StoreFormValues } from '../StoreFormSchema';

interface UseStoreFormSubmitProps {
  isEditing: boolean;
  logoPreview: string | null;
  setCurrentStoreId: (id: string | null) => void;
}

export const useStoreFormSubmit = ({ 
  isEditing, 
  logoPreview, 
  setCurrentStoreId 
}: UseStoreFormSubmitProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, createStore, userStore } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: StoreFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to manage a store",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && userStore) {
        // Update existing store
        const { error } = await supabase
          .from('stores')
          .update({
            name: data.name,
            description: data.description,
            logo: logoPreview || userStore.logo,
            updated_at: new Date().toISOString()
          })
          .eq('id', userStore.id);

        if (error) throw error;

        toast({
          title: "Store updated successfully",
          description: `Your store "${data.name}" has been updated.`,
        });
        
        // Navigate back to seller dashboard
        navigate('/seller/dashboard');
      } else {
        // Create new store
        const storeData = await createStore({
          name: data.name,
          description: data.description,
          logo: logoPreview || '',
          owner_id: user.id,
          verified: false
        });
        
        if (storeData) {
          console.log('Store created successfully:', storeData);
          setCurrentStoreId(storeData.id);
          
          toast({
            title: "Store created successfully",
            description: `Your store "${data.name}" has been created. Please configure your delivery services.`,
          });
          
          // Don't navigate yet - let user configure delivery services first
        } else {
          throw new Error('Failed to create store');
        }
      }
    } catch (error) {
      console.error("Error managing store:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} store. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onSubmit
  };
};
