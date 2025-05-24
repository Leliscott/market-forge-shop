
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/constants';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface PricingBreakdownProps {
  subtotalExcludingVAT: number;
  vatAmount: number;
  deliveryCharge: number;
  finalTotal: number;
  selectedDelivery?: DeliveryService | null;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  subtotalExcludingVAT,
  vatAmount,
  deliveryCharge,
  finalTotal,
  selectedDelivery
}) => {
  return (
    <>
      <Separator />
      
      {/* Subtotal (excluding VAT) */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal (excl. VAT)</span>
        <span>{formatCurrency(subtotalExcludingVAT)}</span>
      </div>
      
      {/* VAT */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">VAT (15%)</span>
        <span>{formatCurrency(vatAmount)}</span>
      </div>
      
      {/* Delivery */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">
          Delivery {selectedDelivery ? `(${selectedDelivery.service_name})` : ''}
        </span>
        <span>
          {deliveryCharge > 0 ? formatCurrency(deliveryCharge) : 'Arrange with seller'}
        </span>
      </div>
      
      <Separator />
      
      {/* Total */}
      <div className="flex justify-between font-medium text-lg">
        <span>Total (incl. VAT & Delivery)</span>
        <span>{formatCurrency(finalTotal)}</span>
      </div>
    </>
  );
};

export default PricingBreakdown;
