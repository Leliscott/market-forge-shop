
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  email_payments?: {
    payment_confirmed: boolean;
  };
}

interface PendingOrdersAlertProps {
  orders: Order[];
}

const PendingOrdersAlert: React.FC<PendingOrdersAlertProps> = ({ orders }) => {
  const pendingOrders = orders.filter(order => 
    order.email_payments && !order.email_payments.payment_confirmed
  );

  if (pendingOrders.length === 0) return null;

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <span className="font-medium text-red-800">
          {pendingOrders.length} order(s) awaiting your approval!
        </span>
        <span className="text-red-700 block mt-1">
          New email payment orders require immediate review and approval.
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default PendingOrdersAlert;
