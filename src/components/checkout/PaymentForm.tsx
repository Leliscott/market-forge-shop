
import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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
  const [showValidation, setShowValidation] = useState(false);
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

    // Show validation errors if user has interacted with form
    if (Object.keys(form.formState.touchedFields).length > 0) {
      setShowValidation(true);
    }
  }, [watchedValues, form.formState.isValid, form.formState.touchedFields, onBillingAddressChange]);

  // Get missing required fields
  const getMissingFields = () => {
    const missing = [];
    const errors = form.formState.errors;
    
    if (errors.firstName) missing.push('First Name');
    if (errors.lastName) missing.push('Last Name');
    if (errors.email) missing.push('Email Address');
    if (errors.phone) missing.push('Phone Number');
    if (errors.address) missing.push('Street Address');
    if (errors.city) missing.push('City');
    if (errors.province) missing.push('Province');
    if (errors.postalCode) missing.push('Postal Code');
    if (errors.agreeToTerms) missing.push('Terms and Conditions Agreement');
    if (errors.agreeToPrivacy) missing.push('Privacy Policy Consent');
    if (errors.agreeToProcessing) missing.push('Electronic Transaction Consent');
    
    return missing;
  };

  const missingFields = getMissingFields();
  const hasErrors = missingFields.length > 0;

  return (
    <div className="space-y-6">
      <SecurityNotice />
      <PaymentMethodSelector />

      {showValidation && hasErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Please complete the following required fields:</div>
            <ul className="list-disc list-inside space-y-1">
              {missingFields.map((field, index) => (
                <li key={index} className="text-sm">{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form className="space-y-4">
          <BillingAddressForm
            form={form}
            sameAsShipping={sameAsShipping}
            setSameAsShipping={setSameAsShipping}
            shippingAddress={shippingAddress}
            onSaveBillingAddress={saveBillingAddress}
            showValidation={showValidation}
          />
          <LegalComplianceSection 
            form={form} 
            showValidation={showValidation}
          />
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
