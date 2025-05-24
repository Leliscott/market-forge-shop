
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TermsValidationProps {
  hasAcceptedTerms: boolean;
}

const TermsValidation: React.FC<TermsValidationProps> = ({ hasAcceptedTerms }) => {
  if (hasAcceptedTerms) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        You must accept our{' '}
        <a href="/terms" className="underline font-medium">
          Terms and Conditions
        </a>{' '}
        before making a purchase.
      </AlertDescription>
    </Alert>
  );
};

export default TermsValidation;
