
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

export const useOrderSubmit = () => {
  const { user, profile } = useAuth();
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteOrder = useCallback(async (
    finalTotal: number,
    shippingAddress: any,
    billingAddress: any,
    selectedDelivery: DeliveryService | null,
    deliveryCharge: number
  ) => {
    if (isProcessing) return;
    
    console.log('=== STARTING YOCO PAYMENT ORDER ===');
    console.log('Final total:', finalTotal);
    console.log('Items:', items);
    console.log('User:', user?.id);

    if (!user || !profile) {
      toast.error("Authentication Required", {
        description: "Please log in to complete your order.",
      });
      return;
    }

    if (items.length === 0) {
      toast.error("Cart Empty", {
        description: "Please add items to your cart before checkout.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order ID
      const orderId = `order_${Date.now()}_${user.id.slice(-8)}`;
      console.log('Generated order ID:', orderId);
      
      // Group items by store for multi-merchant support
      const itemsByStore = items.reduce((acc, item) => {
        const storeId = item.storeId || 'unknown';
        if (!acc[storeId]) {
          acc[storeId] = [];
        }
        acc[storeId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      toast.info("Creating Order", {
        description: "Setting up your order for payment...",
      });

      // Create orders for each store
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

        // Create order with Yoco payment method
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            id: `${orderId}_${storeId.slice(-8)}`,
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

      // Now initiate Yoco payment for the first order (can be enhanced for multi-store)
      const primaryOrder = createdOrders[0];
      
      // Create Yoco checkout session
      const { data: yocoResponse, error: yocoError } = await supabase.functions.invoke('simple-yoco-pay', {
        body: {
          amount: finalTotal,
          paymentId: primaryOrder.id,
          successUrl: `${window.location.origin}/orders?payment=success&order_id=${primaryOrder.id}`,
          cancelUrl: `${window.location.origin}/cart`,
          failureUrl: `${window.location.origin}/checkout?payment=failed`
        }
      });

      if (yocoError || !yocoResponse?.success) {
        console.error('Yoco payment creation failed:', yocoError);
        throw new Error('Failed to create payment session');
      }

      // Update order with Yoco checkout ID
      await supabase
        .from('orders')
        .update({
          yoco_checkout_id: yocoResponse.checkoutId,
          yoco_payment_status: 'pending'
        })
        .eq('id', primaryOrder.id);

      console.log('=== REDIRECTING TO YOCO PAYMENT ===');
      
      // Clear cart before redirect
      clearCart();
      
      // Redirect to Yoco payment
      window.location.href = yocoResponse.checkoutUrl;

    } catch (error: any) {
      console.error('Order creation failed:', error);
      
      toast.error("Order Failed", {
        description: error.message || "Failed to create order. Please try again.",
        duration: 6000,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, profile, items, clearCart, isProcessing]);

  return {
    isProcessing,
    handleCompleteOrder
  };
};
