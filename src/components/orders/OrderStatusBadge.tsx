
import React from 'react';
import { Clock, Check, Truck, AlertTriangle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bgColor: string, textColor: string, icon: React.ReactNode }> = {
  'pending': {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  'paid': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  'processing': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  'shipped': {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: <Truck className="w-4 h-4 mr-1" />
  },
  'delivered': {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: <Check className="w-4 h-4 mr-1" />
  },
  'failed': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />
  },
  'cancelled': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />
  }
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: null
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};
