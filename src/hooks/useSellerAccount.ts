
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  SellerAccount, 
  OrderFinancial, 
  Withdrawal, 
  WithdrawalData 
} from './seller/useSellerAccountTypes';
import {
  createSellerAccount,
  fetchSellerAccountData,
  fetchOrderFinancials,
  fetchWithdrawals,
  submitWithdrawalRequest,
  updateSellerAccountBalance,
  sendWithdrawalNotification
} from './seller/useSellerAccountApi';

export const useSellerAccount = () => {
  const { userStore } = useAuth();
  const { toast } = useToast();
  const [account, setAccount] = useState<SellerAccount | null>(null);
  const [financials, setFinancials] = useState<OrderFinancial[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSellerAccount = async () => {
    if (!userStore?.id) {
      console.log('No userStore available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Try to fetch existing seller account
      let finalAccountData = await fetchSellerAccountData(userStore.id);

      // If no account exists, create one
      if (!finalAccountData) {
        console.log('No seller account found, creating one...');
        try {
          finalAccountData = await createSellerAccount(userStore.id);
        } catch (createError) {
          console.error('Failed to create seller account:', createError);
          // Set default values if creation fails
          finalAccountData = {
            id: '',
            store_id: userStore.id,
            total_earnings: 0,
            available_balance: 0,
            pending_balance: 0,
            total_withdrawn: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
      }

      setAccount(finalAccountData);

      // Fetch related data
      try {
        const [financialsData, withdrawalsData] = await Promise.all([
          fetchOrderFinancials(userStore.id),
          fetchWithdrawals(userStore.id)
        ]);
        
        setFinancials(financialsData);
        setWithdrawals(withdrawalsData);
      } catch (error) {
        console.error('Error fetching related data:', error);
        // Continue with empty arrays if fetching fails
        setFinancials([]);
        setWithdrawals([]);
      }

    } catch (error: any) {
      console.error('Error in fetchSellerAccount:', error);
      toast({
        title: "Error",
        description: "Failed to fetch account information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestWithdrawal = async (withdrawalData: WithdrawalData) => {
    if (!userStore || !account) return;

    try {
      await submitWithdrawalRequest(userStore.id, userStore.owner_id, withdrawalData);
      await updateSellerAccountBalance(
        userStore.id,
        account.available_balance,
        account.pending_balance,
        withdrawalData.amount
      );

      // Send email notification
      await sendWithdrawalNotification(
        userStore.id,
        userStore.name,
        withdrawalData,
        {
          total_earnings: account.total_earnings,
          total_withdrawn: account.total_withdrawn,
          current_balance: account.available_balance
        }
      );

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

// Re-export types for backward compatibility
export type { SellerAccount, OrderFinancial, Withdrawal, WithdrawalData };
