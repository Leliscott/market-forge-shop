
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Order, DashboardStats, NewProduct } from './seller/types';
import { 
  fetchOrdersFromDB, 
  fetchProductsFromDB, 
  fetchNewProductsFromDB, 
  updateOrderStatusInDB 
} from './seller/api';
import { calculateDashboardStats } from './seller/utils';

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
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!userStore) return [];

    try {
      const ordersData = await fetchOrdersFromDB(userStore.id);
      setOrders(ordersData);
      return ordersData;
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
      return [];
    }
  };

  const fetchNewProducts = async () => {
    if (!userStore) return;

    try {
      const productsData = await fetchNewProductsFromDB(userStore.id);
      setNewProducts(productsData);
    } catch (error: any) {
      console.error('Error fetching new products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch new products",
        variant: "destructive"
      });
    }
  };

  const calculateStats = async (ordersData: Order[]) => {
    if (!userStore) return;

    setIsStatsLoading(true);
    try {
      const products = await fetchProductsFromDB(userStore.id);
      const calculatedStats = calculateDashboardStats(ordersData, products);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    if (userStore) {
      setIsLoading(true);
      
      // Fetch orders first, then use the result to calculate stats
      fetchOrders().then((ordersData) => {
        // Calculate stats with the fresh orders data
        calculateStats(ordersData);
        
        // Fetch new products in parallel
        fetchNewProducts();
        
        setIsLoading(false);
      });
    }
  }, [userStore]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusInDB(orderId, status);

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
    isStatsLoading,
    updateOrderStatus,
    fetchOrders,
    fetchNewProducts
  };
};

// Re-export types for backward compatibility
export type { Order, OrderItem, DashboardStats, NewProduct } from './seller/types';
