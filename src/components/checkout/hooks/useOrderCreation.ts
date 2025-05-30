import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const useOrderCreation = () => {
  const createOrdersForStores = useCallback(async (
    items: CartItem[],
    user: any,
    profile: any,
    shippingAddress: any,
    billingAddress: any,
    selectedDelivery: DeliveryService | null,
    deliveryCharge: number
  ) => {
    // Group items by store for multi-merchant support
    const itemsByStore = items.reduce((acc, item) => {
      const storeId = item.storeId || 'unknown';
      if (!acc[storeId]) {
        acc[storeId] = [];
      }
      acc[storeId].push(item);
      return acc;
    }, {} as Record<string, typeof items>);

    const createdOrders = [];
    
    for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
      const storeTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderTotal = storeTotal + deliveryCharge;

      // Get store information
      const { data: store } = await supabase
        .from('stores')
        .select('name, contact_email')
        .eq('id', storeId)
        .single();

      // Convert cart items to JSON-compatible format
      const itemsForStorage = storeItems.map(item => ({
        id: item.id,
        productId: item.productId,
        storeId: item.storeId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      }));

      // Create order with auto-generated UUID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          store_id: storeId,
          total_amount: orderTotal,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          delivery_service_id: selectedDelivery?.id,
          delivery_charge: deliveryCharge,
          items: itemsForStorage,
          payment_method: 'yoco',
          status: 'pending',
          payment_status: 'pending',
          store_name: store?.name || 'Unknown Store',
          seller_contact: store?.contact_email,
          customer_details: {
            name: profile.name,
            email: user.email || profile.email,
            shipping_address: shippingAddress,
            billing_address: billingAddress
          }
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      console.log('Order created successfully:', order);

      // Send order confirmation email to customer
      try {
        await supabase.functions.invoke('dyn-email-handler', {
          body: { 
            type: 'order_confirmation', 
            to: user.email || profile.email,
            data: {
              orderId: order.id.slice(0, 8),
              customerName: profile.name,
              storeName: store?.name || 'Unknown Store',
              total: orderTotal.toFixed(2)
            }
          }
        });
      } catch (emailError) {
        console.log('Customer email failed:', emailError);
      }

      // Send notification to seller if email available
      if (store?.contact_email) {
        try {
          await supabase.functions.invoke('dyn-email-handler', {
            body: { 
              type: 'order_seller_notification', 
              to: store.contact_email,
              data: {
                orderId: order.id.slice(0, 8),
                customerName: profile.name,
                total: orderTotal.toFixed(2),
                itemsCount: storeItems.length
              }
            }
          });
        } catch (emailError) {
          console.log('Seller email failed:', emailError);
        }
      }

      // Create order items
      for (const item of storeItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity
          });

        if (itemError) {
          console.error('Order item creation error:', itemError);
        }
      }

      createdOrders.push(order);
    }

    return createdOrders;
  }, []);

  return { createOrdersForStores };
};
