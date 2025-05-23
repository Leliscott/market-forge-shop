
import React from 'react';

const PaymentForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
          Card Number
        </label>
        <input
          id="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="expiry" className="block text-sm font-medium mb-1">
            Expiration Date
          </label>
          <input
            id="expiry"
            type="text"
            placeholder="MM/YY"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="cvc" className="block text-sm font-medium mb-1">
            CVC
          </label>
          <input
            id="cvc"
            type="text"
            placeholder="123"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
