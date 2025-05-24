
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type BillingAddressForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToProcessing: boolean;
};

interface BillingAddressFormProps {
  form: UseFormReturn<BillingAddressForm>;
  sameAsShipping: boolean;
  setSameAsShipping: (checked: boolean) => void;
  shippingAddress?: any;
  onSaveBillingAddress: () => void;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  form,
  sameAsShipping,
  setSameAsShipping,
  shippingAddress,
  onSaveBillingAddress,
}) => {
  const handleSameAsShippingChange = (checked: boolean | "indeterminate") => {
    setSameAsShipping(checked === true);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Lock className="h-5 w-5" />
        Billing Information
      </h3>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAsShipping"
          checked={sameAsShipping}
          onCheckedChange={handleSameAsShippingChange}
          disabled={!shippingAddress}
        />
        <Label htmlFor="sameAsShipping" className="text-sm">
          Same as shipping address
        </Label>
      </div>

      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" disabled={sameAsShipping} />
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
                  <Input {...field} className="bg-white" disabled={sameAsShipping} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input type="tel" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" disabled={sameAsShipping} />
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
                  <Input {...field} className="bg-white" disabled={sameAsShipping} />
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
                  <Input {...field} className="bg-white" disabled={sameAsShipping} />
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
                  <Input {...field} className="bg-white" disabled={sameAsShipping} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!sameAsShipping && form.formState.isValid && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onSaveBillingAddress}
            className="mt-4"
          >
            Save Billing Address
          </Button>
        )}
      </div>
    </div>
  );
};

export default BillingAddressForm;
