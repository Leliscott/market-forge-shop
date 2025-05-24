
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
    // Check if all required fields have values (not just form validation)
    const hasRequiredFields = 
      watchedValues.firstName && watchedValues.firstName.trim() !== '' &&
      watchedValues.lastName && watchedValues.lastName.trim() !== '' &&
      watchedValues.email && watchedValues.email.trim() !== '' &&
      watchedValues.phone && watchedValues.phone.trim() !== '' &&
      watchedValues.address && watchedValues.address.trim() !== '' &&
      watchedValues.city && watchedValues.city.trim() !== '' &&
      watchedValues.province && watchedValues.province.trim() !== '' &&
      watchedValues.postalCode && watchedValues.postalCode.trim() !== '' &&
      watchedValues.agreeToTerms === true &&
      watchedValues.agreeToPrivacy === true &&
      watchedValues.agreeToProcessing === true;

    // Trigger validation only after user starts interacting
    const hasUserInteracted = Object.keys(form.formState.touchedFields).length > 0;
    
    onBillingAddressChange({
      ...watchedValues,
      isValid: hasRequiredFields
    });

    // Show validation feedback if user has started filling the form
    if (hasUserInteracted) {
      setShowValidation(true);
    }
  }, [watchedValues, form.formState.touchedFields, onBillingAddressChange]);

  // Get missing required fields for user feedback
  const getMissingFields = () => {
    const missing = [];
    
    if (!watchedValues.firstName || watchedValues.firstName.trim() === '') missing.push('First Name');
    if (!watchedValues.lastName || watchedValues.lastName.trim() === '') missing.push('Last Name');
    if (!watchedValues.email || watchedValues.email.trim() === '') missing.push('Email Address');
    if (!watchedValues.phone || watchedValues.phone.trim() === '') missing.push('Phone Number');
    if (!watchedValues.address || watchedValues.address.trim() === '') missing.push('Street Address');
    if (!watchedValues.city || watchedValues.city.trim() === '') missing.push('City');
    if (!watchedValues.province || watchedValues.province.trim() === '') missing.push('Province');
    if (!watchedValues.postalCode || watchedValues.postalCode.trim() === '') missing.push('Postal Code');
    if (!watchedValues.agreeToTerms) missing.push('Terms and Conditions Agreement');
    if (!watchedValues.agreeToPrivacy) missing.push('Privacy Policy Consent');
    if (!watchedValues.agreeToProcessing) missing.push('Electronic Transaction Consent');
    
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
