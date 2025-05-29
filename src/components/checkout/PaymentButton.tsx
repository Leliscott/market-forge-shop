
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DualPaymentButton from './DualPaymentButton';

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
    <DualPaymentButton
      isReadyToProcess={isReadyToProcess}
      isProcessing={isProcessing}
      finalTotal={finalTotal}
      onYocoPayment={onCompleteOrder}
    />
  );
};

export default PaymentButton;
