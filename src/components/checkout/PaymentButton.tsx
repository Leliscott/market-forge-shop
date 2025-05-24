
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  return (
    <Button 
      className="w-full" 
      size="lg"
      onClick={onCompleteOrder}
      disabled={!isReadyToProcess || isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          {isReadyToProcess ? (
            `Pay with PayFast - ${formatCurrency(finalTotal)}`
          ) : (
            `Complete Required Fields to Pay - ${formatCurrency(finalTotal)}`
          )}
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
