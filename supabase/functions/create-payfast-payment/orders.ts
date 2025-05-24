
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { CartItem } from './types.ts';

export async function createOrder(
  supabaseClient: ReturnType<typeof createClient>,
  user: any,
  amount: number,
  shipping_address: any,
  billing_address: any,
  cart_items: CartItem[],
  paymentId: string,
  deliveryCharge: number
) {
  const orderData = {
    user_id: user.id,
    total_amount: amount,
    status: 'pending',
    payment_method: 'payfast',
    payment_id: paymentId,
    payment_status: 'pending',
    shipping_address,
    billing_address,
    items: cart_items,
    delivery_charge: deliveryCharge,
    store_id: cart_items[0]?.storeId || null,
    created_at: new Date().toISOString()
  };

  const { data: order, error: orderError } = await supabaseClient
    .from('orders')
    .insert(orderData)
    .select('id')
    .single();

  if (orderError) {
    console.error('Order creation failed:', orderError);
    throw new Error('Failed to create order');
  }

  return order;
}

export async function createOrderItems(
  supabaseClient: ReturnType<typeof createClient>,
  orderId: string,
  cart_items: CartItem[]
) {
  if (cart_items?.length > 0) {
    const orderItems = cart_items.map(item => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    // Run in background, don't await
    supabaseClient.from('order_items').insert(orderItems).catch(error => 
      console.error('Order items creation failed (non-critical):', error)
    );
  }
}
