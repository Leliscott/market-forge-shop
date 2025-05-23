
import { Order, DashboardStats } from './types';

export const calculateDashboardStats = (orders: Order[], products: any[]): DashboardStats => {
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

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: uniqueCustomers,
    revenueGrowth,
    ordersGrowth,
    customersGrowth,
  };
};
