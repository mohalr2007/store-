import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  const formatted = amount.toLocaleString("fr-DZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} د.ج`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getProductImage(product: Product): string | null {
  if (product.image_url || product.image_path) {
    return product.image_url || product.image_path || null;
  }
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  // Deterministic fallback based on product ID length or characters
  const charCode = (product.id || "").charCodeAt(0) || 0;
  const mod = charCode % 3;
  return `/images/product-${mod + 1}.png`;
}
