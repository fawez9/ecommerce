import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface CartContextType {
  cartItems: { [key: string]: number };
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (itemId: string, quantity: number) => void; // Added
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>(() => {
    // Load cart items from localStorage if available
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const { [itemId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity > 0) {
        return { ...prev, [itemId]: quantity };
      } else {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
    });
  };

  return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateCartQuantity }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
