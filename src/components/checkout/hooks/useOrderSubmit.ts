
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useOrderCreation } from './useOrderCreation';
import { useYocoPayment } from './useYocoPayment';

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
  
  const { createOrdersForStores } = useOrderCreation();
  const { createYocoPayment, updateOrderWithYocoId } = useYocoPayment();

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
      toast.info("Creating Order", {
        description: "Setting up your order for payment...",
      });

      // Create orders for each store
      const createdOrders = await createOrdersForStores(
        items,
        user,
        profile,
        shippingAddress,
        billingAddress,
        selectedDelivery,
        deliveryCharge
      );

      // Use the first order for payment
      const primaryOrder = createdOrders[0];
      console.log('Primary order created:', primaryOrder.id);
      
      // Create Yoco checkout session
      const yocoResponse = await createYocoPayment(finalTotal, primaryOrder.id);

      // Update order with Yoco checkout ID
      await updateOrderWithYocoId(primaryOrder.id, yocoResponse.checkoutId);

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
  }, [user, profile, items, clearCart, isProcessing, createOrdersForStores, createYocoPayment, updateOrderWithYocoId]);

  return {
    isProcessing,
    handleCompleteOrder
  };
};
