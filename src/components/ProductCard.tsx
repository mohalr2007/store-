import Link from "next/link";
import { ArrowUpRight, Package, Play } from "lucide-react";
import { formatCurrency, getProductImage } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);
  
  // KEY FIX: If variants exist, the real stock = sum of variant quantities
  // This prevents the bug where adding variants makes the badge show "sold out"
  const effectiveStock = (product.variants && product.variants.length > 0)
    ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
    : product.current_quantity;

  const isLowStock = effectiveStock > 0 && effectiveStock <= product.low_stock_threshold;
  const isSoldOut = effectiveStock <= 0;
  const has360 = !!product.video_url;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden sm:aspect-[4/5]"
        style={{ background: "var(--bg-card-2)" }}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 image-sheen">
            <Package className="h-10 w-10 opacity-25" style={{ color: "var(--neon-blue)" }} />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] opacity-30" style={{ color: "var(--fg)" }}>
              Al Cartel
            </span>
          </div>
        )}

        {/* Gradient bottom overlay */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3">
          {product.category && (
            <span
              className="badge"
              style={{
                background: "rgba(69,212,232,0.12)",
                color: "var(--fg)",
                backdropFilter: "blur(4px)",
              }}
            >
              {product.category}
            </span>
          )}
          {isLowStock && (
            <span
              className="badge"
              style={{ background: "rgba(251,191,36,0.9)", color: "#0a0a0f" }}
            >
              كمية قليلة
            </span>
          )}
          {isSoldOut && (
            <span
              className="badge"
              style={{ background: "rgba(244,63,94,0.85)", color: "white" }}
            >
              نفذ
            </span>
          )}
          {product.is_free_shipping && (
            <span
              className="badge"
              style={{ background: "rgba(16,185,129,0.9)", color: "white" }}
            >
              توصيل مجاني 🚚
            </span>
          )}
          {has360 && (
            <span
              className="badge"
              style={{ background: "rgba(69,212,232,0.14)", color: "var(--fg)" }}
            >
              <Play className="h-2.5 w-2.5" fill="currentColor" />
              360°
            </span>
          )}
        </div>

        {/* Arrow hover */}
        <span
          className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-2 items-center justify-center rounded-xl text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3 sm:h-9 sm:w-9"
          style={{
            background: "linear-gradient(135deg, var(--brand-dark), var(--brand))",
            boxShadow: "0 0 10px rgba(69,212,232,0.14)",
          }}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <h3
          className="line-clamp-2 min-h-[2.2rem] text-xs font-black leading-5 sm:text-sm"
          style={{ color: "var(--fg)" }}
        >
          {product.name}
        </h3>

        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="text-base font-black gradient-text-gold sm:text-lg">
            {formatCurrency(product.selling_price)}
          </p>
          <span
            className="badge shrink-0"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "var(--neon-green)",
              padding: "0.25rem 0.6rem",
            }}
          >
            الدفع عند الاستلام
          </span>
        </div>
      </div>
    </Link>
  );
}

