
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
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

  const handleCompleteOrder = async (
    finalTotal: number,
    shippingAddress: any,
    billingAddress: any,
    selectedDelivery: DeliveryService | null,
    deliveryCharge: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order.",
        variant: "destructive"
      });
      return;
    }

    // Check if user has accepted terms
    if (!profile?.accepted_terms) {
      toast({
        title: "Terms and Conditions Required",
        description: "You must accept our terms and conditions before making a purchase.",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress || !billingAddress) {
      toast({
        title: "Missing information",
        description: "Please complete both shipping and billing information.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call PayFast payment creation function
      const { data, error } = await supabase.functions.invoke('create-payfast-payment', {
        body: {
          amount: finalTotal,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          cart_items: items,
          delivery_service: selectedDelivery,
          delivery_charge: deliveryCharge
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        // Create form and redirect to PayFast
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment_url;
        form.style.display = 'none';

        // Add all payment data as hidden fields
        Object.entries(data.payment_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        // Clear cart after successful payment initiation
        clearCart();

        toast({
          title: "Redirecting to payment",
          description: "You will be redirected to PayFast to complete your payment.",
        });
      } else {
        throw new Error(data.error || 'Payment creation failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleCompleteOrder
  };
};
