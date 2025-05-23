
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(2, 'Please enter a city'),
  province: z.string().min(2, 'Please enter a province'),
  postalCode: z.string().min(4, 'Please enter a valid postal code'),
});

type ShippingAddressForm = z.infer<typeof shippingAddressSchema>;

interface ShippingFormProps {
  onAddressChange: (address: any) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onAddressChange }) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ShippingAddressForm>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
    },
  });

  const watchedValues = form.watch();

  // Load saved address from profile only once
  useEffect(() => {
    if (profile?.location) {
      try {
        const savedData = JSON.parse(profile.location);
        const shippingAddress = savedData.shippingAddress || savedData;
        
        form.setValue('firstName', shippingAddress.firstName || '');
        form.setValue('lastName', shippingAddress.lastName || '');
        form.setValue('address', shippingAddress.address || '');
        form.setValue('city', shippingAddress.city || '');
        form.setValue('province', shippingAddress.province || '');
        form.setValue('postalCode', shippingAddress.postalCode || '');
      } catch (error) {
        console.log('No saved address found');
      }
    }
  }, [profile, form]);

  // Only notify parent of changes - NO AUTO-SAVE
  useEffect(() => {
    if (form.formState.isValid) {
      onAddressChange(watchedValues);
    }
  }, [watchedValues, form.formState.isValid, onAddressChange]);

  const saveShippingAddress = async () => {
    if (!user || !form.formState.isValid) {
      toast({
        title: "Save Failed",
        description: "Please complete all required fields first.",
        variant: "destructive",
      });
      return;
    }

    try {
      let locationData = {};
      if (profile?.location) {
        try {
          locationData = JSON.parse(profile.location);
        } catch (error) {
          console.log('Creating new location data');
        }
      }

      const updatedData = {
        ...locationData,
        shippingAddress: watchedValues
      };

      const { error } = await supabase
        .from('profiles')
        .update({ location: JSON.stringify(updatedData) })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Address Saved",
        description: "Your shipping address has been saved for future orders.",
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your address. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.isValid && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ Address ready for checkout
            </p>
          </div>
        )}

        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={saveShippingAddress}
          className="mt-4"
        >
          Save Address for Future Orders
        </Button>
      </form>
    </Form>
  );
};

export default ShippingForm;
