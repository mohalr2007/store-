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
    <div className="space-y-6 sm:space-y-8">
      {/* Search & Filters */}
      <div
        className="grid gap-3 rounded-2xl p-3 sm:rounded-3xl sm:p-4 lg:grid-cols-[1fr_auto] lg:items-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Search */}
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--fg-subtle)" }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن منتج، رمز أو تشكيلة..."
            className="shop-input h-12 rounded-xl pl-11 pr-4"
          />
        </div>

        {/* Filters */}
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 min-w-0">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(69,212,232,0.08)", color: "var(--neon-blue)" }}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "h-10 shrink-0 rounded-xl px-4 text-xs font-black uppercase tracking-[0.1em] transition-all",
              selectedCategory === "all"
                ? "scale-105"
                : "hover:scale-105"
            )}
            style={{
              background: selectedCategory === "all" ? "linear-gradient(135deg, var(--brand-dark), var(--brand))" : "var(--bg-input)",
              color: selectedCategory === "all" ? "white" : "var(--fg-muted)",
              boxShadow: selectedCategory === "all" ? "0 0 10px rgba(69,212,232,0.16)" : "none",
            }}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category!)}
              className={cn(
                "h-10 shrink-0 rounded-xl px-4 text-xs font-black uppercase tracking-[0.1em] transition-all",
                selectedCategory === category
                  ? "scale-105"
                  : "hover:scale-105"
              )}
              style={{
                background: selectedCategory === category ? "linear-gradient(135deg, var(--brand-dark), var(--brand))" : "var(--bg-input)",
                color: selectedCategory === category ? "white" : "var(--fg-muted)",
                boxShadow: selectedCategory === category ? "0 0 10px rgba(69,212,232,0.16)" : "none",
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-3xl p-14 text-center"
          style={{ border: "1px dashed var(--border-strong)", background: "var(--bg-card-2)" }}
        >
          <p className="text-base font-black" style={{ color: "var(--fg)" }}>لم يتم العثور على أي منتج</p>
          <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
            حاول استخدام كلمات بحث مختلفة أو قم بإزالة عوامل التصفية.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

