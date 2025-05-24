
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersFilters } from '@/components/orders/OrdersFilters';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { OrderDetailsDialog } from '@/components/orders/OrderDetailsDialog';
import { Order, OrderItem } from '@/components/orders/types';

const Orders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for payment success
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderId = searchParams.get('order_id');
    
    if (paymentStatus === 'success' && orderId) {
      toast({
        title: "Payment Successful!",
        description: `Your order has been placed successfully. Order ID: ${orderId.slice(0, 8)}`,
        duration: 5000,
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // Fetch order items for each order
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(order => order.id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              name,
              image
            )
          `)
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const itemsByOrder: Record<string, OrderItem[]> = {};
        itemsData?.forEach(item => {
          if (!itemsByOrder[item.order_id]) {
            itemsByOrder[item.order_id] = [];
          }
          itemsByOrder[item.order_id].push(item);
        });

        setOrderItems(itemsByOrder);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredOrders = orders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(lowerSearchTerm) ||
      order.status.toLowerCase().includes(lowerSearchTerm);
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && order.status === selectedTab;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let comparison = 0;
    switch (sortColumn) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'total_amount':
        comparison = a.total_amount - b.total_amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    failed: orders.filter(o => o.status === 'failed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <OrdersHeader />

          {/* Payment Success Alert */}
          {searchParams.get('payment') === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment completed successfully! Your order is being processed.
              </AlertDescription>
            </Alert>
          )}
          
          <OrdersFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            orderCounts={orderCounts}
            onTabChange={setSelectedTab}
          />
          
          <OrdersTable
            orders={sortedOrders}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onViewDetails={setSelectedOrder}
          />
        </div>
      </main>
      
      <Footer />
      
      <OrderDetailsDialog
        order={selectedOrder}
        orderItems={orderItems}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default Orders;
