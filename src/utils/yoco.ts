
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
        resolve((window as any).YocoSDK);
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
    console.log('Initializing Yoco SDK...');
    const YocoSDK = await initializeYoco();
    
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
    console.log('Using public key:', YOCO_PUBLIC_KEY);

    return new Promise((resolve, reject) => {
      try {
        // Initialize Yoco with the public key
        const yoco = new (YocoSDK as any)({
          publicKey: YOCO_PUBLIC_KEY
        });

        console.log('Yoco instance created, calling showPopup...');

        // Use the showPopup method
        yoco.showPopup({
          amountInCents: paymentData.amount,
          currency: paymentData.currency,
          name: 'Marketplace Payment',
          description: `Order #${orderId}`,
          callback: async function(result: any) {
            console.log('Yoco callback received:', result);
            
            if (result.error) {
              console.error('Yoco payment error:', result.error);
              reject(new Error(result.error.message || 'Payment failed'));
            } else {
              try {
                console.log('Yoco payment token received:', result.id);
                
                // Process payment on backend using Supabase Edge Function with retry logic
                let lastError: any = null;
                let success = false;
                
                // Try up to 3 times for server errors
                for (let attempt = 0; attempt < 3 && !success; attempt++) {
                  try {
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
                    success = true;
                  } catch (error: any) {
                    lastError = error;
                    console.error(`Payment attempt ${attempt + 1} failed:`, error);
                    
                    // Check if it's a retryable error (server error)
                    const isServerError = error.message?.includes('502') || 
                                         error.message?.includes('temporarily unavailable') ||
                                         error.message?.includes('server error');
                    
                    if (isServerError && attempt < 2) {
                      console.log(`Retrying payment in ${(attempt + 1) * 2000}ms...`);
                      await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000));
                    } else {
                      break;
                    }
                  }
                }
                
                if (!success) {
                  console.error('All payment attempts failed:', lastError);
                  
                  // Provide user-friendly error messages
                  if (lastError?.message?.includes('temporarily unavailable')) {
                    reject(new Error('Payment service is temporarily unavailable. Your card was not charged. Please try again in a few minutes.'));
                  } else {
                    reject(lastError || new Error('Payment processing failed after multiple attempts'));
                  }
                }
              } catch (error) {
                console.error('Backend payment processing failed:', error);
                reject(error);
              }
            }
          }
        });
      } catch (initError) {
        console.error('Error creating Yoco instance:', initError);
        reject(new Error('Failed to initialize Yoco payment'));
      }
    });
  } catch (error) {
    console.error('Yoco payment initialization failed:', error);
    throw error;
  }
};
