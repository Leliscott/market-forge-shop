
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useYocoPayment = () => {
  const createYocoPayment = useCallback(async (
    finalTotal: number,
    primaryOrderId: string
  ) => {
    const { data: yocoResponse, error: yocoError } = await supabase.functions.invoke('simple-yoco-pay', {
      body: {
        amount: finalTotal,
        paymentId: primaryOrderId,
        successUrl: `${window.location.origin}/orders?payment=success&order_id=${primaryOrderId}`,
        cancelUrl: `${window.location.origin}/cart`,
        failureUrl: `${window.location.origin}/checkout?payment=failed`
      }
    });

    if (yocoError || !yocoResponse?.success) {
      console.error('Yoco payment creation failed:', yocoError);
      throw new Error('Failed to create payment session');
    }

    return yocoResponse;
  }, []);

  const updateOrderWithYocoId = useCallback(async (
    orderId: string,
    checkoutId: string
  ) => {
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
