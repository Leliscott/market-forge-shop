
import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/constants';

const CartSummary = () => {
  const { totalPrice, totalItems } = useCart();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="text-sm text-gray-500">Calculated at checkout</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Plus delivery charges</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          <Link to="/checkout/quick" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Quick Checkout
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="w-full" size="lg">
          <Link to="/checkout" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Full Checkout
          </Link>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Secure payment • SSL encrypted • VAT included
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
