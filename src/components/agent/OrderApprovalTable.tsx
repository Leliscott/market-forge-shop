
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/constants';
import { Check, X, Eye, Package } from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  store_name: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  status: string;
  payment_status: string;
  customer_details: any;
  shipping_address: any;
  billing_address: any;
  items: any;
  seller_contact: string;
  yoco_checkout_id?: string;
}

interface OrderApprovalTableProps {
  orders: Order[];
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
  onMarkDelivered: (orderId: string) => void;
  loading: boolean;
}

const OrderApprovalTable: React.FC<OrderApprovalTableProps> = ({
  orders,
  onApprove,
  onReject,
  onViewDetails,
  onMarkDelivered,
  loading
}) => {
  const getStatusBadge = (order: Order) => {
    const statusColors = {
      'delivered': 'bg-green-100 text-green-800',
      'shipped': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {order.status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant="outline" className={statusColors[paymentStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {paymentStatus}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">
                {order.id.slice(-8)}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {order.customer_details?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer_details?.email || 'N/A'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{order.store_name || 'Unknown Store'}</div>
                  <div className="text-sm text-muted-foreground">{order.seller_contact}</div>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{formatCurrency(order.total_amount)}</TableCell>
              <TableCell className="capitalize">{order.payment_method}</TableCell>
              <TableCell>{getStatusBadge(order)}</TableCell>
              <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString('en-ZA')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status !== 'delivered' && order.payment_status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkDelivered(order.id)}
                      className="text-green-600 hover:text-green-700"
                      title="Mark as Delivered"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderApprovalTable;
