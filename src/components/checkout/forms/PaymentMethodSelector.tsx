
import React from 'react';
import { CreditCard, Mail, AlertTriangle } from 'lucide-react';

const PaymentMethodSelector: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Method
      </h3>
      
      {/* Online Payment - Currently Unavailable */}
      <div className="border rounded-lg p-4 bg-gray-50 shadow-sm opacity-60">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">Card</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-600">Online Card Payment</p>
            <p className="text-sm text-gray-500">
              Credit Card, Debit Card
            </p>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Currently Unavailable</span>
          </div>
        </div>
      </div>

      {/* Email Payment - Available */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
              <Mail className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-blue-800">Email Payment</p>
            <p className="text-sm text-blue-700">
              Receive payment instructions via email
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            Available
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-600 bg-blue-100 p-2 rounded">
          <strong>How it works:</strong> After placing your order, you'll receive an email with payment instructions. 
          Your order will be tracked and processed once payment is confirmed by our agents.
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
