
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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

type BillingAddressForm = z.infer<typeof billingAddressSchema>;

interface PaymentFormProps {
  onBillingAddressChange: (address: any) => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBillingAddressChange, isProcessing }) => {
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const form = useForm<BillingAddressForm>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
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

  const watchedValues = form.watch();

  React.useEffect(() => {
    if (form.formState.isValid) {
      onBillingAddressChange(watchedValues);
    }
  }, [watchedValues, form.formState.isValid, onBillingAddressChange]);

  const handleSameAsShippingChange = (checked: boolean | "indeterminate") => {
    setSameAsShipping(checked === true);
  };

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Your payment is secured by PayFast, South Africa's leading payment gateway. 
          All personal information is protected in accordance with POPIA regulations.
        </AlertDescription>
      </Alert>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </h3>
        
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-20 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PayFast</span>
              </div>
            </div>
            <div>
              <p className="font-medium">PayFast Secure Payment</p>
              <p className="text-sm text-muted-foreground">
                Credit Card, Debit Card, EFT, or Instant EFT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Billing Information
        </h3>

        <Form {...form}>
          <form className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsShipping"
                checked={sameAsShipping}
                onCheckedChange={handleSameAsShippingChange}
              />
              <Label htmlFor="sameAsShipping" className="text-sm">
                Same as shipping address
              </Label>
            </div>

            {!sameAsShipping && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
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
                          <Input {...field} className="bg-white" />
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
                        <Input {...field} className="bg-white" />
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
                          <Input {...field} className="bg-white" />
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
                          <Input {...field} className="bg-white" />
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
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Enhanced Legal Compliance Section */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-medium text-sm">Legal Compliance & Consent (Required by South African Law)</h4>
              
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I agree to the{' '}
                        <a href="/terms" target="_blank" className="underline font-medium text-primary hover:text-primary/80">
                          Terms and Conditions
                        </a>{' '}
                        including Consumer Protection Act compliance
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToPrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I consent to the processing of my personal information in accordance with{' '}
                        <a href="/terms" target="_blank" className="underline font-medium text-primary hover:text-primary/80">
                          POPIA Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToProcessing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I consent to electronic transactions under the Electronic Communications and Transactions Act (ECT Act)
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Your data is encrypted and secure
                </span>
              </div>
              <p className="text-xs text-green-700">
                We use 256-bit SSL encryption and comply with PCI DSS standards. 
                Your payment details are never stored on our servers and are processed securely by PayFast.
                All data handling complies with South African POPIA regulations.
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentForm;
