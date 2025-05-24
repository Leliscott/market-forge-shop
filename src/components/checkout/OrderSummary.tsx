
import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import DeliveryNotice from './DeliveryNotice';
import OrderItems from './OrderItems';
import PricingBreakdown from './PricingBreakdown';
import TermsValidation from './TermsValidation';
import TermsAcceptanceStatus from './TermsAcceptanceStatus';
import ValidationAlert from './ValidationAlert';
import LegalComplianceInfo from './LegalComplianceInfo';
import PaymentButton from './PaymentButton';
import { useOrderCalculations } from './hooks/useOrderCalculations';
import { useOrderSubmit } from './hooks/useOrderSubmit';
import { useTermsValidation } from '@/hooks/useTermsValidation';
import { useValidation } from './hooks/useValidation';

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

  const { isReadyToProcess, validationIssues } = useValidation({
    hasAcceptedTerms,
    shippingAddress,
    billingAddress,
    items
  });

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
      
      <DeliveryNotice />
      
      <div className="space-y-4">
        <OrderItems items={items} />
        
        <PricingBreakdown
          subtotalExcludingVAT={subtotalExcludingVAT}
          vatAmount={vatAmount}
          deliveryCharge={deliveryCharge}
          finalTotal={finalTotal}
          selectedDelivery={selectedDelivery}
        />
        
        {!hasAcceptedTerms && (
          <TermsValidation 
            hasAcceptedTerms={hasAcceptedTerms} 
            userType="customer"
            showNavigateButton={true}
          />
        )}

        <TermsAcceptanceStatus hasAcceptedTerms={hasAcceptedTerms} />
        
        <ValidationAlert validationIssues={validationIssues} />
        
        <LegalComplianceInfo />
        
        <PaymentButton
          isReadyToProcess={isReadyToProcess}
          isProcessing={isProcessing}
          finalTotal={finalTotal}
          onCompleteOrder={onCompleteOrder}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
