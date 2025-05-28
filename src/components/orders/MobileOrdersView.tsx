
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, MapPin, CreditCard, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/constants';

interface Order {
  id: string;
  store_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items?: any[];
  shipping_address?: any;
}

interface MobileOrdersViewProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MobileOrdersView: React.FC<MobileOrdersViewProps> = ({ orders, onViewOrder }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500">Your orders will appear here once you make a purchase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium truncate">
                {order.store_name}
              </CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              Order #{order.id.slice(-8)}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            {/* Amount and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="font-semibold text-lg">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Items Count */}
            {order.items && order.items.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">
                  {order.shipping_address.street}, {order.shipping_address.city}
                </span>
              </div>
            )}

            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Payment: {order.payment_status || 'pending'}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewOrder(order)}
                className="h-8"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileOrdersView;
