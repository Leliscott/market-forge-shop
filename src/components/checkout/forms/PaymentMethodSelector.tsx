
import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentMethodSelector: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Method
      </h3>
      
      {/* Online Card Payment - Available */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">Yoco</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-green-800">Online Card Payment</p>
            <p className="text-sm text-green-700">
              Credit Card, Debit Card via Yoco
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            Available
          </div>
        </div>
        <div className="mt-3 text-xs text-green-600 bg-green-100 p-2 rounded">
          <strong>Secure Payment:</strong> Your payment is processed securely through Yoco's payment gateway. 
          All major credit and debit cards are accepted.
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
