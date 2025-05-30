
import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  name?: string;
  role?: string;
  orderId?: string;
  customerName?: string;
  storeName?: string;
  total?: number;
  itemsCount?: number;
}

export const useEmailNotifications = () => {
  const sendEmail = async (type: string, to: string, data?: EmailData) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('dyn-email-handler', {
        body: { type, to, data }
      });

      if (error) {
        console.error('Email sending error:', error);
        return false;
      }

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };

  const sendWelcomeEmail = (email: string, name: string, role: string) => {
    return sendEmail('welcome', email, { name, role });
  };

  const sendOrderConfirmation = (email: string, orderData: {
    orderId: string;
    customerName: string;
    storeName: string;
    total: number;
  }) => {
    return sendEmail('order_confirmation', email, orderData);
  };

  const sendSellerNotification = (email: string, orderData: {
    orderId: string;
    customerName: string;
    total: number;
    itemsCount: number;
  }) => {
    return sendEmail('order_seller_notification', email, orderData);
  };

  const sendPasswordResetNotification = (email: string) => {
    return sendEmail('password_reset', email);
  };

  return {
    sendWelcomeEmail,
    sendOrderConfirmation,
    sendSellerNotification,
    sendPasswordResetNotification
  };
};
