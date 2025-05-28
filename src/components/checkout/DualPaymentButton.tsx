
import React, { useState } from 'react';
import { Mail, Loader2, AlertTriangle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/constants';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [isYocoLoading, setIsYocoLoading] = useState(false);
  const { toast } = useToast();

  const handleYocoPayment = async () => {
    try {
      setIsYocoLoading(true);
      
      const paymentId = `order_${Date.now()}`;
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.functions.invoke('simple-yoco-pay', {
        body: {
          amount: finalTotal,
          paymentId,
          successUrl: `${baseUrl}/orders?payment=success`,
          cancelUrl: `${baseUrl}/cart`,
          failureUrl: `${baseUrl}/checkout?payment=failed`
        }
      });

      if (error) {
        throw error;
      }

      if (data?.checkoutUrl) {
        // Redirect to Yoco checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Yoco payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize Yoco payment",
        variant: "destructive"
      });
    } finally {
      setIsYocoLoading(false);
    }
  };

  if (!isReadyToProcess) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="text-red-800">
            <p className="font-medium mb-2">Complete Required Information:</p>
            <p className="text-sm">Please fill in all required fields before proceeding.</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Yoco Payment Button */}
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        size="lg"
        onClick={handleYocoPayment}
        disabled={isYocoLoading || isProcessing}
      >
        {isYocoLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting to Yoco...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {formatCurrency(finalTotal)} with Card
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">or</div>

      {/* Email Payment Button */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <Mail className="h-4 w-4" />
          <span className="font-medium">Email Payment</span>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          You'll receive an email with payment instructions and order details.
        </p>
        
        <Button 
          variant="outline"
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-100" 
          size="lg"
          onClick={onEmailPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Payment Email...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Pay {formatCurrency(finalTotal)} via Email
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Secure payment processing • Your order will be tracked on our platform
      </p>
    </div>
  );
};

export default DualPaymentButton;
