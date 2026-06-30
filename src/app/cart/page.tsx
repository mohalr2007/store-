"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCartItemKey, useCart } from "@/components/CartProvider";
import { formatCurrency, getProductImage } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <>
      <Header />
      <main className="neon-grid-bg min-h-screen py-10">
        <div className="shop-container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                السلة
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                سلة مشترياتك
              </h1>
            </div>
            <Link href="/products" className="btn-outline h-11 px-5 text-sm font-black">
              <ArrowLeft className="h-4 w-4 rotate-180" />
              مواصلة التسوق
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="card-glow mt-8 flex flex-col items-center justify-center rounded-[2rem] border-dashed px-6 py-20 text-center">
              <ShoppingBag className="h-14 w-14 text-[var(--muted-foreground)]/30" />
              <p className="mt-5 text-xl font-black">سلتك فارغة</p>
              <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
                استعرض المنتجات وأضف ما يعجبك قبل إتمام الطلب.
              </p>
              <Link href="/products" className="btn-primary mt-6 h-12 px-7">
                تصفح الكتالوج
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartLine
                    key={getCartItemKey(item)}
                    item={item}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </div>

              <aside className="card-glow h-fit rounded-[1.5rem] p-5 lg:sticky lg:top-32">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                  الملخص
                </p>
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      المجموع الفرعي ({itemCount} {itemCount === 1 ? "منتج" : "منتجات"})
                    </span>
                    <span className="font-black">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">التوصيل</span>
                    <span className="font-black">حسب الولاية</span>
                  </div>
                </div>
                <div className="mt-5 border-t border-[var(--border)] pt-5">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">المبلغ عند الاستلام</span>
                    <span className="text-2xl font-black text-[var(--primary)]">{formatCurrency(total)}</span>
                  </div>
                  <Link href="/checkout" className="btn-primary mt-5 h-12 w-full">
                    إتمام الطلب
                  </Link>
                  <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[var(--muted-foreground)]">
                    <Truck className="h-4 w-4 text-[var(--primary)]" />
                    لا يوجد دفع إلكتروني. الدفع يتم عند التسليم.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
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
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
}) {
  const image = getProductImage(item.product);
  const itemKey = getCartItemKey(item);

  return (
    <div className="card grid gap-4 rounded-[1.5rem] p-4 sm:grid-cols-[112px_1fr]">
      <div className="aspect-square overflow-hidden rounded-[1.1rem] bg-[var(--bg-card-2)]">
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
            {item.variant?.value && (
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {item.variant.attribute}: {item.variant.value}
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(itemKey)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--bg-card-2)] text-[var(--muted-foreground)] transition hover:bg-red-50 hover:text-red-600"
            aria-label="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] p-1">
            <button
              onClick={() => updateQuantity(itemKey, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]"
              aria-label="إنقاص"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(itemKey, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]"
              aria-label="زيادة"
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
