
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
import { useTermsValidation } from '@/hooks/useTermsValidation';

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
  const { hasAcceptedTerms, validateCustomerTerms } = useTermsValidation();
  
  const {
    deliveryCharge,
    subtotalExcludingVAT,
    vatAmount,
    finalTotal
  } = useOrderCalculations(totalPrice, selectedDelivery);

  // Check if billing address is valid (including consent checkboxes)
  const isBillingValid = billingAddress && billingAddress.isValid && 
                        billingAddress.firstName && 
                        billingAddress.lastName && 
                        billingAddress.email && 
                        billingAddress.phone && 
                        billingAddress.address && 
                        billingAddress.city && 
                        billingAddress.province && 
                        billingAddress.postalCode &&
                        billingAddress.agreeToTerms &&
                        billingAddress.agreeToPrivacy &&
                        billingAddress.agreeToProcessing;

  // Check if shipping address is valid
  const isShippingValid = shippingAddress && 
                         shippingAddress.firstName && 
                         shippingAddress.lastName && 
                         shippingAddress.address && 
                         shippingAddress.city && 
                         shippingAddress.province && 
                         shippingAddress.postalCode;

  const isReadyToProcess = isShippingValid && 
                          isBillingValid && 
                          items.length > 0 && 
                          hasAcceptedTerms;

  const onCompleteOrder = () => {
    if (!validateCustomerTerms()) {
      return;
    }
    
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
        
        {/* Enhanced Terms Acceptance Check */}
        <TermsValidation 
          hasAcceptedTerms={hasAcceptedTerms} 
          userType="customer"
          showNavigateButton={true}
        />
        
        {/* Enhanced Legal Information */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm space-y-2">
          <p className="text-blue-800 font-medium mb-2">South African Legal Compliance</p>
          <div className="text-blue-700 space-y-1">
            <p>• VAT (15%) is included in product prices as required by SARS</p>
            <p>• Delivery charges are paid separately to seller's delivery service</p>
            <p>• Consumer Protection Act rights apply to all purchases</p>
            <p>• Electronic transaction records maintained per ECT Act</p>
            <p>• Personal data processed according to POPIA requirements</p>
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
              Pay with PayFast - {formatCurrency(finalTotal)}
            </>
          )}
        </Button>

        {!isReadyToProcess && (
          <div className="text-sm text-muted-foreground text-center space-y-1">
            {!hasAcceptedTerms && (
              <p className="text-red-600 font-medium">⚠ Please accept terms and conditions (SA law requirement)</p>
            )}
            {!isShippingValid && (
              <p className="text-red-600">⚠ Please complete shipping information</p>
            )}
            {!isBillingValid && (
              <p className="text-red-600">⚠ Please complete billing information and consent requirements</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
