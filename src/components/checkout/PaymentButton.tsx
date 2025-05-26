
import React from 'react';
import { Mail, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/constants';

interface PaymentButtonProps {
  isReadyToProcess: boolean;
  isProcessing: boolean;
  finalTotal: number;
  onCompleteOrder: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  isReadyToProcess,
  isProcessing,
  finalTotal,
  onCompleteOrder
}) => {
  if (!isReadyToProcess) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="text-red-800">
            <p className="font-medium mb-2">Complete Required Information:</p>
            <p className="text-sm">Please fill in all required fields before proceeding.</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <Mail className="h-4 w-4" />
          <span className="font-medium">Email Payment</span>
        </div>
        <p className="text-sm text-blue-700">
          You'll receive an email with payment instructions and order details.
        </p>
      </div>

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        size="lg"
        onClick={onCompleteOrder}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Payment Email...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Pay {formatCurrency(finalTotal)} via Email
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your order will be placed and you'll receive payment instructions via email
      </p>
    </div>
  );
};

export default PaymentButton;
