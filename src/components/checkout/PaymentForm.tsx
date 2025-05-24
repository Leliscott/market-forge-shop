
import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useBillingAddressForm } from './hooks/useBillingAddressForm';
import SecurityNotice from './forms/SecurityNotice';
import PaymentMethodSelector from './forms/PaymentMethodSelector';
import BillingAddressForm from './forms/BillingAddressForm';
import LegalComplianceSection from './forms/LegalComplianceSection';

interface PaymentFormProps {
  onBillingAddressChange: (address: any) => void;
  isProcessing: boolean;
  shippingAddress?: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onBillingAddressChange, 
  isProcessing,
  shippingAddress 
}) => {
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const { form, saveBillingAddress } = useBillingAddressForm();

  const watchedValues = form.watch();

  // Auto-fill billing from shipping when checkbox is checked
  useEffect(() => {
    if (sameAsShipping && shippingAddress) {
      form.setValue('firstName', shippingAddress.firstName || '');
      form.setValue('lastName', shippingAddress.lastName || '');
      form.setValue('address', shippingAddress.address || '');
      form.setValue('city', shippingAddress.city || '');
      form.setValue('province', shippingAddress.province || '');
      form.setValue('postalCode', shippingAddress.postalCode || '');
    }
  }, [sameAsShipping, shippingAddress, form]);

  useEffect(() => {
    // Always pass the current form values, but mark as valid only when all required fields are filled
    const isFormValid = form.formState.isValid && 
                       watchedValues.agreeToTerms && 
                       watchedValues.agreeToPrivacy && 
                       watchedValues.agreeToProcessing;
    
    onBillingAddressChange({
      ...watchedValues,
      isValid: isFormValid
    });
  }, [watchedValues, form.formState.isValid, onBillingAddressChange]);

  return (
    <div className="space-y-6">
      <SecurityNotice />
      <PaymentMethodSelector />

      <Form {...form}>
        <form className="space-y-4">
          <BillingAddressForm
            form={form}
            sameAsShipping={sameAsShipping}
            setSameAsShipping={setSameAsShipping}
            shippingAddress={shippingAddress}
            onSaveBillingAddress={saveBillingAddress}
          />
          <LegalComplianceSection form={form} />
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
