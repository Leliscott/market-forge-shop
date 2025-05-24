
import { CartItem } from '@/context/CartContext';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validatePaymentData(
  user: any,
  profile: any,
  finalTotal: number,
  items: CartItem[]
): ValidationResult {
  if (!user || !profile?.accepted_terms) {
    return {
      isValid: false,
      message: "Please log in and accept terms before checkout."
    };
  }

  if (!finalTotal || finalTotal <= 0) {
    return {
      isValid: false,
      message: "Please verify order amount."
    };
  }

  if (!items.length) {
    return {
      isValid: false,
      message: "Please add items to cart before checkout."
    };
  }

  return { isValid: true };
}
