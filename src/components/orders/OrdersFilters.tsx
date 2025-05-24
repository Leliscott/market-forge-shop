
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrdersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  orderCounts: Record<string, number>;
  onTabChange: (value: string) => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  orderCounts,
  onTabChange
}) => {
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders by ID or status..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({orderCounts.pending})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({orderCounts.paid})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({orderCounts.processing})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({orderCounts.shipped})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({orderCounts.delivered})</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};
