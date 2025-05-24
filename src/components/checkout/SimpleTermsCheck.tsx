
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTermsValidation } from '@/hooks/useTermsValidation';

const SimpleTermsCheck: React.FC = () => {
  const navigate = useNavigate();
  const { hasAcceptedTerms } = useTermsValidation();

  if (hasAcceptedTerms) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">
            ✓ Terms and Conditions Previously Accepted
          </span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          You have already accepted our Terms and Conditions. Ready to proceed with payment.
        </p>
      </div>
    );
  }

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="space-y-3">
        <div className="text-red-800">
          <p className="font-medium mb-2">
            Terms and Conditions Required
          </p>
          <p className="text-sm">
            You must accept our Terms and Conditions before proceeding with payment.
            This is required by South African law.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/terms')}
          className="mt-2"
        >
          Accept Terms & Conditions
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SimpleTermsCheck;
