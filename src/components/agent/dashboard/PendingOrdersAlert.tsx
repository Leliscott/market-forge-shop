
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  payment_status: string;
}

interface PendingOrdersAlertProps {
  orders: Order[];
}

const PendingOrdersAlert: React.FC<PendingOrdersAlertProps> = ({ orders }) => {
  const pendingOrders = orders.filter(order => 
    order.payment_status === 'pending'
  );

  if (pendingOrders.length === 0) return null;

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <span className="font-medium text-red-800">
          {pendingOrders.length} order(s) with pending payments!
        </span>
        <span className="text-red-700 block mt-1">
          Orders are awaiting Yoco payment confirmation.
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default PendingOrdersAlert;
