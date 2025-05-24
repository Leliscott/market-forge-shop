
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const SecurityNotice: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Shield className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        Your payment is secured by PayFast, South Africa's leading payment gateway. 
        All personal information is protected in accordance with POPIA regulations.
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNotice;
