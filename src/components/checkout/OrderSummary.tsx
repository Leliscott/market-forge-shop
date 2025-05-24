
import React, { useState } from 'react';
import { Check, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/constants';
import DeliveryNotice from './DeliveryNotice';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  image?: string;
}

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface OrderSummaryProps {
  shippingAddress?: any;
  billingAddress?: any;
  selectedDelivery?: DeliveryService | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  shippingAddress, 
  billingAddress, 
  selectedDelivery 
}) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate delivery charge
  const deliveryCharge = selectedDelivery ? selectedDelivery.charge_amount : 0;

  // Calculate VAT and final total with VAT included
  const vatRate = 0.15; // 15% VAT
  const subtotalExcludingVAT = totalPrice / (1 + vatRate);
  const vatAmount = totalPrice - subtotalExcludingVAT;
  const finalTotal = totalPrice + deliveryCharge; // Add delivery charge to total

  const handleCompleteOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order.",
        variant: "destructive"
      });
      return;
    }

    // Check if user has accepted terms
    if (!profile?.accepted_terms) {
      toast({
        title: "Terms and Conditions Required",
        description: "You must accept our terms and conditions before making a purchase.",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress || !billingAddress) {
      toast({
        title: "Missing information",
        description: "Please complete both shipping and billing information.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call PayFast payment creation function
      const { data, error } = await supabase.functions.invoke('create-payfast-payment', {
        body: {
          amount: finalTotal,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          cart_items: items,
          delivery_service: selectedDelivery,
          delivery_charge: deliveryCharge
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        // Create form and redirect to PayFast
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment_url;
        form.style.display = 'none';

        // Add all payment data as hidden fields
        Object.entries(data.payment_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        // Clear cart after successful payment initiation
        clearCart();

        toast({
          title: "Redirecting to payment",
          description: "You will be redirected to PayFast to complete your payment.",
        });
      } else {
        throw new Error(data.error || 'Payment creation failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isReadyToProcess = shippingAddress && billingAddress && items.length > 0 && profile?.accepted_terms;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      {/* Delivery Notice */}
      <DeliveryNotice />
      
      <div className="space-y-4">
        {/* Items */}
        <div className="space-y-2">
          {items.map((item: CartItem) => (
            <div key={item.id} className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {item.quantity}x
                </span>
                {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Subtotal (excluding VAT) */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal (excl. VAT)</span>
          <span>{formatCurrency(subtotalExcludingVAT)}</span>
        </div>
        
        {/* VAT */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">VAT (15%)</span>
          <span>{formatCurrency(vatAmount)}</span>
        </div>
        
        {/* Delivery */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Delivery {selectedDelivery ? `(${selectedDelivery.service_name})` : ''}
          </span>
          <span>
            {deliveryCharge > 0 ? formatCurrency(deliveryCharge) : 'Arrange with seller'}
          </span>
        </div>
        
        <Separator />
        
        {/* Total */}
        <div className="flex justify-between font-medium text-lg">
          <span>Total (incl. VAT & Delivery)</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
        
        {/* Terms Acceptance Check */}
        {!profile?.accepted_terms && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You must accept our{' '}
              <a href="/terms" className="underline font-medium">
                Terms and Conditions
              </a>{' '}
              before making a purchase.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Fee Information */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="text-blue-800 font-medium mb-1">Payment & Delivery Information</p>
          <p className="text-blue-700">
            VAT (15%) is included in product prices. Delivery charges are paid separately to the seller's selected delivery service. After payment, you'll receive seller contact details and must complete a delivery form.
          </p>
        </div>
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleCompleteOrder}
          disabled={!isReadyToProcess || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Pay with PayFast - {formatCurrency(finalTotal)}
            </>
          )}
        </Button>

        {!isReadyToProcess && (
          <div className="text-sm text-muted-foreground text-center space-y-1">
            {!profile?.accepted_terms && (
              <p>Please accept our terms and conditions</p>
            )}
            {(!shippingAddress || !billingAddress) && (
              <p>Please complete shipping and billing information</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
