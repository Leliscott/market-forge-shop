
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/constants';
import DeliveryNotice from './DeliveryNotice';
import OrderItems from './OrderItems';
import PricingBreakdown from './PricingBreakdown';
import TermsValidation from './TermsValidation';
import { useOrderCalculations } from './hooks/useOrderCalculations';
import { useOrderSubmit } from './hooks/useOrderSubmit';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface OrderSummaryProps {
  shippingAddress?: any;
  billingAddress?: any;
  selectedDelivery?: DeliveryService | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  shippingAddress, 
  billingAddress, 
  selectedDelivery 
}) => {
  const { items, totalPrice } = useCart();
  const { profile } = useAuth();
  const { isProcessing, handleCompleteOrder } = useOrderSubmit();
  
  const {
    deliveryCharge,
    subtotalExcludingVAT,
    vatAmount,
    finalTotal
  } = useOrderCalculations(totalPrice, selectedDelivery);

  const isReadyToProcess = shippingAddress && billingAddress && items.length > 0 && profile?.accepted_terms;

  const onCompleteOrder = () => {
    handleCompleteOrder(
      finalTotal,
      shippingAddress,
      billingAddress,
      selectedDelivery || null,
      deliveryCharge
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      {/* Delivery Notice */}
      <DeliveryNotice />
      
      <div className="space-y-4">
        {/* Items */}
        <OrderItems items={items} />
        
        {/* Pricing Breakdown */}
        <PricingBreakdown
          subtotalExcludingVAT={subtotalExcludingVAT}
          vatAmount={vatAmount}
          deliveryCharge={deliveryCharge}
          finalTotal={finalTotal}
          selectedDelivery={selectedDelivery}
        />
        
        {/* Terms Acceptance Check */}
        <TermsValidation hasAcceptedTerms={!!profile?.accepted_terms} />
        
        {/* Fee Information */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="text-blue-800 font-medium mb-1">Payment & Delivery Information</p>
          <p className="text-blue-700">
            VAT (15%) is included in product prices. Delivery charges are paid separately to the seller's selected delivery service. After payment, you'll receive seller contact details and must complete a delivery form.
          </p>
        </div>
        
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
              Pay with PayFast - {formatCurrency(finalTotal)}
            </>
          )}
        </Button>

        {!isReadyToProcess && (
          <div className="text-sm text-muted-foreground text-center space-y-1">
            {!profile?.accepted_terms && (
              <p>Please accept our terms and conditions</p>
            )}
            {(!shippingAddress || !billingAddress) && (
              <p>Please complete shipping and billing information</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
