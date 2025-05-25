
import { User } from '@supabase/supabase-js';

export interface YocoValidationResult {
  isValid: boolean;
  message: string;
}

export const validateYocoPayment = (
  user: User | null,
  profile: any,
  amount: number,
  items: any[]
): YocoValidationResult => {
  if (!user) {
    return {
      isValid: false,
      message: "Please log in to continue with payment"
    };
  }

  if (!user.email) {
    return {
      isValid: false,
      message: "Valid email address is required for payment"
    };
  }

  if (!profile) {
    return {
      isValid: false,
      message: "Please complete your profile before making a payment"
    };
  }

  if (amount <= 0) {
    return {
      isValid: false,
      message: "Invalid payment amount"
    };
  }

  if (!items || items.length === 0) {
    return {
      isValid: false,
      message: "No items found in cart"
    };
  }

  return {
    isValid: true,
    message: "Payment validation successful"
  };
};
