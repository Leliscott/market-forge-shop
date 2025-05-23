
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  image?: string;
}

const OrderSummary = () => {
  const { items, totalPrice } = useCart();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      <div className="space-y-4">
        {/* Items */}
        <div className="space-y-2">
          {items.map((item: CartItem) => (
            <div key={item.id} className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {item.quantity}x
                </span>
                {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${(totalPrice * 0.1).toFixed(2)}</span>
        </div>
        
        <Separator />
        
        {/* Total */}
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>${(totalPrice * 1.1).toFixed(2)}</span>
        </div>
        
        <Button className="w-full" size="lg">
          <Check className="mr-2 h-4 w-4" /> Complete Order
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
