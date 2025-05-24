
import { PaymentRequest } from './types.ts';

export class ValidationError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validatePaymentRequest(requestBody: any): PaymentRequest {
  const { amount, shipping_address, billing_address, cart_items } = requestBody;
  
  if (!amount || !shipping_address || !billing_address || !cart_items?.length) {
    throw new ValidationError('Missing required fields');
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100000) {
    throw new ValidationError('Invalid amount');
  }

  return {
    amount: numAmount,
    shipping_address,
    billing_address,
    cart_items,
    delivery_charge: requestBody.delivery_charge || 0
  };
}

export function validateEnvironment() {
  const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID');
  const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY');
  
  if (!merchantId || !merchantKey) {
    throw new ValidationError('Payment system configuration error', 500);
  }
  
  return { merchantId, merchantKey };
}

export function sanitizeUserInput(input: string, maxLength: number = 50): string {
  return (input || '').replace(/[^a-zA-Z\s]/g, '').slice(0, maxLength);
}

export function sanitizePhone(phone: string): string {
  return (phone || '').replace(/[^0-9+\-\s]/g, '').slice(0, 20);
}
