
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartEmpty: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button asChild>
        <Link to="/marketplace">Browse Products</Link>
      </Button>
    </div>
  );
};

export default CartEmpty;
