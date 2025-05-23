import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  status: string; // Changed from union type to string to match what comes from the database
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  customer_profile?: {
    name: string;
    email: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: {
    name: string;
    image: string;
  };
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export interface NewProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  created_at: string;
  stock_quantity: number;
  is_new_listing: boolean;
  timeRemaining: number; // hours remaining in new listing period
}

export const useSellerData = () => {
  const { userStore } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
  });
  const [newProducts, setNewProducts] = useState<NewProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!userStore) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name,
              image
            )
          )
        `)
        .eq('store_id', userStore.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch customer profiles for each order
      const ordersWithCustomers = await Promise.all(
        (data || []).map(async (order) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', order.user_id)
            .single();

          return {
            ...order,
            customer_profile: profile
          };
        })
      );

      setOrders(ordersWithCustomers);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  const fetchProducts = async () => {
    if (!userStore) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', userStore.id);

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const fetchNewProducts = async () => {
    if (!userStore) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', userStore.id)
        .eq('is_new_listing', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const productsWithTimer = (data || []).map(product => {
        const createdAt = new Date(product.created_at);
        const now = new Date();
        const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        const timeRemaining = Math.max(0, 48 - hoursPassed);

        return {
          ...product,
          timeRemaining
        };
      });

      setNewProducts(productsWithTimer);
    } catch (error: any) {
      console.error('Error fetching new products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch new products",
        variant: "destructive"
      });
    }
  };

  const calculateStats = async () => {
    if (!userStore) return;

    try {
      const products = await fetchProducts();
      const now = new Date();
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate current period stats
      const currentOrders = orders.filter(order => 
        new Date(order.created_at) >= lastMonth
      );
      
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      // Calculate previous period for growth comparison
      const previousMonth = new Date(lastMonth.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previousOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= previousMonth && orderDate < lastMonth;
      });
      
      const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      // Get unique customers
      const uniqueCustomers = new Set(orders.map(order => order.user_id)).size;
      const currentCustomers = new Set(currentOrders.map(order => order.user_id)).size;
      const previousCustomers = new Set(previousOrders.map(order => order.user_id)).size;

      // Calculate growth percentages
      const revenueGrowth = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      
      const ordersGrowth = previousOrders.length > 0 
        ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100 
        : 0;

      const customersGrowth = previousCustomers > 0 
        ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 
        : 0;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: uniqueCustomers,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  useEffect(() => {
    if (userStore) {
      setIsLoading(true);
      Promise.all([
        fetchOrders(),
        fetchNewProducts()
      ]).finally(() => setIsLoading(false));
    }
  }, [userStore]);

  useEffect(() => {
    if (orders.length > 0) {
      calculateStats();
    }
  }, [orders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  return {
    orders,
    stats,
    newProducts,
    isLoading,
    updateOrderStatus,
    fetchOrders,
    fetchNewProducts
  };
};
