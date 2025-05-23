
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4">
      {/* Product image */}
      <div className="flex-shrink-0">
        <Link to={`/product/${item.productId}`}>
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            className="object-cover w-20 h-20 rounded"
          />
        </Link>
      </div>
      
      {/* Product details */}
      <div className="flex-1">
        <div className="flex justify-between">
          <Link to={`/product/${item.productId}`} className="font-medium hover:underline">
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCart(item.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none h-8 w-8"
              onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
          </div>
          
          <div className="text-right">
            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
