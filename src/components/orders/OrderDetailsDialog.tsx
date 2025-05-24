
import React from 'react';
import { ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Order, OrderItem } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailsDialogProps {
  order: Order | null;
  orderItems: Record<string, OrderItem[]>;
  onClose: () => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  orderItems,
  onClose
}) => {
  if (!order) return null;

  const renderShippingAddress = () => {
    if (!order.shipping_address) {
      return <p className="text-muted-foreground">No shipping address</p>;
    }

    try {
      const address = typeof order.shipping_address === 'string' 
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;
      return (
        <>
          <p className="font-medium">{address.firstName} {address.lastName}</p>
          <p>{address.address}</p>
          <p>{address.city}, {address.province} {address.postalCode}</p>
        </>
      );
    } catch {
      return <p>Address information available</p>;
    }
  };

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Order Details</DialogTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <DialogDescription>
            Order #{order.id.slice(0, 8)} • Placed on {new Date(order.created_at).toLocaleDateString('en-ZA')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <div className="border rounded-md p-4">
                {renderShippingAddress()}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Payment Information</h3>
              <div className="border rounded-md p-4">
                <p>Payment Method: PayFast</p>
                <p>Total Amount: R{order.total_amount.toFixed(2)}</p>
                {order.payment_date && (
                  <p>Paid on: {new Date(order.payment_date).toLocaleDateString('en-ZA')}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Merchant: SecureMarket (Pty) Ltd
                </p>
              </div>
            </div>
          </div>
          
          {orderItems[order.id] && (
            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="border rounded-md divide-y">
                {orderItems[order.id].map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      {item.products?.image ? (
                        <img
                          src={item.products.image}
                          alt={item.products?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.products?.name || 'Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        R{item.unit_price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-medium">
                      R{item.total_price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal</span>
              <span>R{(order.total_amount / 1.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-medium">VAT (15%)</span>
              <span>R{(order.total_amount - (order.total_amount / 1.15)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-medium">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between mt-2 text-lg font-bold">
              <span>Total</span>
              <span>R{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
