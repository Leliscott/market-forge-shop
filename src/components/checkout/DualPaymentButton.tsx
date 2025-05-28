
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/constants';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DualPaymentButtonProps {
  isReadyToProcess: boolean;
  isProcessing: boolean;
  finalTotal: number;
  onEmailPayment: () => void;
}

const DualPaymentButton: React.FC<DualPaymentButtonProps> = ({
  isReadyToProcess,
  isProcessing,
  finalTotal,
  onEmailPayment
}) => {
  const { user } = useAuth();

  const handleYocoPayment = async () => {
    if (!isReadyToProcess || isProcessing) return;
    
    try {
      // Generate order ID for Yoco payment
      const orderId = `order_${Date.now()}`;
      
      // Create Yoco checkout session
      const { data: yocoResponse, error: yocoError } = await supabase.functions.invoke('simple-yoco-pay', {
        body: {
          amount: finalTotal,
          paymentId: orderId,
          successUrl: `${window.location.origin}/orders?payment=success&order_id=${orderId}`,
          cancelUrl: `${window.location.origin}/cart`,
          failureUrl: `${window.location.origin}/checkout?payment=failed`
        }
      });

      if (yocoError || !yocoResponse?.success) {
        console.error('Yoco payment creation failed:', yocoError);
        return;
      }

      // Redirect to Yoco payment
      window.location.href = yocoResponse.checkoutUrl;
      
    } catch (error) {
      console.error('Error creating Yoco payment:', error);
    }
  };

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
        onClick={handleYocoPayment}
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
