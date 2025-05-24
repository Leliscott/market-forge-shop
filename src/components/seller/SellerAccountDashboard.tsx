
import React, { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/constants';
import { useSellerAccount } from '@/hooks/useSellerAccount';
import WithdrawalDialog from './WithdrawalDialog';

const SellerAccountDashboard: React.FC = () => {
  const { account, financials, withdrawals, isLoading } = useSellerAccount();
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (!account) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No account information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Summary Cards */}
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

      {/* Withdrawal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Account Management</h2>
        <Button 
          onClick={() => setShowWithdrawalDialog(true)}
          disabled={account.available_balance <= 0}
        >
          Request Withdrawal
        </Button>
      </div>

      {/* VAT and Fee Information */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">VAT (15%)</h3>
              <p className="text-blue-700">Automatically included in product prices. VAT is deducted from gross sales.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-2">Marketplace Fee (9%)</h3>
              <p className="text-orange-700">Applied to net amount (after VAT). This covers platform services.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Your Profit</h3>
              <p className="text-green-700">Net amount minus marketplace fee. Available for withdrawal.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.slice(0, 5).map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      {new Date(withdrawal.requested_at).toLocaleDateString('en-ZA')}
                    </TableCell>
                    <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                    <TableCell>{withdrawal.bank_name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No withdrawals yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Financials */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Order Financials</CardTitle>
        </CardHeader>
        <CardContent>
          {financials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>VAT (15%)</TableHead>
                  <TableHead>Marketplace Fee (9%)</TableHead>
                  <TableHead>Your Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.slice(0, 10).map((financial) => (
                  <TableRow key={financial.id}>
                    <TableCell>
                      {new Date(financial.created_at).toLocaleDateString('en-ZA')}
                    </TableCell>
                    <TableCell>{formatCurrency(financial.gross_amount)}</TableCell>
                    <TableCell className="text-red-600">
                      -{formatCurrency(financial.vat_amount)}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      -{formatCurrency(financial.marketplace_fee)}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(financial.seller_profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No completed orders yet
            </div>
          )}
        </CardContent>
      </Card>

      <WithdrawalDialog
        isOpen={showWithdrawalDialog}
        onClose={() => setShowWithdrawalDialog(false)}
        availableBalance={account.available_balance}
      />
    </div>
  );
};

export default SellerAccountDashboard;
