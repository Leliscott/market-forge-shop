
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteOrder = useCallback(async (
    finalTotal: number,
    shippingAddress: any,
    billingAddress: any,
    selectedDelivery: DeliveryService | null,
    deliveryCharge: number
  ) => {
    if (isProcessing) return;
    
    console.log('=== STARTING PAYMENT PROCESS ===');
    const startTime = Date.now();

    // Simplified validation - only check essential requirements
    if (!user || !profile?.accepted_terms) {
      toast({
        title: "Authentication Required",
        description: "Please log in and accept terms before checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!finalTotal || finalTotal <= 0) {
      toast({
        title: "Invalid Order",
        description: "Please verify order amount.",
        variant: "destructive"
      });
      return;
    }

    if (!items.length) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get fresh auth token
      console.log('Getting auth session...');
      const { data: { session }, error: sessionError } = await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Session timeout')), 3000))
      ]) as any;
      
      if (sessionError || !session) {
        throw new Error('Please refresh and log in again');
      }

      // Minimal payload for PayFast - addresses are optional
      const payload = {
        amount: finalTotal,
        shipping_address: shippingAddress || {},
        billing_address: billingAddress || {},
        cart_items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          storeId: item.storeId
        })),
        delivery_charge: deliveryCharge || 0
      };

      console.log('Calling PayFast payment function...');
      
      // Call PayFast with timeout
      const { data, error } = await Promise.race([
        supabase.functions.invoke('create-payfast-payment', { body: payload }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Payment timeout')), 15000))
      ]) as any;

      const processingTime = Date.now() - startTime;
      console.log(`Payment function completed in ${processingTime}ms`);

      if (error) {
        console.error('Payment function error:', error);
        throw new Error(error.message || 'Payment setup failed');
      }

      if (!data?.success || !data?.payment_url || !data?.payment_data) {
        console.error('Invalid payment response:', data);
        throw new Error(data?.error || 'Invalid payment response');
      }

      console.log('Payment data received, redirecting to PayFast...');
      
      // Clear cart immediately
      clearCart();
      
      toast({
        title: "Redirecting to PayFast",
        description: "Redirecting to secure payment...",
      });

      // Create and submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.payment_url;
      form.style.display = 'none';

      Object.entries(data.payment_data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error(`Payment failed after ${processingTime}ms:`, error);
      
      let userMessage = "Payment processing failed.";
      
      if (error.message?.includes('timeout')) {
        userMessage = "Request timed out. Please try again.";
      } else if (error.message?.includes('session') || error.message?.includes('log in')) {
        userMessage = "Session expired. Please refresh and log in again.";
      } else if (error.message) {
        userMessage = error.message;
      }
      
      toast({
        title: "Payment Failed",
        description: userMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, profile, items, clearCart, toast, isProcessing]);

  return {
    isProcessing,
    handleCompleteOrder
  };
};
