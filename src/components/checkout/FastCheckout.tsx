
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/constants';
import { useOrderCalculations } from './hooks/useOrderCalculations';
import { useOrderSubmit } from './hooks/useOrderSubmit';
import { useTermsValidation } from '@/hooks/useTermsValidation';
import DualPaymentButton from './DualPaymentButton';

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

  const onEmailPayment = () => {
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
        <div className="text-sm text-green-700 space-y-1">
          <p>✓ Terms accepted • ✓ {items.length} items in cart</p>
          <p className="font-medium">Total: {formatCurrency(finalTotal)}</p>
        </div>
      </div>

      <DualPaymentButton
        isReadyToProcess={isReadyToProcess}
        isProcessing={isProcessing}
        finalTotal={finalTotal}
        onEmailPayment={onEmailPayment}
      />
    </div>
  );
};

export default FastCheckout;
