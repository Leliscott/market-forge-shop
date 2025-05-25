
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { validatePaymentData } from '@/utils/paymentValidation';
import { submitPayFastSimpleForm } from '@/utils/payfast-simple';

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
    
    console.log('=== STARTING PAYFAST SIMPLE PAYMENT ===');

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

      // Use simple PayFast form submission
      submitPayFastSimpleForm(finalTotal);

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
