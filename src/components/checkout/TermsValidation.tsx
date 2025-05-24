
import React from 'react';
import { AlertTriangle, Shield, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TermsValidationProps {
  hasAcceptedTerms: boolean;
  userType?: 'customer' | 'seller';
  showNavigateButton?: boolean;
}

const TermsValidation: React.FC<TermsValidationProps> = ({ 
  hasAcceptedTerms, 
  userType = 'customer',
  showNavigateButton = true 
}) => {
  const navigate = useNavigate();

  if (hasAcceptedTerms) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="space-y-3">
        <div className="text-red-800">
          <p className="font-medium mb-2">
            South African Legal Compliance Required
          </p>
          <p className="text-sm mb-2">
            As a {userType} on our platform, you must accept our Terms and Conditions 
            which include compliance with:
          </p>
          <ul className="text-xs space-y-1 ml-4 list-disc">
            <li>Protection of Personal Information Act (POPIA)</li>
            <li>Electronic Communications and Transactions Act (ECT Act)</li>
            <li>Consumer Protection Act (CPA)</li>
            <li>VAT and taxation requirements (SARS compliance)</li>
          </ul>
        </div>
        
        {showNavigateButton && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/terms')}
              className="flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              Review Terms & Conditions
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/terms')}
              className="flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              POPIA Privacy Policy
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default TermsValidation;
