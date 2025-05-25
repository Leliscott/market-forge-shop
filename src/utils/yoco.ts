
import { supabase } from '@/integrations/supabase/client';

// Yoco payment integration utilities
export interface YocoPaymentData {
  amount: number; // Amount in cents
  currency: string;
  metadata: {
    orderId: string;
    userId: string;
    items: any[];
  };
}

export interface YocoTokenResponse {
  id: string;
  type: string;
  currency: string;
  amount: number;
}

// IMPORTANT: Replace this with your actual live public key from Yoco Dashboard
// Your live public key should start with "pk_live_"
export const YOCO_PUBLIC_KEY = 'pk_live_41721577mWM4nmd948c4';

export const initializeYoco = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).YocoSDK) {
      resolve((window as any).YocoSDK);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.onload = () => {
      if ((window as any).YocoSDK) {
        (window as any).yoco = new (window as any).YocoSDK({
          publicKey: YOCO_PUBLIC_KEY,
        });
        resolve((window as any).yoco);
      } else {
        reject(new Error('Yoco SDK failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Yoco SDK'));
    document.head.appendChild(script);
  });
};

export const createYocoPayment = async (
  amount: number,
  orderId: string,
  userId: string,
  items: any[]
): Promise<any> => {
  try {
    const yoco = await initializeYoco();
    
    const paymentData: YocoPaymentData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'ZAR',
      metadata: {
        orderId,
        userId,
        items
      }
    };

    console.log('Initiating Yoco payment:', paymentData);

    return new Promise((resolve, reject) => {
      // Try the newer checkout method first, fallback to showPopup if needed
      const checkoutOptions = {
        amountInCents: paymentData.amount,
        currency: paymentData.currency,
        name: 'Marketplace Payment',
        description: `Order #${orderId}`,
        publicKey: YOCO_PUBLIC_KEY,
        callback: async function(result: any) {
          if (result.error) {
            console.error('Yoco payment error:', result.error);
            reject(new Error(result.error.message || 'Payment failed'));
          } else {
            try {
              console.log('Yoco payment token received:', result.id);
              
              // Process payment on backend using Supabase Edge Function
              const { data, error } = await supabase.functions.invoke('create-yoco-payment', {
                body: {
                  token: result.id,
                  amountInCents: paymentData.amount,
                  currency: paymentData.currency,
                  metadata: paymentData.metadata
                }
              });

              if (error) {
                throw new Error(error.message || 'Payment processing failed');
              }

              resolve(data);
            } catch (error) {
              console.error('Backend payment processing failed:', error);
              reject(error);
            }
          }
        }
      };

      // Try multiple methods to ensure compatibility
      if (typeof (yoco as any).showPopup === 'function') {
        (yoco as any).showPopup(checkoutOptions);
      } else if (typeof (yoco as any).checkout === 'function') {
        (yoco as any).checkout(checkoutOptions);
      } else if (typeof (yoco as any).openCheckout === 'function') {
        (yoco as any).openCheckout(checkoutOptions);
      } else {
        // Fallback to direct window method
        if ((window as any).YocoSDK && typeof (window as any).YocoSDK.showPopup === 'function') {
          (window as any).YocoSDK.showPopup(checkoutOptions);
        } else {
          console.error('Available Yoco methods:', Object.keys(yoco as any));
          reject(new Error('Yoco payment method not available. Please check your Yoco SDK integration.'));
        }
      }
    });
  } catch (error) {
    console.error('Yoco payment initialization failed:', error);
    throw error;
  }
};
