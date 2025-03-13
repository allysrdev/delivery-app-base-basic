"use client"
import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
     
    console.log(`Adicionado ao carrinho: ${item.name}`);
      
  };

  function removeFromCart(id: string) {
      setCart((prev) => {
        return prev
        .map((p) =>
            p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        ) // ⬅️ Reduz 1 na quantidade do produto
        .filter((p) => p.quantity > 0); // ⬅️ Remove o produto se a quantidade chegar a 0
    });

      
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
      );
      
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro do CartProvider");
  return context;
};
