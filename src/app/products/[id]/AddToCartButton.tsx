"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.current_quantity <= 0}
      className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Ajoute au panier
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </>
      )}
    </button>
  );
}
