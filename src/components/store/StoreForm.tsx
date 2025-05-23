
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { storeFormSchema, StoreFormValues, defaultValues } from './StoreFormSchema';
import StoreBasicInfoForm from './StoreBasicInfoForm';
import StoreContactInfoForm from './StoreContactInfoForm';
import StoreImageUploader from './StoreImageUploader';

const StoreForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, createStore } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
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
        description: "You must be logged in to create a store",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the createStore method from AuthContext which properly integrates with the auth system
      const storeData = await createStore({
        name: data.name,
        description: data.description,
        logo: logoPreview || '',
        owner_id: user.id,
        verified: false
      });
      
      if (storeData) {
        console.log('Store created successfully:', storeData);
        toast({
          title: "Store created successfully",
          description: `Your store "${data.name}" has been created. Welcome to your seller dashboard!`,
        });
        
        // Navigate to seller dashboard where they can manage their new store
        navigate('/seller/dashboard');
      } else {
        throw new Error('Failed to create store');
      }
    } catch (error) {
      console.error("Error creating store:", error);
      toast({
        title: "Error",
        description: "Failed to create store. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                {isSubmitting ? "Creating Store..." : "Create Store"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StoreForm;
