
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
});

const provinces = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

interface QuickShippingFormProps {
  onAddressChange: (address: any) => void;
  onDeliveryChange: (delivery: any) => void;
}

const QuickShippingForm: React.FC<QuickShippingFormProps> = ({ 
  onAddressChange, 
  onDeliveryChange 
}) => {
  const { profile } = useAuth();
  const { items } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
    },
  });

  // Get unique store IDs from cart items
  const storeIds = [...new Set(items.map(item => item.storeId))].filter(Boolean);

  // Fetch delivery services for the first store (simplified for now)
  const { data: deliveryServices } = useQuery({
    queryKey: ['delivery-services', storeIds[0]],
    queryFn: async () => {
      if (!storeIds[0]) return [];
      const { data, error } = await supabase
        .from('delivery_services')
        .select('*')
        .eq('store_id', storeIds[0])
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeIds[0],
  });

  // Load saved address from profile
  useEffect(() => {
    if (profile?.location) {
      try {
        const locationData = JSON.parse(profile.location);
        if (locationData.shippingAddress) {
          const saved = locationData.shippingAddress;
          form.setValue('firstName', saved.firstName || '');
          form.setValue('lastName', saved.lastName || '');
          form.setValue('address', saved.address || '');
          form.setValue('city', saved.city || '');
          form.setValue('province', saved.province || '');
          form.setValue('postalCode', saved.postalCode || '');
        }
      } catch (error) {
        console.log('No saved address found');
      }
    }
  }, [profile, form]);

  // Watch form values and notify parent
  const watchedValues = form.watch();
  useEffect(() => {
    const isValid = form.formState.isValid;
    onAddressChange({
      ...watchedValues,
      isValid
    });
  }, [watchedValues, form.formState.isValid, onAddressChange]);

  // Handle delivery selection
  const handleDeliverySelect = (delivery: any) => {
    setSelectedDelivery(delivery);
    onDeliveryChange(delivery);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
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
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Cape Town" {...field} />
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
                  <FormLabel>Province</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="8000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      {/* Quick Delivery Options */}
      {deliveryServices && deliveryServices.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Delivery Options</h3>
          <div className="grid gap-3">
            {deliveryServices.map((service) => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-colors ${
                  selectedDelivery?.id === service.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleDeliverySelect(service)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.service_name}</span>
                        <Badge variant="secondary">{service.service_type}</Badge>
                      </div>
                    </div>
                    <span className="font-medium">
                      R{Number(service.charge_amount).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickShippingForm;
