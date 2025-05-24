
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Check } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BillingAddressForm } from '../hooks/useBillingAddressForm';
import { useTermsValidation } from '@/hooks/useTermsValidation';

interface LegalComplianceSectionProps {
  form: UseFormReturn<BillingAddressForm>;
  showValidation?: boolean;
}

const LegalComplianceSection: React.FC<LegalComplianceSectionProps> = ({ 
  form, 
  showValidation = false 
}) => {
  const { hasAcceptedTerms } = useTermsValidation();
  const watchedValues = form.watch();

  // Get checkbox error status for visual highlighting
  const getCheckboxClassName = (fieldName: keyof BillingAddressForm) => {
    const fieldValue = watchedValues[fieldName];
    const isChecked = fieldValue === true;
    const isTouched = form.formState.touchedFields[fieldName];
    
    let className = "transition-all duration-200";
    
    if (showValidation) {
      if (!isChecked) {
        className += " border-red-500 focus:border-red-500 focus:ring-red-500 shadow-sm shadow-red-100";
      } else {
        className += " border-green-500 focus:border-green-500 focus:ring-green-500 shadow-sm shadow-green-100";
      }
    } else if (isTouched && isChecked) {
      className += " border-green-500 focus:border-green-500 focus:ring-green-500";
    }
    
    return className;
  };

  // If user has already accepted terms, show confirmation instead of checkboxes
  if (hasAcceptedTerms) {
    return (
      <div className="space-y-6">
        <div className="space-y-4 border-t pt-6">
          <h4 className="font-medium text-sm">Legal Compliance Status</h4>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">
                ✓ Terms and Conditions Already Accepted
              </span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Terms and Conditions (Consumer Protection Act compliance)</p>
              <p>• POPIA Privacy Policy (personal information processing)</p>
              <p>• Electronic Communications and Transactions Act consent</p>
            </div>
            <p className="text-xs text-green-600 mt-2 italic">
              You have previously accepted our legal terms. No need to accept again for this order.
            </p>
          </div>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                  className={getCheckboxClassName('agreeToTerms')}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  <span className="text-red-500">*</span> I agree to the{' '}
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
                  className={getCheckboxClassName('agreeToPrivacy')}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  <span className="text-red-500">*</span> I consent to the processing of my personal information in accordance with{' '}
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
                  className={getCheckboxClassName('agreeToProcessing')}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  <span className="text-red-500">*</span> I consent to electronic transactions under the Electronic Communications and Transactions Act (ECT Act)
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
    </div>
  );
};

export default LegalComplianceSection;
