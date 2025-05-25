
import React from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
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
      className="w-full bg-blue-600 hover:bg-blue-700" 
      size="lg"
      onClick={onCompleteOrder}
      disabled={!isReadyToProcess || isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {isReadyToProcess ? (
            `Pay with Yoco - ${formatCurrency(finalTotal)}`
          ) : (
            `Complete Required Fields to Pay - ${formatCurrency(finalTotal)}`
          )}
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
