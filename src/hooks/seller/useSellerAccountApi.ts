
import { supabase } from '@/integrations/supabase/client';
import { SellerAccount, OrderFinancial, Withdrawal, WithdrawalData } from './useSellerAccountTypes';

export const createSellerAccount = async (storeId: string): Promise<SellerAccount> => {
  console.log('Creating seller account for store:', storeId);
  
  const { data, error } = await supabase
    .from('seller_accounts')
    .insert({
      store_id: storeId,
      total_earnings: 0,
      available_balance: 0,
      pending_balance: 0,
      total_withdrawn: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating seller account:', error);
    throw error;
  }
  
  console.log('Seller account created successfully:', data);
  return data;
};

export const fetchSellerAccountData = async (storeId: string): Promise<SellerAccount | null> => {
  console.log('Fetching seller account for store:', storeId);
  
  const { data: accountData, error: accountError } = await supabase
    .from('seller_accounts')
    .select('*')
    .eq('store_id', storeId)
    .maybeSingle();

  if (accountError) {
    console.error('Error fetching seller account:', accountError);
    throw accountError;
  }

  return accountData;
};

export const fetchOrderFinancials = async (storeId: string): Promise<OrderFinancial[]> => {
  const { data: financialsData, error: financialsError } = await supabase
    .from('order_financials')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  if (financialsError) {
    console.error('Error fetching financials:', financialsError);
    throw financialsError;
  }

  return financialsData || [];
};

export const fetchWithdrawals = async (storeId: string): Promise<Withdrawal[]> => {
  const { data: withdrawalsData, error: withdrawalsError } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('store_id', storeId)
    .order('requested_at', { ascending: false });

  if (withdrawalsError) {
    console.error('Error fetching withdrawals:', withdrawalsError);
    throw withdrawalsError;
  }

  return withdrawalsData || [];
};

export const submitWithdrawalRequest = async (
  storeId: string,
  sellerId: string,
  withdrawalData: WithdrawalData
): Promise<void> => {
  const { error } = await supabase
    .from('withdrawals')
    .insert({
      store_id: storeId,
      seller_id: sellerId,
      ...withdrawalData
    });

  if (error) throw error;
};

export const updateSellerAccountBalance = async (
  storeId: string,
  availableBalance: number,
  pendingBalance: number,
  amount: number
): Promise<void> => {
  const { error: updateError } = await supabase
    .from('seller_accounts')
    .update({
      available_balance: availableBalance - amount,
      pending_balance: pendingBalance + amount
    })
    .eq('store_id', storeId);

  if (updateError) throw updateError;
};

export const sendWithdrawalNotification = async (
  storeId: string,
  storeName: string,
  withdrawalData: WithdrawalData,
  sellerStats: {
    total_earnings: number;
    total_withdrawn: number;
    current_balance: number;
  }
): Promise<void> => {
  const { error: emailError } = await supabase.functions.invoke('send-withdrawal-request', {
    body: {
      store_id: storeId,
      store_name: storeName,
      withdrawal_data: withdrawalData,
      seller_stats: sellerStats
    }
  });

  if (emailError) {
    console.warn('Email notification failed:', emailError);
  }
};
