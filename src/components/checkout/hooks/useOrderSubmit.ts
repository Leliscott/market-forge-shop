
import { useState, useCallback } from 'react';
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

  const handleCompleteOrder = useCallback(async (
    finalTotal: number,
    shippingAddress: any,
    billingAddress: any,
    selectedDelivery: DeliveryService | null,
    deliveryCharge: number
  ) => {
    if (isProcessing) return; // Prevent double submission
    
    const startTime = Date.now();

    // Fast validation checks
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your order.",
        variant: "destructive"
      });
      return;
    }

    if (!validateCustomerTerms() || !profile?.accepted_terms) {
      toast({
        title: "Legal Compliance Required",
        description: "You must accept our Terms and Conditions before making a purchase.",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress || !billingAddress) {
      toast({
        title: "Missing Information",
        description: "Please complete both shipping and billing information.",
        variant: "destructive"
      });
      return;
    }

    // Validate amount
    if (!finalTotal || finalTotal <= 0 || finalTotal > 100000) {
      toast({
        title: "Invalid Amount",
        description: "Order amount is invalid. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Starting PayFast payment process...');
      
      // Get fresh session with timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 5000)
      );
      
      const { data: { session }, error: sessionError } = await Promise.race([
        sessionPromise, 
        timeoutPromise
      ]) as any;
      
      if (sessionError || !session) {
        throw new Error('Authentication session expired. Please refresh and log in again.');
      }

      // Prepare optimized payload
      const payload = {
        amount: finalTotal,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        cart_items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          storeId: item.storeId
        })),
        delivery_service: selectedDelivery,
        delivery_charge: deliveryCharge,
        legal_compliance: {
          popia_consent: true,
          cpa_acknowledged: true,
          ect_act_consent: true,
          terms_accepted_at: new Date().toISOString()
        }
      };

      // Call PayFast payment creation with timeout
      const functionPromise = supabase.functions.invoke('create-payfast-payment', {
        body: payload
      });
      
      const functionTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Payment service timeout')), 15000)
      );

      const { data, error } = await Promise.race([
        functionPromise,
        functionTimeoutPromise
      ]) as any;

      const processingTime = Date.now() - startTime;
      console.log('PayFast function completed in', processingTime + 'ms', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        
        // Enhanced error categorization
        if (error.message?.includes('timeout')) {
          throw new Error('Payment service is taking too long. Please try again.');
        } else if (error.message?.includes('configuration') || error.message?.includes('credentials')) {
          throw new Error('Payment system temporarily unavailable. Please contact support.');
        } else if (error.message?.includes('Unauthorized') || error.message?.includes('Authentication')) {
          throw new Error('Your session has expired. Please refresh the page and try again.');
        } else if (error.message?.includes('Invalid') || error.message?.includes('Missing')) {
          throw new Error('Invalid order information. Please check your details and try again.');
        } else {
          throw new Error(`Payment setup failed: ${error.message || 'Unknown error'}`);
        }
      }

      if (!data?.success || !data?.payment_url || !data?.payment_data) {
        throw new Error(data?.error || 'Invalid payment response received');
      }

      console.log('PayFast payment data received, processing time:', processingTime + 'ms');
      
      // Clear cart immediately for better UX
      clearCart();
      
      toast({
        title: "Redirecting to Secure Payment",
        description: "Redirecting to PayFast for secure payment processing...",
      });

      // Create and submit form with security validation
      setTimeout(() => {
        try {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.payment_url;
          form.style.display = 'none';
          form.setAttribute('target', '_self');

          // Validate and add payment data as hidden fields
          Object.entries(data.payment_data).forEach(([key, value]) => {
            if (typeof value === 'string' && value.length < 1000) { // Security check
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value;
              form.appendChild(input);
            }
          });

          if (form.children.length === 0) {
            throw new Error('No valid payment data to submit');
          }

          document.body.appendChild(form);
          form.submit();
        } catch (submitError) {
          console.error('Form submission error:', submitError);
          toast({
            title: "Redirect Failed",
            description: "Failed to redirect to payment page. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
      }, 1000);

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error('Payment error after', processingTime + 'ms:', error);
      
      // Smart error messaging based on error type and timing
      let userMessage = "Payment processing failed. Please try again.";
      
      if (processingTime > 10000) {
        userMessage = "Payment service is slow. Please check your connection and try again.";
      } else if (error.message?.includes('timeout')) {
        userMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.message?.includes('configuration') || error.message?.includes('unavailable')) {
        userMessage = "Payment system temporarily unavailable. Please try again in a few minutes.";
      } else if (error.message?.includes('session') || error.message?.includes('expired')) {
        userMessage = "Your session has expired. Please refresh the page and log in again.";
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        userMessage = "Network error. Please check your internet connection.";
      } else if (error.message?.includes('Invalid') || error.message?.includes('Missing')) {
        userMessage = "Invalid order information. Please verify your details.";
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
  }, [user, profile, items, validateCustomerTerms, clearCart, toast, isProcessing]);

  return {
    isProcessing,
    handleCompleteOrder
  };
};
