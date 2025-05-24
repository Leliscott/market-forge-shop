
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const OrdersHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your order history
        </p>
      </div>
    </div>
  );
};
