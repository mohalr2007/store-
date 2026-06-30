"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import type { Product, ProductVariant } from "@/lib/types";

export function AddToCartButton({
  product,
  selectedVariant,
  effectiveStock,
}: {
  product: Product;
  selectedVariant?: ProductVariant | null;
  effectiveStock?: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const stockToCheck = effectiveStock !== undefined ? effectiveStock : product.current_quantity;
  const isOutOfStock = stockToCheck <= 0;

  const handleAdd = () => {
    addItem(product, 1, selectedVariant || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        background: added ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
        border: added ? "1px solid rgba(16,185,129,0.45)" : "1px solid var(--border-strong)",
        color: added ? "var(--neon-green)" : "var(--fg)",
      }}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          تمت الإضافة إلى السلة!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? "نفد من المخزون" : "أضف إلى السلة"}
        </>
      )}
    </button>
  );
}
