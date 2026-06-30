"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X, Zap } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "الكتالوج" },
    { href: "/checkout", label: "الطلب" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Promo bar */}
        <div
          className="promo-gradient px-4 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white"
        >
          <span className="inline-flex items-center gap-2">
            <Zap className="h-3 w-3" />
            <span className="hidden sm:inline">توصيل لجميع الولايات — الدفع عند الاستلام</span>
            <span className="sm:hidden">الدفع عند الاستلام</span>
            <Zap className="h-3 w-3" />
          </span>
        </div>

        {/* Main nav */}
        <div className="shop-container flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden sm:h-14 sm:w-14">
              <img
                src="/logo.jpg"
                alt="AL CARTEL SHOP DZ"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-black tracking-tight" style={{ color: "var(--fg)" }}>
                AL CARTEL
              </span>
              <span
                className="block text-[9px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--neon-purple)" }}
              >
                SHOP DZ
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-[rgba(124,58,237,0.1)]"
                style={{ color: "var(--fg-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Left actions (since RTL, start is right, end is left) */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-black text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 0 16px rgba(124,58,237,0.4)",
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">السلة</span>
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black"
                style={{ background: "var(--neon-gold)", color: "#0a0a0f" }}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
              style={{
                background: "rgba(124,58,237,0.1)",
                border: "1px solid var(--border)",
                color: "var(--fg)",
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="border-t md:hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="shop-container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center rounded-xl px-4 text-sm font-semibold transition-all"
                  style={{ color: "var(--fg)", background: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
