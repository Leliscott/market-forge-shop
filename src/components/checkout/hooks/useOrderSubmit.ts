
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { createYocoPayment } from '@/utils/yoco';
import { validateYocoPayment } from '@/utils/yocoValidation';

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
    
    console.log('=== STARTING YOCO PAYMENT ===');
    console.log('Final total:', finalTotal);
    console.log('Items:', items);
    console.log('User:', user?.id);

    // Validate payment data
    const validation = validateYocoPayment(user, profile, finalTotal, items);
    if (!validation.isValid) {
      console.error('Payment validation failed:', validation.message);
      toast.error("Payment Validation Failed", {
        description: validation.message,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order ID
      const orderId = `order_${Date.now()}_${user!.id.slice(-8)}`;
      console.log('Generated order ID:', orderId);
      
      toast.info("Processing Payment", {
        description: "Opening secure payment window...",
      });

      // Create Yoco payment using new backend integration
      console.log('Calling createYocoPayment...');
      const paymentResult = await createYocoPayment(
        finalTotal,
        orderId,
        user!.id,
        items
      );

      console.log('Yoco payment successful:', paymentResult);

      // Clear cart after successful payment
      clearCart();
      
      toast.success("Payment Successful!", {
        description: "Your order has been processed successfully.",
      });

      // Redirect to success page or orders page
      window.location.href = `/orders?payment=success&order_id=${paymentResult.order.id}`;

    } catch (error: any) {
      console.error('Yoco payment failed:', error);
      
      // Provide more specific error messages
      let errorMessage = "Payment processing failed. Please try again.";
      let errorDescription = error.message;

      if (error.message?.includes('temporarily unavailable')) {
        errorMessage = "Payment Service Unavailable";
        errorDescription = "The payment service is experiencing issues. Please try again in a few minutes.";
      } else if (error.message?.includes('authorization failed')) {
        errorMessage = "Payment Authorization Failed";
        errorDescription = "There was an issue with payment authorization. Please contact support.";
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
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
