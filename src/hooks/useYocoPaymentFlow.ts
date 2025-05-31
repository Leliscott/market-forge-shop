
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentFlowData {
  amount: number;
  paymentId: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  customerEmail?: string;
  customerName?: string;
  storeName?: string;
  sellerEmail?: string;
  itemsCount?: number;
}

interface PaymentFlowResponse {
  success: boolean;
  checkoutUrl?: string;
  checkoutId?: string;
  emailsSent?: number;
  totalEmails?: number;
  error?: string;
}

export const useYocoPaymentFlow = () => {
  const initiatePaymentFlow = useCallback(async (
    paymentData: PaymentFlowData
  ): Promise<PaymentFlowResponse> => {
    try {
      console.log('=== INITIATING YOCO PAYMENT FLOW ===');
      console.log('Payment data:', paymentData);

      const { data: response, error } = await supabase.functions.invoke('handle-yoco-payment', {
        body: paymentData
      });

      if (error) {
        console.error('Payment flow error:', error);
        throw new Error('Failed to initiate payment flow');
      }

      if (!response?.success) {
        console.error('Payment flow failed:', response);
        throw new Error(response?.error || 'Payment flow failed');
      }

      console.log('=== PAYMENT FLOW SUCCESS ===');
      console.log('Response:', response);

      return response;

    } catch (error: any) {
      console.error('Payment flow failed:', error);
      throw new Error(error.message || 'Failed to process payment');
    }
  }, []);

  return {
    initiatePaymentFlow
  };
};
