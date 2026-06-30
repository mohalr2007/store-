"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--card)] shadow-2xl transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-base font-semibold">سلة المشتريات ({itemCount})</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--accent)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-[var(--muted-foreground)]/20 mb-3" />
              <p className="text-sm text-[var(--muted-foreground)]">سلة المشتريات فارغة</p>
              <Link href="/products" onClick={onClose} className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-xl border border-[var(--border)] p-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]">
                    {item.variant?.custom_name && item.variant.custom_name.startsWith('http') ? (
                      <img src={item.variant.custom_name} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : getProductImage(item.product) ? (
                      <img src={getProductImage(item.product)!} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-sm font-semibold truncate">{item.product.name}</h3>
                      {item.variant?.value && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.variant.value}</p>
                      )}
                      <p className="text-xs text-[var(--muted-foreground)]">{formatCurrency(item.product.selling_price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--accent)]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--accent)]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatCurrency(item.product.selling_price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="rounded-lg p-1 text-[var(--muted-foreground)] hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-[var(--muted-foreground)]">المجموع الفرعي</span>
              <span className="text-lg font-bold">{formatCurrency(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex h-11 w-full items-center justify-center rounded-xl gradient-shop text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
            >
              متابعة الطلب
            </Link>
            <p className="mt-2 text-center text-[10px] text-[var(--muted-foreground)]">
              الدفع عند الاستلام • لا يوجد دفع عبر الإنترنت
            </p>
          </div>
        )}
      </div>
    </>
  );
}
