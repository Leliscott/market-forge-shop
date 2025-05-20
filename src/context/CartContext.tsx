
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartByStore: Record<string, CartItem[]>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('marketplace_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('marketplace_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Omit<CartItem, 'id' | 'quantity'>, quantity: number) => {
    setItems(currentItems => {
      // Check if the product is already in the cart
      const existingItemIndex = currentItems.findIndex(item => item.productId === product.productId);
      
      if (existingItemIndex >= 0) {
        // If it exists, update its quantity
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // If it doesn't exist, add it as a new item
        const newItem = {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
          quantity,
        };
        return [...currentItems, newItem];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) has been added to your cart.`,
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    setItems([]);
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Calculate the total number of items in the cart
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate the total price of all items in the cart
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Group cart items by store
  const cartByStore = items.reduce<Record<string, CartItem[]>>((groups, item) => {
    if (!groups[item.storeId]) {
      groups[item.storeId] = [];
    }
    groups[item.storeId].push(item);
    return groups;
  }, {});

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    cartByStore
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
