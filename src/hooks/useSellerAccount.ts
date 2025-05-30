
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface SellerAccount {
  id: string;
  store_id: string;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  total_withdrawn: number;
  created_at: string;
  updated_at: string;
}

interface OrderFinancial {
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

interface Withdrawal {
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

export const useSellerAccount = () => {
  const { userStore } = useAuth();
  const { toast } = useToast();
  const [account, setAccount] = useState<SellerAccount | null>(null);
  const [financials, setFinancials] = useState<OrderFinancial[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createSellerAccount = async (storeId: string) => {
    try {
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating seller account:', error);
      throw error;
    }
  };

  const fetchSellerAccount = async () => {
    if (!userStore) return;

    try {
      setIsLoading(true);
      
      // Try to fetch existing seller account
      const { data: accountData, error: accountError } = await supabase
        .from('seller_accounts')
        .select('*')
        .eq('store_id', userStore.id)
        .maybeSingle();

      let finalAccountData = accountData;

      // If no account exists, create one
      if (!accountData && !accountError) {
        console.log('No seller account found, creating one...');
        finalAccountData = await createSellerAccount(userStore.id);
      } else if (accountError) {
        throw accountError;
      }

      setAccount(finalAccountData);

      // Fetch order financials
      const { data: financialsData, error: financialsError } = await supabase
        .from('order_financials')
        .select('*')
        .eq('store_id', userStore.id)
        .order('created_at', { ascending: false });

      if (financialsError) throw financialsError;
      setFinancials(financialsData || []);

      // Fetch withdrawals
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('store_id', userStore.id)
        .order('requested_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;
      setWithdrawals(withdrawalsData || []);

    } catch (error: any) {
      console.error('Error fetching seller account:', error);
      toast({
        title: "Error",
        description: "Failed to fetch account information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestWithdrawal = async (withdrawalData: {
    amount: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    branch_code: string;
  }) => {
    if (!userStore || !account) return;

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          store_id: userStore.id,
          seller_id: userStore.owner_id,
          ...withdrawalData
        });

      if (error) throw error;

      // Update pending balance
      const { error: updateError } = await supabase
        .from('seller_accounts')
        .update({
          available_balance: account.available_balance - withdrawalData.amount,
          pending_balance: account.pending_balance + withdrawalData.amount
        })
        .eq('store_id', userStore.id);

      if (updateError) throw updateError;

      // Send email notification via edge function
      const { error: emailError } = await supabase.functions.invoke('send-withdrawal-request', {
        body: {
          store_id: userStore.id,
          store_name: userStore.name,
          withdrawal_data: withdrawalData,
          seller_stats: {
            total_earnings: account.total_earnings,
            total_withdrawn: account.total_withdrawn,
            current_balance: account.available_balance
          }
        }
      });

      if (emailError) {
        console.warn('Email notification failed:', emailError);
      }

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });

      // Refresh data
      fetchSellerAccount();

    } catch (error: any) {
      console.error('Error requesting withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSellerAccount();
  }, [userStore]);

  return {
    account,
    financials,
    withdrawals,
    isLoading,
    requestWithdrawal,
    fetchSellerAccount
  };
};
