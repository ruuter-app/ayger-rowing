import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  product: {
    slug: string;
    name: string;
    priceEur: number;
    media: Array<{ src: string; type: string; poster?: string }>;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem['product'], quantity: number) => void;
  removeFromCart: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: CartItem['product'], quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.slug === product.slug);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productSlug: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.slug !== productSlug));
  }, []);

  const updateQuantity = useCallback((productSlug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productSlug);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.slug === productSlug
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.priceEur * item.quantity), 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

