
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BillingAddressForm } from '../hooks/useBillingAddressForm';

interface LegalComplianceSectionProps {
  form: UseFormReturn<BillingAddressForm>;
}

const LegalComplianceSection: React.FC<LegalComplianceSectionProps> = ({ form }) => {
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
    </div>
  );
};

export default LegalComplianceSection;
