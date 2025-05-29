
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/constants';

interface SellerAccount {
  available_balance: number;
  total_earnings: number;
  pending_balance: number;
  total_withdrawn: number;
}

interface AccountSummaryCardsProps {
  account: SellerAccount;
}

const AccountSummaryCards: React.FC<AccountSummaryCardsProps> = ({ account }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(account.available_balance)}</p>
            </div>
            <div className="bg-green-500/10 p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
          {account.available_balance === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Complete orders to earn money
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(account.total_earnings)}</p>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          {account.total_earnings === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              No completed orders yet
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(account.pending_balance)}</p>
            </div>
            <div className="bg-yellow-500/10 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Withdrawn</p>
              <p className="text-2xl font-bold">{formatCurrency(account.total_withdrawn)}</p>
            </div>
            <div className="bg-purple-500/10 p-2 rounded-full">
              <Download className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSummaryCards;
