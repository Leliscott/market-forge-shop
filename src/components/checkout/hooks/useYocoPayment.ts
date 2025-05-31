
import { useCallback } from 'react';
import { useYocoPaymentFlow } from '@/hooks/useYocoPaymentFlow';

export const useYocoPayment = () => {
  const { initiatePaymentFlow } = useYocoPaymentFlow();

  const createYocoPayment = useCallback(async (
    finalTotal: number,
    primaryOrderId: string,
    customerEmail?: string,
    customerName?: string,
    storeName?: string,
    sellerEmail?: string,
    itemsCount?: number
  ) => {
    const response = await initiatePaymentFlow({
      amount: finalTotal,
      paymentId: primaryOrderId,
      successUrl: `${window.location.origin}/orders?payment=success&order_id=${primaryOrderId}`,
      cancelUrl: `${window.location.origin}/cart`,
      failureUrl: `${window.location.origin}/checkout?payment=failed`,
      customerEmail,
      customerName,
      storeName,
      sellerEmail,
      itemsCount
    });

    return response;
  }, [initiatePaymentFlow]);

  const updateOrderWithYocoId = useCallback(async (
    orderId: string,
    checkoutId: string
  ) => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase
      .from('orders')
      .update({
        yoco_checkout_id: checkoutId,
        yoco_payment_status: 'pending'
      })
      .eq('id', orderId);
  }, []);

  return {
    createYocoPayment,
    updateOrderWithYocoId
  };
};
