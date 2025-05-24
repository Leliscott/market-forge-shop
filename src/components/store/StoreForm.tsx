
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from '@/components/ui/card';
import { storeFormSchema, StoreFormValues, defaultValues } from './StoreFormSchema';
import { useAuth } from '@/context/AuthContext';
import { useStoreImageHandlers } from './hooks/useStoreImageHandlers';
import { useStoreFormSubmit } from './hooks/useStoreFormSubmit';
import StoreBasicInfoForm from './StoreBasicInfoForm';
import StoreContactInfoForm from './StoreContactInfoForm';
import StoreImagesSection from './StoreImagesSection';
import StoreFormActions from './StoreFormActions';
import StoreSetupCompletion from './StoreSetupCompletion';

interface StoreFormProps {
  isEditing?: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { userStore } = useAuth();
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  
  const {
    logoPreview,
    bannerPreview,
    setLogoPreview,
    handleLogoChange,
    handleBannerChange,
    removeLogo,
    removeBanner
  } = useStoreImageHandlers();

  const { isSubmitting, onSubmit } = useStoreFormSubmit({
    isEditing,
    logoPreview,
    setCurrentStoreId
  });

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
  }, [isEditing, userStore, form, setLogoPreview]);

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
              
              <StoreImagesSection
                logoPreview={logoPreview}
                bannerPreview={bannerPreview}
                handleLogoChange={handleLogoChange}
                handleBannerChange={handleBannerChange}
                removeLogo={removeLogo}
                removeBanner={removeBanner}
              />
              
              <StoreContactInfoForm form={form} />
              
              <StoreFormActions
                isEditing={isEditing}
                isSubmitting={isSubmitting}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <StoreSetupCompletion
        currentStoreId={currentStoreId}
        userStoreId={userStore?.id}
        isEditing={isEditing}
        onFinishSetup={handleFinishSetup}
      />
    </div>
  );
};

export default StoreForm;
