
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalItems, totalPrice }) => {
  return (
    <div className="sticky top-20 border rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        
        <div className="flex gap-2">
          <Input placeholder="Coupon code" className="flex-1" />
          <Button variant="outline">Apply</Button>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between font-medium text-lg">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <Button className="w-full" asChild>
          <Link to="/checkout">
            Proceed to Checkout
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
