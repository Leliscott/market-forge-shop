
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/constants';
import { Check, X, Eye } from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  store_name: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  status: string;
  email_payments?: {
    payment_confirmed: boolean;
    email_sent_at: string;
  };
}

interface OrderApprovalTableProps {
  orders: Order[];
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
  loading: boolean;
}

const OrderApprovalTable: React.FC<OrderApprovalTableProps> = ({
  orders,
  onApprove,
  onReject,
  onViewDetails,
  loading
}) => {
  const getStatusBadge = (order: Order) => {
    if (order.payment_method === 'email') {
      if (order.email_payments?.payment_confirmed) {
        return <Badge className="bg-green-100 text-green-800">Payment Confirmed</Badge>;
      }
      return <Badge className="bg-yellow-100 text-yellow-800">Awaiting Payment</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">{order.status}</Badge>;
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
        <p className="text-muted-foreground">No orders requiring approval</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-sm">
              {order.id.slice(0, 16)}...
            </TableCell>
            <TableCell>{order.store_name || 'Unknown Store'}</TableCell>
            <TableCell>{formatCurrency(order.total_amount)}</TableCell>
            <TableCell className="capitalize">{order.payment_method}</TableCell>
            <TableCell>{getStatusBadge(order)}</TableCell>
            <TableCell>
              {new Date(order.created_at).toLocaleDateString('en-ZA')}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {order.payment_method === 'email' && !order.email_payments?.payment_confirmed && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(order.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(order.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderApprovalTable;
