
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const billingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(2, 'Please enter a city'),
  province: z.string().min(2, 'Please enter a province'),
  postalCode: z.string().min(4, 'Please enter a valid postal code'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
  agreeToProcessing: z.boolean().refine(val => val === true, 'You must consent to data processing'),
});

export type BillingAddressForm = z.infer<typeof billingAddressSchema>;

export const useBillingAddressForm = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();

  const form = useForm<BillingAddressForm>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
      agreeToProcessing: false,
    },
  });

  // Load saved billing address
  useEffect(() => {
    if (profile?.location) {
      try {
        const savedData = JSON.parse(profile.location);
        if (savedData.billingAddress) {
          const billing = savedData.billingAddress;
          form.setValue('firstName', billing.firstName || '');
          form.setValue('lastName', billing.lastName || '');
          form.setValue('phone', billing.phone || '');
          form.setValue('address', billing.address || '');
          form.setValue('city', billing.city || '');
          form.setValue('province', billing.province || '');
          form.setValue('postalCode', billing.postalCode || '');
        }
      } catch (error) {
        console.log('No saved billing address found');
      }
    }
  }, [profile, form]);

  const saveBillingAddress = async () => {
    if (!user || !form.formState.isValid) return;

    try {
      // Get existing location data
      let locationData = {};
      if (profile?.location) {
        try {
          locationData = JSON.parse(profile.location);
        } catch (error) {
          console.log('Creating new location data');
        }
      }

      const watchedValues = form.getValues();

      // Update with billing address
      const updatedData = {
        ...locationData,
        billingAddress: {
          firstName: watchedValues.firstName,
          lastName: watchedValues.lastName,
          phone: watchedValues.phone,
          address: watchedValues.address,
          city: watchedValues.city,
          province: watchedValues.province,
          postalCode: watchedValues.postalCode,
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update({ location: JSON.stringify(updatedData) })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Billing Address Saved",
        description: "Your billing address has been saved for future orders.",
      });
    } catch (error) {
      console.error('Error saving billing address:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your billing address. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    saveBillingAddress,
  };
};
