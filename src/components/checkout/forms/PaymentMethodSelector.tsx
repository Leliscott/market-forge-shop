
import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentMethodSelector: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Method
      </h3>
      
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-20 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">PayFast</span>
            </div>
          </div>
          <div>
            <p className="font-medium">PayFast Secure Payment</p>
            <p className="text-sm text-muted-foreground">
              Credit Card, Debit Card, EFT, or Instant EFT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
