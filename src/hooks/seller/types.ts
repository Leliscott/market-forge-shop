
export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  status: string;
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
