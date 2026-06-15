"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, getProductImage } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <>
      <Header />
      <main className="shop-container py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
              Panier
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Votre selection.
            </h1>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 text-sm font-black text-[var(--foreground)] transition hover:bg-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuer les achats
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-white px-6 py-20 text-center shop-shadow">
            <ShoppingBag className="h-14 w-14 text-[var(--muted-foreground)]/30" />
            <p className="mt-5 text-xl font-black">Votre panier est vide</p>
            <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
              Decouvrez nos produits et ajoutez vos favoris avant de confirmer en COD.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-[var(--ink)] px-7 text-sm font-black text-white transition hover:opacity-90"
            >
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartLine
                  key={item.product.id}
                  item={item}
                  removeItem={removeItem}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>

            <aside className="h-fit rounded-[1.5rem] border border-black/8 bg-[var(--cream)] p-5 shop-shadow lg:sticky lg:top-32">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                Resume
              </p>
              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">
                    Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})
                  </span>
                  <span className="font-black">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Livraison</span>
                  <span className="font-black">Selon wilaya</span>
                </div>
              </div>
              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold text-[var(--muted-foreground)]">Total COD</span>
                  <span className="text-2xl font-black text-[var(--primary)]">{formatCurrency(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[var(--ink)] text-sm font-black text-white transition hover:opacity-90"
                >
                  Passer la commande
                </Link>
                <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[var(--muted-foreground)]">
                  <Truck className="h-4 w-4 text-[var(--primary)]" />
                  Aucun paiement en ligne. Vous payez a la livraison.
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function CartLine({
  item,
  removeItem,
  updateQuantity,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}) {
  const image = getProductImage(item.product);

  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-black/8 bg-white p-4 shop-shadow sm:grid-cols-[112px_1fr]">
      <div className="aspect-square overflow-hidden rounded-[1.1rem] bg-[var(--secondary)]">
        {image ? (
          <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center image-sheen">
            <ShoppingBag className="h-9 w-9 text-[var(--muted-foreground)]/35" />
          </div>
        )}
      </div>
                  <div className="flex min-w-0 flex-col justify-between gap-5">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-black">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {formatCurrency(item.product.selling_price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-lg font-black text-[var(--primary)]">
                        {formatCurrency(item.product.selling_price * item.quantity)}
                      </span>
                    </div>
                  </div>
    </div>
  );
}
