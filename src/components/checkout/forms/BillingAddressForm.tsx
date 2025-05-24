
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
import { BillingAddressForm as BillingAddressFormType } from '../hooks/useBillingAddressForm';

interface BillingAddressFormProps {
  form: UseFormReturn<BillingAddressFormType>;
  sameAsShipping: boolean;
  setSameAsShipping: (checked: boolean) => void;
  shippingAddress?: any;
  onSaveBillingAddress: () => void;
  showValidation?: boolean;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  form,
  sameAsShipping,
  setSameAsShipping,
  shippingAddress,
  onSaveBillingAddress,
  showValidation = false,
}) => {
  const handleSameAsShippingChange = (checked: boolean | "indeterminate") => {
    setSameAsShipping(checked === true);
  };

  const watchedValues = form.watch();

  // Get field error status for visual highlighting
  const getFieldClassName = (fieldName: keyof BillingAddressFormType) => {
    const fieldValue = watchedValues[fieldName];
    const hasValue = fieldValue && (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : fieldValue === true);
    const isTouched = form.formState.touchedFields[fieldName];
    const hasFormError = form.formState.errors[fieldName];
    
    let className = "bg-white transition-all duration-200";
    
    if (showValidation) {
      if (!hasValue) {
        // Field is empty and validation is showing
        className += " border-red-500 focus:border-red-500 focus:ring-red-500 shadow-sm shadow-red-100";
      } else if (hasValue && !hasFormError) {
        // Field has value and no validation errors
        className += " border-green-500 focus:border-green-500 focus:ring-green-500 shadow-sm shadow-green-100";
      }
    } else if (isTouched) {
      if (hasValue && !hasFormError) {
        className += " border-green-500 focus:border-green-500 focus:ring-green-500";
      }
    }
    
    return className;
  };

  // Check if form is complete for save button
  const isFormComplete = 
    watchedValues.firstName && watchedValues.firstName.trim() !== '' &&
    watchedValues.lastName && watchedValues.lastName.trim() !== '' &&
    watchedValues.email && watchedValues.email.trim() !== '' &&
    watchedValues.phone && watchedValues.phone.trim() !== '' &&
    watchedValues.address && watchedValues.address.trim() !== '' &&
    watchedValues.city && watchedValues.city.trim() !== '' &&
    watchedValues.province && watchedValues.province.trim() !== '' &&
    watchedValues.postalCode && watchedValues.postalCode.trim() !== '';

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
                <FormLabel className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className={getFieldClassName('firstName')}
                    disabled={sameAsShipping}
                    placeholder="Enter your first name"
                  />
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
                <FormLabel className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className={getFieldClassName('lastName')}
                    disabled={sameAsShipping}
                    placeholder="Enter your last name"
                  />
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
              <FormLabel className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  {...field} 
                  className={getFieldClassName('email')}
                  placeholder="Enter your email address"
                />
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
              <FormLabel className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  {...field} 
                  className={getFieldClassName('phone')}
                  placeholder="Enter your phone number"
                />
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
              <FormLabel className="text-sm font-medium">
                Street Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className={getFieldClassName('address')}
                  disabled={sameAsShipping}
                  placeholder="Enter your street address"
                />
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
                <FormLabel className="text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className={getFieldClassName('city')}
                    disabled={sameAsShipping}
                    placeholder="Enter city"
                  />
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
                <FormLabel className="text-sm font-medium">
                  Province <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className={getFieldClassName('province')}
                    disabled={sameAsShipping}
                    placeholder="Enter province"
                  />
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
                <FormLabel className="text-sm font-medium">
                  Postal Code <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className={getFieldClassName('postalCode')}
                    disabled={sameAsShipping}
                    placeholder="Enter postal code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!sameAsShipping && isFormComplete && (
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
