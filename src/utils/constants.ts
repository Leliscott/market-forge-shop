
export const CURRENCY = {
  code: 'ZAR',
  symbol: 'R',
  name: 'South African Rand',
  decimal_digits: 2,
};

export const COUNTRY = {
  code: 'ZA',
  name: 'South Africa',
  phone_code: '+27',
};

export const DEFAULT_LOCATION = 'Johannesburg, Gauteng, South Africa';

export const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB in bytes

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY.symbol}${amount.toFixed(CURRENCY.decimal_digits)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If the number starts with '0', replace it with '27' (South Africa country code)
  if (cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.substring(1);
  } 
  // If the number doesn't have any country code, add '27'
  else if (!cleaned.startsWith('27')) {
    cleaned = '27' + cleaned;
  }
  
  return cleaned;
};
