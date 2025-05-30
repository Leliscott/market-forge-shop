
import { supabase } from '@/integrations/supabase/client';

export const useOrderSuccessEmails = () => {
  const sendOrderSuccessEmails = async (orderId: string) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-order-success-emails', {
        body: { orderId }
      });

      if (error) {
        console.error('Email sending error:', error);
        return false;
      }

      console.log('Order success emails sent:', response);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };

  return { sendOrderSuccessEmails };
};
