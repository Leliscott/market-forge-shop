
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import DeliverySelector from '@/components/checkout/DeliverySelector';
import { useCart } from '@/context/CartContext';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

const Checkout = () => {
  const { items } = useCart();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryService | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get unique store IDs from cart items
  const storeIds = [...new Set(items.map(item => item.storeId))].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cart" className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to cart
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <ShippingForm onAddressChange={setShippingAddress} />
                </CardContent>
              </Card>

              {/* Delivery Options */}
              {storeIds.map(storeId => (
                <DeliverySelector
                  key={storeId}
                  storeId={storeId!}
                  onDeliveryChange={setSelectedDelivery}
                />
              ))}
              
              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment & Billing</h2>
                  <PaymentForm 
                    onBillingAddressChange={setBillingAddress}
                    isProcessing={isProcessing}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <OrderSummary 
                    shippingAddress={shippingAddress}
                    billingAddress={billingAddress}
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

export default Checkout;
