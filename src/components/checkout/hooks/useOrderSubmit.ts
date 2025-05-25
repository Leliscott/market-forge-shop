
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { createYocoPayment } from '@/utils/yoco';
import { validateYocoPayment } from '@/utils/yocoValidation';
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
    
    console.log('=== STARTING YOCO PAYMENT ===');

    // Validate payment data
    const validation = validateYocoPayment(user, profile, finalTotal, items);
    if (!validation.isValid) {
      toast({
        title: "Payment Validation Failed",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order ID
      const orderId = `order_${Date.now()}_${user!.id.slice(-8)}`;
      
      toast({
        title: "Processing Payment",
        description: "Opening secure payment window...",
      });

      // Create Yoco payment using new backend integration
      const paymentResult = await createYocoPayment(
        finalTotal,
        orderId,
        user!.id,
        items
      );

      console.log('Yoco payment successful:', paymentResult);

      // Clear cart after successful payment
      clearCart();
      
      toast({
        title: "Payment Successful!",
        description: "Your order has been processed successfully.",
      });

      // Redirect to success page or orders page
      window.location.href = `/orders?payment=success&order_id=${paymentResult.order.id}`;

    } catch (error: any) {
      console.error('Yoco payment failed:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed. Please try again.",
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
