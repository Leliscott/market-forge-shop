
import { supabase } from '@/integrations/supabase/client';
import { Order, NewProduct } from './types';

export const fetchOrdersFromDB = async (storeId: string): Promise<Order[]> => {
  // For new stores, return empty array immediately if no data exists
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
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching orders:', error);
    return []; // Return empty array instead of throwing for new stores
  }

  if (!data || data.length === 0) {
    return []; // Return empty array for new stores
  }

  // Fetch customer profiles for each order
  const ordersWithCustomers = await Promise.all(
    data.map(async (order) => {
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

  return ordersWithCustomers;
};

export const fetchProductsFromDB = async (storeId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId);

  if (error) {
    console.warn('Error fetching products:', error);
    return []; // Return empty array instead of throwing
  }
  
  return data || [];
};

export const fetchNewProductsFromDB = async (storeId: string): Promise<NewProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_new_listing', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching new products:', error);
    return []; // Return empty array instead of throwing
  }

  if (!data || data.length === 0) {
    return []; // Return empty array for stores with no new products
  }

  const productsWithTimer = data.map(product => {
    const createdAt = new Date(product.created_at);
    const now = new Date();
    const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const timeRemaining = Math.max(0, 48 - hoursPassed);

    return {
      ...product,
      timeRemaining
    };
  });

  return productsWithTimer;
};

export const updateOrderStatusInDB = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) throw error;
};
