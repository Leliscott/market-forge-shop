
import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  image?: string;
}

interface OrderSummaryProps {
  shippingAddress?: any;
  billingAddress?: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ shippingAddress, billingAddress }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = totalPrice * 0.15; // 15% VAT for South Africa
  const finalTotal = totalPrice + tax;

  const handleCompleteOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order.",
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
          cart_items: items
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

  const isReadyToProcess = shippingAddress && billingAddress && items.length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
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
              <span>R{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>R{totalPrice.toFixed(2)}</span>
        </div>
        
        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        
        {/* Tax (VAT) */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">VAT (15%)</span>
          <span>R{tax.toFixed(2)}</span>
        </div>
        
        <Separator />
        
        {/* Total */}
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>R{finalTotal.toFixed(2)}</span>
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
              Pay with PayFast - R{finalTotal.toFixed(2)}
            </>
          )}
        </Button>

        {!isReadyToProcess && (
          <p className="text-sm text-muted-foreground text-center">
            Please complete shipping and billing information to proceed
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
