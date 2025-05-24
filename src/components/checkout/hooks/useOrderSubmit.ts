
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

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
    
    console.log('=== STARTING DIRECT PAYFAST PAYMENT ===');

    // Simple validation - only check essential requirements
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
      // Generate simple payment ID
      const paymentId = `ORDER_${Date.now()}_${user.id.slice(-6)}`;
      const orderId = `ORD_${Date.now()}`;
      
      // Clear cart immediately before payment
      clearCart();
      
      toast({
        title: "Redirecting to PayFast",
        description: "Redirecting to secure payment...",
      });

      // PayFast credentials (you'll need to set these as environment variables)
      const merchantId = 'YOUR_MERCHANT_ID'; // Replace with actual merchant ID
      const merchantKey = 'YOUR_MERCHANT_KEY'; // Replace with actual merchant key
      
      // Prepare PayFast form data
      const baseUrl = window.location.origin;
      const paymentData = {
        merchant_id: merchantId,
        merchant_key: merchantKey,
        return_url: `${baseUrl}/orders?payment=success&order_id=${orderId}`,
        cancel_url: `${baseUrl}/checkout?payment=cancelled`,
        notify_url: `${baseUrl}/payfast-webhook`,
        amount: finalTotal.toFixed(2),
        item_name: `Order #${orderId}`,
        item_description: `${items.length} items from marketplace`,
        email_address: user.email || '',
        name_first: 'Customer',
        name_last: 'Customer',
        m_payment_id: paymentId,
        custom_str1: orderId,
        custom_str2: user.id
      };

      // Generate signature (simplified MD5 hash)
      const paramString = Object.keys(paymentData)
        .filter(key => paymentData[key] !== '' && key !== 'merchant_key')
        .sort()
        .map(key => `${key}=${encodeURIComponent(paymentData[key])}`)
        .join('&');
      
      // For now, we'll use a simple signature. In production, you'd want proper MD5 hashing
      const signature = btoa(paramString).slice(0, 32); // Simple base64 signature for demo

      // Create and submit form to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payfast.co.za/eng/process';
      form.style.display = 'none';

      // Add all payment data as hidden inputs
      Object.entries({ ...paymentData, signature }).forEach(([key, value]) => {
        if (key !== 'merchant_key' && value) { // Don't include merchant_key in form
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      console.log('Submitting form to PayFast with data:', Object.fromEntries(new FormData(form)));
      form.submit();

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
