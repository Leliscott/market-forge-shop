
export interface PaymentRequest {
  amount: number;
  shipping_address: any;
  billing_address: any;
  cart_items: CartItem[];
  delivery_charge?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  storeId: string;
}

export interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  custom_str1: string;
  custom_str2: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  processing_time?: number;
}

export interface SuccessResponse {
  success: true;
  payment_url: string;
  payment_data: PayFastData & { signature: string };
  order_id: string;
  processing_time: number;
}
