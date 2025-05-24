
import React from 'react';
import { useCart } from '@/context/CartContext';
import DeliveryNotice from './DeliveryNotice';
import OrderItems from './OrderItems';
import PricingBreakdown from './PricingBreakdown';
import SimpleTermsCheck from './SimpleTermsCheck';
import FastCheckout from './FastCheckout';
import { useOrderCalculations } from './hooks/useOrderCalculations';

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
  
  const {
    deliveryCharge,
    subtotalExcludingVAT,
    vatAmount,
    finalTotal
  } = useOrderCalculations(totalPrice, selectedDelivery);

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
        
        <SimpleTermsCheck />
        
        <FastCheckout 
          shippingAddress={shippingAddress}
          selectedDelivery={selectedDelivery}
        />
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs">
          <p className="text-blue-800 font-medium mb-1">Legal Compliance</p>
          <p className="text-blue-700">VAT included • POPIA compliant • CPA rights apply</p>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedOrderSummary;
