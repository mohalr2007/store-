"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGrid({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.sku && product.sku.toLowerCase().includes(query));
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="space-y-7">
      <div className="grid gap-3 rounded-[1.5rem] border border-black/8 bg-white p-3 shop-shadow lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un produit, SKU ou collection..."
            className="h-12 w-full rounded-full border border-transparent bg-[var(--background)] pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[var(--primary)]/30 focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)]">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "h-10 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-[0.1em] transition",
              selectedCategory === "all"
                ? "bg-[var(--ink)] text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)]"
            )}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category!)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-[0.1em] transition",
                selectedCategory === category
                  ? "bg-[var(--ink)] text-white"
                  : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)]"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white p-14 text-center">
          <p className="text-base font-black">Aucun produit trouve</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Essayez une autre recherche ou retirez les filtres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
