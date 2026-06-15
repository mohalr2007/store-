import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import { formatCurrency, getProductImage } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);
  const isLowStock =
    product.current_quantity > 0 && product.current_quantity <= product.low_stock_threshold;
  const isSoldOut = product.current_quantity <= 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-[1.35rem] border border-black/8 bg-white shop-shadow transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--secondary)]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 image-sheen text-[var(--muted-foreground)]">
            <Package className="h-11 w-11 opacity-50" />
            <span className="text-xs font-black uppercase tracking-[0.18em] opacity-70">
              COD Store
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.category && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--ink)] shadow-sm backdrop-blur">
              {product.category}
            </span>
          )}
          {isLowStock && (
            <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm">
              Stock faible
            </span>
          )}
          {isSoldOut && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm">
              Rupture
            </span>
          )}
        </div>

        <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[var(--ink)] text-white opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-[var(--foreground)]">
          {product.name}
        </h3>
        {product.sku && (
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            SKU {product.sku}
          </p>
        )}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Prix
            </p>
            <p className="text-lg font-black text-[var(--primary)]">
              {formatCurrency(product.selling_price)}
            </p>
          </div>
          <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-black text-[var(--primary)]">
            COD
          </span>
        </div>
      </div>
    </Link>
  );
}
