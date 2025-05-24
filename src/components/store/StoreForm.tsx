
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { storeFormSchema, StoreFormValues, defaultValues } from './StoreFormSchema';
import StoreBasicInfoForm from './StoreBasicInfoForm';
import StoreContactInfoForm from './StoreContactInfoForm';
import StoreImageUploader from './StoreImageUploader';
import DeliveryServicesForm from './DeliveryServicesForm';

interface StoreFormProps {
  isEditing?: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, createStore, userStore } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Load existing store data when editing
  useEffect(() => {
    if (isEditing && userStore) {
      setCurrentStoreId(userStore.id);
      form.reset({
        name: userStore.name || '',
        description: userStore.description || '',
        email: '',
        phone: '',
        website: '',
        category: '',
      });
      
      if (userStore.logo) {
        setLogoPreview(userStore.logo);
      }
    }
  }, [isEditing, userStore, form]);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };
  
  const removeBanner = () => {
    setBannerPreview(null);
    setBannerFile(null);
  };
  
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

  const handleFinishSetup = () => {
    navigate('/seller/dashboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <StoreBasicInfoForm form={form} />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Store Images</h2>
                
                <div className="space-y-6">
                  <StoreImageUploader
                    id="logo"
                    label="Store Logo *"
                    description="Upload a logo that represents your brand (recommended: 512x512px)"
                    imagePreview={logoPreview}
                    handleImageChange={handleLogoChange}
                    removeImage={removeLogo}
                  />
                  
                  <StoreImageUploader
                    id="banner"
                    label="Store Banner"
                    description="Upload a banner image for your store (recommended: 1200x400px)"
                    imagePreview={bannerPreview}
                    handleImageChange={handleBannerChange}
                    removeImage={removeBanner}
                  />
                </div>
              </div>
              
              <StoreContactInfoForm form={form} />
              
              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isEditing ? "Updating Store..." : "Creating Store...") 
                    : (isEditing ? "Update Store" : "Create Store")
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Show delivery services form after store creation or when editing */}
      {(currentStoreId || (isEditing && userStore)) && (
        <div className="space-y-4">
          <DeliveryServicesForm 
            storeId={currentStoreId || userStore?.id || ''} 
            isEditing={true}
          />
          
          {!isEditing && currentStoreId && (
            <div className="flex justify-center">
              <Button onClick={handleFinishSetup} size="lg">
                Complete Store Setup
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreForm;
