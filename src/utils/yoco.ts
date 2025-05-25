
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

// Use your live public key here - replace with your actual live public key
export const YOCO_PUBLIC_KEY = 'pk_live_YOUR_LIVE_PUBLIC_KEY_HERE'; // Update this with your live public key

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
      (yoco as any).showPopup({
        amountInCents: paymentData.amount,
        currency: paymentData.currency,
        name: 'Marketplace Payment',
        description: `Order #${orderId}`,
        publicKey: YOCO_PUBLIC_KEY,
        callback: async function(result: any) {
          if (result.error) {
            console.error('Yoco SDK error:', result.error);
            reject(new Error(result.error.message));
          } else {
            try {
              // Process payment on backend
              const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-yoco-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
                },
                body: JSON.stringify({
                  token: result.id,
                  amountInCents: paymentData.amount,
                  currency: paymentData.currency,
                  metadata: paymentData.metadata
                })
              });

              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.details || data.error || 'Payment processing failed');
              }

              resolve(data);
            } catch (error) {
              console.error('Backend payment processing failed:', error);
              reject(error);
            }
          }
        }
      });
    });
  } catch (error) {
    console.error('Yoco payment initialization failed:', error);
    throw error;
  }
};
