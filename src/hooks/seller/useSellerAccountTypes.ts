
export interface SellerAccount {
  id: string;
  store_id: string;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  total_withdrawn: number;
  created_at: string;
  updated_at: string;
}

export interface OrderFinancial {
  id: string;
  order_id: string;
  store_id: string;
  gross_amount: number;
  vat_amount: number;
  net_amount: number;
  marketplace_fee: number;
  seller_profit: number;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  store_id: string;
  seller_id: string;
  amount: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  branch_code: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  notes?: string;
}

export interface WithdrawalData {
  amount: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  branch_code: string;
}
