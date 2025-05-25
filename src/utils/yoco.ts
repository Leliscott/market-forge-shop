
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

export const YOCO_PUBLIC_KEY = 'pk_test_ed3c54a6gOol69qa7f45'; // Replace with your actual public key

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
): Promise<YocoTokenResponse> => {
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

    return new Promise((resolve, reject) => {
      (yoco as any).showPopup({
        amountInCents: paymentData.amount,
        currency: paymentData.currency,
        name: 'Marketplace Payment',
        description: `Order #${orderId}`,
        publicKey: YOCO_PUBLIC_KEY,
        callback: function(result: any) {
          if (result.error) {
            reject(new Error(result.error.message));
          } else {
            resolve(result);
          }
        }
      });
    });
  } catch (error) {
    console.error('Yoco payment failed:', error);
    throw error;
  }
};
