
import React from 'react';
import { CreditCard, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/constants';
import { useOrderCalculations } from './hooks/useOrderCalculations';
import { useOrderSubmit } from './hooks/useOrderSubmit';
import { useTermsValidation } from '@/hooks/useTermsValidation';

interface FastCheckoutProps {
  shippingAddress?: any;
  selectedDelivery?: any;
}

const FastCheckout: React.FC<FastCheckoutProps> = ({ 
  shippingAddress,
  selectedDelivery 
}) => {
  const { items, totalPrice } = useCart();
  const { isProcessing, handleCompleteOrder } = useOrderSubmit();
  const { hasAcceptedTerms } = useTermsValidation();
  
  const {
    deliveryCharge,
    finalTotal
  } = useOrderCalculations(totalPrice, selectedDelivery);

  // Only check terms acceptance and cart items
  const isReadyToProcess = hasAcceptedTerms && items.length > 0;

  const onCompleteOrder = () => {
    handleCompleteOrder(
      finalTotal,
      shippingAddress || {}, // Use empty object if no shipping address
      shippingAddress || {}, // Use shipping as billing for speed
      selectedDelivery || null,
      deliveryCharge
    );
  };

  if (!isReadyToProcess) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="text-red-800">
            <p className="font-medium mb-2">Complete Required Information:</p>
            <ul className="text-sm space-y-1">
              {!hasAcceptedTerms && <li>• Accept Terms & Conditions</li>}
              {items.length === 0 && <li>• Add items to cart</li>}
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-800 mb-2">
          <CreditCard className="h-4 w-4" />
          <span className="font-medium">Ready for Payment</span>
        </div>
        <div className="text-sm text-green-700 space-y-1">
          <p>✓ Terms accepted • ✓ {items.length} items in cart</p>
          <p className="font-medium">Total: {formatCurrency(finalTotal)}</p>
        </div>
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
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {formatCurrency(finalTotal)} with Yoco
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Yoco • SSL encrypted
      </p>
    </div>
  );
};

export default FastCheckout;
