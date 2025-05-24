
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/constants';
import DeliveryNotice from './DeliveryNotice';
import OrderItems from './OrderItems';
import PricingBreakdown from './PricingBreakdown';
import SimpleTermsCheck from './SimpleTermsCheck';
import { useOrderCalculations } from './hooks/useOrderCalculations';
import { useOrderSubmit } from './hooks/useOrderSubmit';
import { useTermsValidation } from '@/hooks/useTermsValidation';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface SimplifiedOrderSummaryProps {
  shippingAddress?: any;
  selectedDelivery?: DeliveryService | null;
}

const SimplifiedOrderSummary: React.FC<SimplifiedOrderSummaryProps> = ({ 
  shippingAddress,
  selectedDelivery 
}) => {
  const { items, totalPrice } = useCart();
  const { isProcessing, handleCompleteOrder } = useOrderSubmit();
  const { hasAcceptedTerms, validateCustomerTerms } = useTermsValidation();
  
  const {
    deliveryCharge,
    subtotalExcludingVAT,
    vatAmount,
    finalTotal
  } = useOrderCalculations(totalPrice, selectedDelivery);

  // Simplified validation - just check terms and basic shipping
  const isReadyToProcess = hasAcceptedTerms && 
                          items.length > 0 && 
                          shippingAddress?.firstName && 
                          shippingAddress?.address;

  const onCompleteOrder = () => {
    if (!validateCustomerTerms()) {
      return;
    }
    
    // Use shipping address as billing address for simplified flow
    const billingAddress = {
      ...shippingAddress,
      email: shippingAddress.email || 'customer@example.com',
      phone: shippingAddress.phone || '0123456789',
      agreeToTerms: true,
      agreeToPrivacy: true,
      agreeToProcessing: true,
      isValid: true
    };
    
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
        
        {/* Simple Terms Check */}
        <SimpleTermsCheck />
        
        {/* Legal Information */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm space-y-2">
          <p className="text-blue-800 font-medium mb-2">South African Legal Compliance</p>
          <div className="text-blue-700 space-y-1">
            <p>• VAT (15%) is included in product prices as required by SARS</p>
            <p>• Personal data processed according to POPIA requirements</p>
            <p>• Consumer Protection Act rights apply to all purchases</p>
          </div>
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
              {isReadyToProcess ? (
                `Pay with PayFast - ${formatCurrency(finalTotal)}`
              ) : (
                hasAcceptedTerms ? 
                  "Complete Shipping Address to Pay" : 
                  "Accept Terms to Continue"
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedOrderSummary;
