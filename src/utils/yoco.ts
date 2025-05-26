
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
    console.log('=== YOCO PAYMENT ATTEMPT ===');
    console.log('Amount:', amount, 'ZAR');
    console.log('Order ID:', orderId);
    console.log('Using LIVE keys - Public key:', YOCO_PUBLIC_KEY);
    
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

    console.log('Payment data prepared:', paymentData);

    return new Promise((resolve, reject) => {
      try {
        // Initialize Yoco with the public key
        const yoco = new (YocoSDK as any)({
          publicKey: YOCO_PUBLIC_KEY
        });

        console.log('Yoco SDK initialized successfully');

        // Use the showPopup method
        yoco.showPopup({
          amountInCents: paymentData.amount,
          currency: paymentData.currency,
          name: 'Shop4ll Payment',
          description: `Order #${orderId}`,
          callback: async function(result: any) {
            console.log('=== YOCO CALLBACK RECEIVED ===');
            console.log('Payment result:', result);
            
            if (result.error) {
              console.error('Yoco payment error:', result.error);
              reject(new Error(result.error.message || 'Payment failed'));
            } else {
              try {
                console.log('Payment token received, processing with backend...');
                console.log('Token:', result.id);
                
                // Get the current session to ensure we have a valid token
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError || !session) {
                  throw new Error('User not authenticated');
                }

                console.log('Session verified, calling edge function...');
                
                // Prepare request payload with proper structure
                const requestPayload = {
                  token: result.id,
                  amountInCents: paymentData.amount,
                  currency: paymentData.currency,
                  metadata: paymentData.metadata
                };

                console.log('Sending request payload:', requestPayload);
                
                // Use Supabase client's invoke method for better error handling
                const { data, error } = await supabase.functions.invoke('create-yoco-payment', {
                  body: requestPayload,
                });

                console.log('Edge function response:', { data, error });

                if (error) {
                  console.error('Edge function error:', error);
                  
                  // Parse the error response to get detailed information
                  let errorMessage = 'Payment processing failed. Please try again.';
                  
                  if (error.message?.includes('Edge Function returned a non-2xx status code')) {
                    // This indicates a server error from the edge function
                    errorMessage = 'Payment service is temporarily unavailable. Please try again in a few minutes.';
                  }
                  
                  throw new Error(errorMessage);
                }

                if (!data) {
                  throw new Error('No response received from payment processor');
                }

                // Check if the response indicates a server error
                if (data.error && data.yocoError) {
                  console.log('Yoco server error detected:', data.yocoError);
                  
                  if (data.yocoError.errorType === 'server_error') {
                    throw new Error('Payment service is experiencing technical difficulties. Please try again in a few minutes.');
                  } else {
                    throw new Error(data.yocoError.displayMessage || 'Payment failed. Please try again.');
                  }
                }

                console.log('=== PAYMENT SUCCESSFUL ===');
                console.log('Backend response:', data);
                resolve(data);
              } catch (error) {
                console.error('Payment processing failed:', error);
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
