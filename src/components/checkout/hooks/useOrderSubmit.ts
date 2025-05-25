
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { createPayFastData, generatePayFastSignature, submitPayFastForm } from '@/utils/payfast';
import { validatePaymentData } from '@/utils/paymentValidation';

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
    
    console.log('=== STARTING PAYFAST PAYMENT ===');

    // Validate payment data
    const validation = validatePaymentData(user, profile, finalTotal, items);
    if (!validation.isValid) {
      toast({
        title: "Authentication Required",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Clear cart immediately before payment
      clearCart();
      
      toast({
        title: "Redirecting to PayFast",
        description: "Redirecting to secure payment...",
      });

      // Prepare PayFast form data
      const paymentData = createPayFastData(finalTotal, user, items);

      // Generate signature
      const signature = generatePayFastSignature(paymentData);
      console.log('Generated MD5 signature:', signature);

      // Submit form to PayFast
      submitPayFastForm(paymentData, signature);

    } catch (error: any) {
      console.error('Payment failed:', error);
      
      toast({
        title: "Payment Failed",
        description: "Payment processing failed. Please try again.",
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
