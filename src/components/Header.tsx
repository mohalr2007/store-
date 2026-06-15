"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--cream)]/92 backdrop-blur-xl">
      <div className="bg-[var(--ink)] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
        Livraison rapide en Algerie - paiement a la livraison
      </div>

      <div className="shop-container flex h-[4.5rem] items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-black text-white shadow-sm">
              CS
            </div>
            <div className="leading-tight">
              <span className="block text-base font-black tracking-tight sm:text-lg">COD Store</span>
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)] sm:block">
                curated daily essentials
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center rounded-full border border-[var(--border)] bg-white/70 px-2 py-1 shadow-sm md:flex">
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)]">
            Accueil
          </Link>
          <Link href="/products" className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--foreground)]">
            Catalogue
          </Link>
          <Link href="/checkout" className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--foreground)]">
            Checkout
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] lg:flex">
            <Truck className="h-4 w-4 text-[var(--primary)]" />
            24-72h
          </div>
          <Link
            href="/products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--muted-foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/cart"
            className="relative flex h-10 items-center gap-2 rounded-full bg-[var(--ink)] px-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Panier</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-black text-[var(--ink)]">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
