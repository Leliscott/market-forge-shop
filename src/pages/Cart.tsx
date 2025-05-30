
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import CartEmpty from '@/components/cart/CartEmpty';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';

const Cart = () => {
  const { items, updateQuantity, removeFromCart } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <CartEmpty />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <ResponsiveContainer>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-3">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="space-y-4 sm:space-y-6">
                {items.map(item => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
              </div>
            </div>
            
            {/* Order summary */}
            <div>
              <CartSummary />
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
