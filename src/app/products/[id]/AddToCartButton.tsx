"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product, selectedVariant }: { product: Product; selectedVariant?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Construct a dummy ProductVariant if a variant string is selected
    const variantObj = selectedVariant ? {
      id: "custom-variant",
      tenant_id: product.tenant_id,
      product_id: product.id,
      attribute: "custom",
      custom_name: null,
      value: selectedVariant,
      quantity: 1,
      sort_order: 0,
      created_at: new Date().toISOString(),
    } : undefined;

    addItem(product, 1, variantObj);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.current_quantity <= 0}
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
          تمت الإضافة للسلة !
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          أضف إلى السلة
        </>
      )}
    </button>
  );
}
