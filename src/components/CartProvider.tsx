"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { CartItem, Product, ProductVariant } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
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

export function getCartItemKey(item: Pick<CartItem, "product" | "variant">) {
  return `${item.product.id}:${item.variant?.id || "default"}`;
}

function getStockLimit(product: Product, variant?: ProductVariant) {
  return variant ? Number(variant.quantity || 0) : Number(product.current_quantity || 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cod-store-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cod-store-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
    const stockLimit = getStockLimit(product, variant);
    if (stockLimit <= 0) {
      toast.error("Ce produit est en rupture de stock.");
      return;
    }

    setItems((prev) => {
      const nextItemKey = `${product.id}:${variant?.id || "default"}`;
      const existing = prev.find((item) => getCartItemKey(item) === nextItemKey);

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > stockLimit) {
          toast.warning(`Desole, il ne reste que ${stockLimit} unite(s) en stock.`);
          return prev.map((item) =>
            getCartItemKey(item) === nextItemKey ? { ...item, quantity: stockLimit } : item
          );
        }

        toast.success("Quantite mise a jour dans le panier !");
        return prev.map((item) =>
          getCartItemKey(item) === nextItemKey ? { ...item, quantity: newQty } : item
        );
      }

      toast.success("Produit ajoute au panier !");
      return [...prev, { product, quantity: Math.min(quantity, stockLimit), variant }];
    });
  };

  const removeItem = (itemKey: string) => {
    setItems((prev) => prev.filter((item) => getCartItemKey(item) !== itemKey));
  };

  const updateQuantity = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemKey);
      toast.info("Produit retire du panier.");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => getCartItemKey(item) === itemKey);
      const stockLimit = existing ? getStockLimit(existing.product, existing.variant) : 0;

      if (existing && quantity > stockLimit) {
        toast.warning(`Limite de stock atteinte (${stockLimit}).`);
        return prev.map((item) =>
          getCartItemKey(item) === itemKey ? { ...item, quantity: stockLimit } : item
        );
      }

      return prev.map((item) => (getCartItemKey(item) === itemKey ? { ...item, quantity } : item));
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
