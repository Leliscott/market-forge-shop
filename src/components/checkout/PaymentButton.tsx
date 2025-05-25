
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
    <>
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

      {/* Hidden PayFast Form */}
      <form 
        id="payfast-form" 
        name="PayFastPayNowForm" 
        action="https://payment.payfast.io/eng/process" 
        method="post"
        style={{ display: 'none' }}
        onSubmit={() => {
          console.log('PayFast form submitted with amount:', finalTotal);
          return true;
        }}
      >
        <input type="hidden" name="cmd" value="_paynow" />
        <input type="hidden" name="receiver" value="24147869" />
        <input type="hidden" name="amount" value={finalTotal.toFixed(2)} />
        <input type="hidden" name="item_name" value="Marketplace Order" />
        <input type="hidden" name="item_description" value="Order from marketplace" />
      </form>
    </>
  );
};

export default PaymentButton;
