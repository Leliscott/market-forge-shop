
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/constants';
import { useSellerAccount } from '@/hooks/useSellerAccount';
import { Loader2 } from 'lucide-react';

interface WithdrawalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

const MINIMUM_WITHDRAWAL = 15; // R15 minimum withdrawal

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({
  isOpen,
  onClose,
  availableBalance
}) => {
  const { requestWithdrawal } = useSellerAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    branch_code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (amount < MINIMUM_WITHDRAWAL || amount > availableBalance) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await requestWithdrawal({
        amount,
        bank_name: formData.bank_name,
        account_holder_name: formData.account_holder_name,
        account_number: formData.account_number,
        branch_code: formData.branch_code
      });
      
      // Reset form and close dialog
      setFormData({
        amount: '',
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        branch_code: ''
      });
      onClose();
    } catch (error) {
      console.error('Withdrawal request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const requestedAmount = parseFloat(formData.amount) || 0;
  const isFormValid = formData.amount && 
    formData.bank_name && 
    formData.account_holder_name && 
    formData.account_number && 
    formData.branch_code &&
    requestedAmount >= MINIMUM_WITHDRAWAL &&
    requestedAmount <= availableBalance;

  const canWithdraw = availableBalance >= MINIMUM_WITHDRAWAL;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Available Balance: <span className="font-bold">{formatCurrency(availableBalance)}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Minimum withdrawal: {formatCurrency(MINIMUM_WITHDRAWAL)} • Processed within 3-5 business days
          </p>
        </div>

        {!canWithdraw && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              You need at least {formatCurrency(MINIMUM_WITHDRAWAL)} in your available balance to request a withdrawal.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min={MINIMUM_WITHDRAWAL}
              max={availableBalance}
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder={`${MINIMUM_WITHDRAWAL}.00`}
              disabled={!canWithdraw}
              required
            />
            {requestedAmount > 0 && requestedAmount < MINIMUM_WITHDRAWAL && (
              <p className="text-xs text-red-600 mt-1">
                Minimum withdrawal amount is {formatCurrency(MINIMUM_WITHDRAWAL)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              value={formData.bank_name}
              onChange={(e) => handleInputChange('bank_name', e.target.value)}
              placeholder="e.g., Standard Bank"
              disabled={!canWithdraw}
              required
            />
          </div>

          <div>
            <Label htmlFor="account_holder_name">Account Holder Name</Label>
            <Input
              id="account_holder_name"
              value={formData.account_holder_name}
              onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
              placeholder="Full name as on bank account"
              disabled={!canWithdraw}
              required
            />
          </div>

          <div>
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              value={formData.account_number}
              onChange={(e) => handleInputChange('account_number', e.target.value)}
              placeholder="Bank account number"
              disabled={!canWithdraw}
              required
            />
          </div>

          <div>
            <Label htmlFor="branch_code">Branch Code</Label>
            <Input
              id="branch_code"
              value={formData.branch_code}
              onChange={(e) => handleInputChange('branch_code', e.target.value)}
              placeholder="6-digit branch code"
              disabled={!canWithdraw}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isSubmitting || !canWithdraw}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Request Withdrawal'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
