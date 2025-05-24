
import { PayFastData } from './types.ts';
import { sanitizeUserInput, sanitizePhone } from './validation.ts';

export async function generateSecurePayFastSignature(data: Record<string, string>, passphrase: string): Promise<string> {
  try {
    if (!data || typeof data !== 'object' || !passphrase) {
      throw new Error('Invalid signature parameters');
    }

    const filteredData = { ...data };
    delete filteredData.merchant_key;
    delete filteredData.signature;
    
    const params = Object.keys(filteredData)
      .filter(key => {
        const value = filteredData[key];
        return value !== '' && value !== null && value !== undefined && typeof value === 'string';
      })
      .sort()
      .map(key => {
        const encodedValue = encodeURIComponent(filteredData[key]);
        return `${key}=${encodedValue}`;
      })
      .join('&');
    
    if (!params) {
      throw new Error('No valid parameters for signature');
    }
    
    const stringToSign = `${params}&passphrase=${encodeURIComponent(passphrase)}`;
    console.log('String to sign length:', stringToSign.length);
    
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(stringToSign);
    
    if (dataBytes.length === 0) {
      throw new Error('Empty data for hashing');
    }
    
    const hashBuffer = await crypto.subtle.digest('MD5', dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (!hash || hash.length !== 32) {
      throw new Error('Invalid hash generated');
    }
    
    console.log('Generated secure MD5 signature:', hash.slice(0, 8) + '...');
    return hash;
  } catch (error) {
    console.error('Signature generation error:', error);
    throw new Error('Failed to generate secure payment signature');
  }
}

export function createPayFastData(
  merchantId: string,
  merchantKey: string,
  amount: number,
  billing_address: any,
  user: any,
  paymentId: string,
  orderId: string,
  cart_items: any[],
  baseUrl: string
): PayFastData {
  // Only use essential user information for payment processing
  const firstName = sanitizeUserInput(billing_address?.firstName || 'Customer');
  const lastName = sanitizeUserInput(billing_address?.lastName || 'Customer');
  const email = user.email || billing_address?.email || '';

  return {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${baseUrl}/orders?payment=success&order_id=${orderId}`,
    cancel_url: `${baseUrl}/checkout?payment=cancelled`,
    notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payfast-webhook`,
    name_first: firstName,
    name_last: lastName,
    email_address: email,
    m_payment_id: paymentId,
    amount: amount.toFixed(2),
    item_name: `Order #${orderId.toString().slice(0, 8)}`,
    item_description: `${cart_items.length} items from marketplace`,
    custom_str1: orderId.toString(),
    custom_str2: user.id,
  };
}
