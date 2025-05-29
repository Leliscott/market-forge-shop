
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/constants';
import { supabase } from '@/integrations/supabase/client';

interface DualPaymentButtonProps {
  isReadyToProcess: boolean;
  isProcessing: boolean;
  finalTotal: number;
  onYocoPayment: () => void;
}

const DualPaymentButton: React.FC<DualPaymentButtonProps> = ({
  isReadyToProcess,
  isProcessing,
  finalTotal,
  onYocoPayment
}) => {
  if (!isReadyToProcess) {
    return (
      <Button disabled className="w-full h-12">
        Complete Required Information
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={onYocoPayment}
        disabled={isProcessing}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {isProcessing ? 'Processing...' : `Pay ${formatCurrency(finalTotal)} with Card`}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Secure payment powered by Yoco • All major cards accepted
      </p>
    </div>
  );
};

export default DualPaymentButton;
