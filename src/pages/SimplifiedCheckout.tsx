
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickShippingForm from '@/components/checkout/QuickShippingForm';
import SimplifiedOrderSummary from '@/components/checkout/SimplifiedOrderSummary';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

const SimplifiedCheckout = () => {
  const { items } = useCart();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryService | null>(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const testEmailSystem = async () => {
    setIsTestingEmail(true);
    try {
      console.log('Testing email system...');
      
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: {}
      });

      if (error) {
        throw error;
      }

      console.log('Test email result:', data);
      
      toast.success("Test Email Sent!", {
        description: "Check the console logs and your email for the test message.",
      });
    } catch (error: any) {
      console.error('Test email failed:', error);
      toast.error("Test Email Failed", {
        description: error.message || "Failed to send test email. Check console for details.",
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
            <Button asChild>
              <Link to="/marketplace">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cart" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to cart
              </Link>
            </Button>
            
            {/* Test Email Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testEmailSystem}
              disabled={isTestingEmail}
              className="flex items-center gap-2"
            >
              {isTestingEmail ? (
                <>
                  <TestTube className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Test Email System
                </>
              )}
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Quick Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order in just a few steps</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Shipping Form */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                  <QuickShippingForm 
                    onAddressChange={setShippingAddress}
                    onDeliveryChange={setSelectedDelivery}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <SimplifiedOrderSummary 
                    shippingAddress={shippingAddress}
                    selectedDelivery={selectedDelivery}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SimplifiedCheckout;
