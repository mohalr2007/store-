"use client";
// Force recompile

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import type { CartItem, Product, ProductVariant } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => console.warn("CartContext: addItem called outside Provider"),
  removeItem: () => console.warn("CartContext: removeItem called outside Provider"),
  updateQuantity: () => console.warn("CartContext: updateQuantity called outside Provider"),
  clearCart: () => console.warn("CartContext: clearCart called outside Provider"),
  total: 0,
  itemCount: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cod-store-cart");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cod-store-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
    if (product.current_quantity <= 0) {
      toast.error("Ce produit est en rupture de stock.");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.current_quantity) {
          toast.warning(`Désolé, il ne reste que ${product.current_quantity} unité(s) en stock.`);
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: product.current_quantity } : i
          );
        }
        toast.success("Quantité mise à jour dans le panier !");
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      
      toast.success("Produit ajouté au panier !");
      return [...prev, { product, quantity, variant }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      toast.info("Produit retiré du panier.");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === productId);
      if (existing && quantity > existing.product.current_quantity) {
        toast.warning(`Limite de stock atteinte (${existing.product.current_quantity}).`);
        return prev.map((i) => (i.product.id === productId ? { ...i, quantity: existing.product.current_quantity } : i));
      }
      return prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((s, i) => s + i.product.selling_price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
