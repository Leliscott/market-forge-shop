
import React from 'react';
import { formatCurrency } from '@/utils/constants';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  image?: string;
}

interface OrderItemsProps {
  items: CartItem[];
}

const OrderItems: React.FC<OrderItemsProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item: CartItem) => (
        <div key={item.id} className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {item.quantity}x
            </span>
            {item.name}
          </span>
          <span>{formatCurrency(item.price * item.quantity)}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
