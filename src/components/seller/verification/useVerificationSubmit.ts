
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { VerificationFormData } from './VerificationTypes';

export const useVerificationSubmit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      console.log(`Uploading file to ${path}:`, file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user?.id}/${path}/${fileName}`;

      // Ensure the bucket exists
      const { error: bucketError } = await supabase.storage
        .from('merchant-verifications')
        .list('', { limit: 1 });

      if (bucketError && bucketError.message.includes('The resource was not found')) {
        console.log('Creating merchant-verifications bucket...');
        const { error: createBucketError } = await supabase.storage
          .createBucket('merchant-verifications', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          });
        
        if (createBucketError) {
          console.warn('Could not create bucket (might already exist):', createBucketError);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('merchant-verifications')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('merchant-verifications')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const submitVerification = async (
    formData: VerificationFormData,
    storeName: string,
    storeId: string
  ): Promise<boolean> => {
    if (!user || !formData.ownerName || !formData.idDocument || !formData.selfieWithId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload both required documents.",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting verification submission...');
      
      // Upload documents
      const [idDocumentUrl, selfieUrl] = await Promise.all([
        uploadFile(formData.idDocument, 'id-documents'),
        uploadFile(formData.selfieWithId, 'selfies')
      ]);

      console.log('Documents uploaded successfully');

      // Submit verification request
      const { error } = await supabase
        .from('merchant_verifications')
        .insert({
          store_id: storeId,
          owner_id: user.id,
          merchant_name: storeName,
          owner_name: formData.ownerName,
          id_document_url: idDocumentUrl,
          selfie_url: selfieUrl,
          status: 'pending'
        });

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Verification request submitted successfully');

      toast({
        title: "Verification Submitted",
        description: "Your verification application has been submitted and is under review.",
      });

      return true;
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit verification. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVerification,
    isSubmitting
  };
};
