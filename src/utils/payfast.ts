
import { md5 } from './md5';
import { CartItem } from '@/context/CartContext';

export interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  amount: string;
  item_name: string;
  item_description: string;
  email_address: string;
  name_first: string;
  name_last: string;
  m_payment_id: string;
  custom_str1: string;
  custom_str2: string;
}

export const PAYFAST_CONFIG = {
  merchantId: '24147869',
  merchantKey: 'fyn5boxx3gwga',
  passphrase: '123kiwW23321',
  processUrl: 'https://www.payfast.co.za/eng/process'
};

export function createPayFastData(
  finalTotal: number,
  user: { id: string; email?: string },
  items: CartItem[]
): PayFastData {
  const paymentId = `ORDER_${Date.now()}_${user.id.slice(-6)}`;
  const orderId = `ORD_${Date.now()}`;
  const baseUrl = window.location.origin;

  return {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    return_url: `${baseUrl}/orders?payment=success&order_id=${orderId}`,
    cancel_url: `${baseUrl}/checkout?payment=cancelled`,
    notify_url: `${baseUrl}/payfast-webhook`,
    amount: finalTotal.toFixed(2),
    item_name: `Order #${orderId}`,
    item_description: `${items.length} items from marketplace`,
    email_address: user.email || '',
    name_first: 'Customer',
    name_last: 'Customer',
    m_payment_id: paymentId,
    custom_str1: orderId,
    custom_str2: user.id
  };
}

export function generatePayFastSignature(paymentData: PayFastData): string {
  // Generate signature using MD5 with passphrase (exclude merchant_key from signature calculation)
  const signatureData = { ...paymentData };
  delete signatureData.merchant_key; // Remove merchant_key from signature calculation only
  
  const paramString = Object.keys(signatureData)
    .sort()
    .map(key => `${key}=${encodeURIComponent(signatureData[key as keyof typeof signatureData])}`)
    .join('&');
  
  const stringToSign = `${paramString}&passphrase=${PAYFAST_CONFIG.passphrase}`;
  return md5(stringToSign);
}

export function submitPayFastForm(paymentData: PayFastData, signature: string): void {
  // Create and submit form to PayFast with ALL required fields
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYFAST_CONFIG.processUrl;
  form.style.display = 'none';

  // Add ALL payment data as hidden inputs (including merchant_key)
  Object.entries({ ...paymentData, signature }).forEach(([key, value]) => {
    if (value) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  console.log('Submitting form to PayFast with all required fields including merchant_key');
  form.submit();
}
