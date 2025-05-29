
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/constants';
import { useSellerAccount } from '@/hooks/useSellerAccount';
import WithdrawalDialog from './WithdrawalDialog';
import AccountSummaryCards from './AccountSummaryCards';
import FeeStructureInfo from './FeeStructureInfo';
import WithdrawalsTable from './WithdrawalsTable';
import OrderFinancialsTable from './OrderFinancialsTable';

const MINIMUM_WITHDRAWAL = 15;

const SellerAccountDashboard: React.FC = () => {
  const { account, financials, withdrawals, isLoading, fetchSellerAccount } = useSellerAccount();
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const safeAccount = account || {
    available_balance: 0,
    total_earnings: 0,
    pending_balance: 0,
    total_withdrawn: 0
  };

  const canWithdraw = safeAccount.available_balance >= MINIMUM_WITHDRAWAL;

  return (
    <div className="space-y-6">
      <AccountSummaryCards account={safeAccount} />

      {/* Account Management */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Account Management</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={fetchSellerAccount}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex flex-col items-end">
            <Button 
              onClick={() => setShowWithdrawalDialog(true)}
              disabled={!canWithdraw}
            >
              Request Withdrawal
            </Button>
            {!canWithdraw && safeAccount.available_balance > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Minimum withdrawal: {formatCurrency(MINIMUM_WITHDRAWAL)}
              </p>
            )}
            {safeAccount.available_balance === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Complete orders to earn money for withdrawals
              </p>
            )}
          </div>
        </div>
      </div>

      <FeeStructureInfo />
      <WithdrawalsTable withdrawals={withdrawals} />
      <OrderFinancialsTable financials={financials} />

      <WithdrawalDialog
        isOpen={showWithdrawalDialog}
        onClose={() => setShowWithdrawalDialog(false)}
        availableBalance={safeAccount.available_balance}
      />
    </div>
  );
};

export default SellerAccountDashboard;
