
import React from 'react';
import { ArrowDown, ArrowUp, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Order } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersTableProps {
  orders: Order[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  onViewDetails: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  sortColumn,
  sortDirection,
  onSort,
  onViewDetails
}) => {
  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' 
        ? <ArrowUp className="ml-1 w-4 h-4" />
        : <ArrowDown className="ml-1 w-4 h-4" />;
    }
    return null;
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th 
                  className="text-left p-4 cursor-pointer hover:bg-muted/70"
                  onClick={() => onSort('id')}
                >
                  <div className="flex items-center">
                    Order ID
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="text-left p-4 cursor-pointer hover:bg-muted/70"
                  onClick={() => onSort('created_at')}
                >
                  <div className="flex items-center">
                    Date
                    {renderSortIcon('created_at')}
                  </div>
                </th>
                <th 
                  className="text-left p-4 cursor-pointer hover:bg-muted/70"
                  onClick={() => onSort('total_amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {renderSortIcon('total_amount')}
                  </div>
                </th>
                <th 
                  className="text-left p-4 cursor-pointer hover:bg-muted/70"
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className={index !== orders.length - 1 ? 'border-b' : ''}>
                  <td className="p-4">#{order.id.slice(0, 8)}</td>
                  <td className="p-4">
                    {new Date(order.created_at).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="p-4">R{order.total_amount.toFixed(2)}</td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(order)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-muted-foreground mb-4">
                      You haven't placed any orders yet
                    </p>
                    <Button asChild>
                      <Link to="/marketplace">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Start Shopping
                      </Link>
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
