
export interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  created_at: string;
  shipping_address?: any; // JSONB from database
  billing_address?: any; // JSONB from database
  items?: any; // JSONB from database - changed from any[] to any to match Json type
  payment_date?: string;
  delivery_charge?: number;
  payment_method?: string;
  payment_id?: string;
  paid_amount?: number;
  user_id?: string;
  store_id?: string;
  updated_at?: string;
  delivery_service_id?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    name: string;
    image?: string;
  };
}

export const statusColorMap: Record<string, { bgColor: string, textColor: string, icon: React.ReactNode }> = {
  'pending': {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: null // Will be set in component with actual icons
  },
  'paid': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: null
  },
  'processing': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: null
  },
  'shipped': {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: null
  },
  'delivered': {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: null
  },
  'failed': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: null
  },
  'cancelled': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: null
  }
};
