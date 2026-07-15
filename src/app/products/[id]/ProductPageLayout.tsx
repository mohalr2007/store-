"use client";

import { useState } from "react";
import { BadgeCheck, Clock3, ShieldCheck, Truck } from "lucide-react";
import { ImageGallery } from "@/components/ImageGallery";
import { AddToCartButton } from "./AddToCartButton";
import { DirectOrderForm } from "./DirectOrderForm";
import { formatCurrency } from "@/lib/utils";
import type { Product, ProductVariant } from "@/lib/types";

export function ProductPageLayout({ product }: { product: Product }) {
  const colorVariants = product.variants?.filter((v) => v.attribute === "color") || [];
  const sizeVariants = product.variants?.filter((v) => v.attribute === "size") || [];

  const [selectedColor, setSelectedColor] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductVariant | null>(null);

  const activeImageUrl = selectedColor?.custom_name?.startsWith("http")
    ? selectedColor.custom_name
    : null;

  const hasVariants = (product.variants?.length || 0) > 0;
  const selectedVariantStock = selectedColor
    ? selectedColor.quantity
    : selectedSize
      ? selectedSize.quantity
      : null;
  const selectedStockVariant = selectedColor || selectedSize || null;
  const effectiveStock = hasVariants
    ? (selectedVariantStock !== null ? selectedVariantStock : (product.variants || []).reduce((sum, v) => sum + (v.quantity || 0), 0))
    : product.current_quantity;

  const currentVariantLabel = [
    selectedColor ? `اللون: ${selectedColor.value}` : null,
    selectedSize ? `المقاس: ${selectedSize.value}` : null,
  ].filter(Boolean).join(" / ");

  const isColorValid = colorVariants.length === 0 || selectedColor !== null;
  const isSizeValid = sizeVariants.length === 0 || selectedSize !== null;
  const isSelectionValid = isColorValid && isSizeValid;
  const missingSelectionMessage = !isColorValid && !isSizeValid
    ? "يرجى اختيار اللون والمقاس أولاً."
    : !isColorValid
      ? "يرجى اختيار اللون أولاً."
      : !isSizeValid
        ? "يرجى اختيار المقاس أولاً."
        : "";

  const variantSelectorBlock = (colorVariants.length > 0 || sizeVariants.length > 0) ? (
    <div className="space-y-4">
      {colorVariants.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)]">اللون</p>
          <div className="flex flex-wrap gap-2.5">
            {colorVariants.map((variant) => {
              const isSelected = selectedColor?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedColor(isSelected ? null : variant)}
                  className="rounded-full border px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    borderColor: isSelected ? "rgba(69,212,232,0.35)" : "var(--border)",
                    background: isSelected ? "rgba(69,212,232,0.12)" : "var(--bg-card)",
                    color: "var(--fg)",
                    boxShadow: isSelected ? "0 0 0 1px rgba(69,212,232,0.10)" : "none",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: isSelected ? "var(--brand)" : "rgba(16,41,47,0.16)",
                      }}
                    />
                    {variant.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizeVariants.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)]">المقاس</p>
          <div className="flex flex-wrap gap-2.5">
            {sizeVariants.map((variant) => {
              const isSelected = selectedSize?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedSize(isSelected ? null : variant)}
                  className="rounded-full border px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    borderColor: isSelected ? "rgba(69,212,232,0.35)" : "var(--border)",
                    background: isSelected ? "rgba(69,212,232,0.12)" : "var(--bg-card)",
                    color: "var(--fg)",
                    boxShadow: isSelected ? "0 0 0 1px rgba(69,212,232,0.10)" : "none",
                  }}
                >
                  {variant.value}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <section className="min-w-0">
        <ImageGallery product={product} activeImageUrl={activeImageUrl} colorSelected={!!selectedColor} />

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {[
            { icon: Truck, text: "توصيل خلال 24-72 ساعة", color: "var(--neon-blue)" },
            { icon: ShieldCheck, text: "الدفع عند الاستلام", color: "var(--neon-blue)" },
            { icon: BadgeCheck, text: "تأكيد الطلب", color: "var(--neon-gold)" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="card rounded-xl p-3 text-xs font-semibold sm:rounded-2xl sm:p-4">
                <Icon className="mb-2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: item.color }} />
                <span style={{ color: "var(--fg)" }}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="card rounded-2xl p-5 sm:rounded-3xl sm:p-7 lg:p-9">
          {product.category && (
            <span
              className="badge"
              style={{
                background: "rgba(69,212,232,0.08)",
                border: "1px solid var(--border-strong)",
                color: "var(--fg)",
                padding: "0.35rem 0.85rem",
                fontSize: "0.65rem",
              }}
            >
              {product.category}
            </span>
          )}

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--fg)" }}>
            {product.name}
          </h1>

          {product.sku && (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--fg-subtle)" }}>
              رمز المنتج: {product.sku}
            </p>
          )}

          <div className="divider-neon my-5" />

          <div className="flex flex-col gap-1">
            {product.original_price && product.original_price > product.selling_price && (
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-[var(--fg-muted)] line-through">
                  {formatCurrency(product.original_price)}
                </span>
                <span className="rounded-lg bg-[rgba(244,63,94,0.15)] px-2.5 py-1 text-sm font-black text-[var(--neon-red)] border border-[rgba(244,63,94,0.3)]">
                  تخفيض -{Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)}%
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-4xl font-black gradient-text-gold sm:text-5xl">
                {formatCurrency(product.selling_price)}
              </p>
              <span
                className="badge"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.22)",
                  color: "var(--neon-green)",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.7rem",
                }}
              >
                متوفر في المخزون
              </span>
            </div>
          </div>

          <div className="mt-6">
            {variantSelectorBlock}
          </div>

          {product.description && (
            <p className="mt-5 text-sm leading-7" style={{ color: "var(--fg-muted)" }}>
              {product.description}
            </p>
          )}

          <div className="mt-7">
            <AddToCartButton 
              product={product} 
              selectedVariant={selectedStockVariant} 
              effectiveStock={effectiveStock} 
              isSelectionValid={isSelectionValid}
              missingSelectionMessage={missingSelectionMessage}
            />
          </div>

          <div id="direct-order" className="mt-4">
            <DirectOrderForm
              product={product}
              selectedVariant={selectedStockVariant}
              selectedVariantLabel={currentVariantLabel}
              effectiveStock={effectiveStock}
              isSelectionValid={isSelectionValid}
              missingSelectionMessage={missingSelectionMessage}
              variantSelector={variantSelectorBlock}
            />
          </div>

          <div className="mt-7 divide-y rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
            {[
              {
                icon: Clock3,
                title: "تأكيد الطلب",
                text: "يقوم الوكيل بتأكيد طلبك قبل الشحن.",
                color: "var(--neon-blue)",
              },
              {
                icon: Truck,
                title: "التوصيل",
                text: "الرسوم حسب الولاية. الدفع فقط عند الاستلام.",
                color: "var(--neon-blue)",
              },
              {
                icon: ShieldCheck,
                title: "الثقة",
                text: "بياناتك تستخدم فقط لمعالجة الطلب.",
                color: "var(--neon-gold)",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3 p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: item.color }} />
                  <div>
                    <p className="text-sm font-black" style={{ color: "var(--fg)" }}>{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5" style={{ color: "var(--fg-muted)" }}>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
