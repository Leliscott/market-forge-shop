
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const { items, totalPrice } = useCart();

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
          
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-1">
                        Street Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-1">
                          State/Province
                        </label>
                        <input
                          id="state"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium mb-1">
                          ZIP / Postal
                        </label>
                        <input
                          id="zip"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                          Expiration Date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                          CVC
                        </label>
                        <input
                          id="cvc"
                          type="text"
                          placeholder="123"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  
                  <div className="space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {item.quantity}x
                            </span>
                            {item.name}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    
                    {/* Tax */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    {/* Total */}
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${(totalPrice * 1.1).toFixed(2)}</span>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      <Check className="mr-2 h-4 w-4" /> Complete Order
                    </Button>
                  </div>
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
