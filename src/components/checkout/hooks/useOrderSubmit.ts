
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTermsValidation } from '@/hooks/useTermsValidation';

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
  const { validateCustomerTerms } = useTermsValidation();
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
        title: "Authentication Required",
        description: "Please log in to complete your order. This is required for consumer protection under South African law.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced terms validation with SA law compliance
    if (!validateCustomerTerms()) {
      toast({
        title: "Legal Compliance Required",
        description: "You must accept our Terms and Conditions, including POPIA privacy provisions and Consumer Protection Act rights, before making a purchase. This is required by South African law.",
        variant: "destructive"
      });
      return;
    }

    if (!profile?.accepted_terms) {
      toast({
        title: "Terms and Conditions Required",
        description: "You must accept our comprehensive terms and conditions, including POPIA compliance, before making a purchase. This is mandatory under South African e-commerce regulations.",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress || !billingAddress) {
      toast({
        title: "Missing Required Information",
        description: "Please complete both shipping and billing information. Complete customer details are required under the Consumer Protection Act.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Initiating PayFast payment creation...');
      
      // Get the current session to ensure we have a valid token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication session expired. Please log in again.');
      }

      // Call PayFast payment creation function with improved error handling
      const { data, error } = await supabase.functions.invoke('create-payfast-payment', {
        body: {
          amount: finalTotal,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          cart_items: items,
          delivery_service: selectedDelivery,
          delivery_charge: deliveryCharge,
          legal_compliance: {
            popia_consent: true,
            cpa_acknowledged: true,
            ect_act_consent: true,
            terms_accepted_at: new Date().toISOString()
          }
        }
      });

      console.log('PayFast function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        // More specific error handling
        if (error.message?.includes('PayFast credentials')) {
          throw new Error('Payment system configuration error. Please contact support.');
        } else if (error.message?.includes('Unauthorized')) {
          throw new Error('Session expired. Please refresh the page and try again.');
        } else {
          throw new Error(`Payment setup failed: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('No response from payment service. Please try again.');
      }

      if (data.success && data.payment_url && data.payment_data) {
        console.log('PayFast payment data received, redirecting...');
        
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
        
        // Clear cart before redirect
        clearCart();
        
        toast({
          title: "Redirecting to Secure Payment",
          description: "You will be redirected to PayFast to complete your payment securely. Your transaction is protected under South African consumer laws.",
        });

        // Small delay to ensure user sees the toast
        setTimeout(() => {
          form.submit();
        }, 1000);

      } else {
        throw new Error(data.error || 'Payment creation failed - invalid response format');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Enhanced error messaging
      let userMessage = "There was an error processing your payment. Please try again.";
      
      if (error.message?.includes('configuration')) {
        userMessage = "Payment system is temporarily unavailable. Please contact support.";
      } else if (error.message?.includes('session') || error.message?.includes('Unauthorized')) {
        userMessage = "Your session has expired. Please refresh the page and try again.";
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        userMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Payment Processing Failed",
        description: `${userMessage} If the problem persists, you have rights under the Consumer Protection Act.`,
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
