"use client";

import { useState } from "react";
import { Package, ZoomIn, X, Play } from "lucide-react";
import { Interactive360Video } from "@/components/Interactive360Video";
import { getProductImage, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

import { useEffect } from "react";
export function ImageGallery({ product, activeImageUrl, colorSelected }: { product: Product; activeImageUrl?: string | null; colorSelected?: boolean }) {
  const images = Array.from(new Set([
    product.image_url || product.image_path,
    ...(product.images || [])
  ])).filter(Boolean) as string[];

  if (images.length === 0) {
    const fallback = getProductImage(product);
    if (fallback) images.push(fallback);
  }
  const hasVideo = !!product.video_url;

  const [activeIndex, setActiveIndex] = useState<number | "video">(hasVideo ? "video" : 0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (activeImageUrl) {
      // A variant color with a linked image was selected → jump to that image
      const idx = images.findIndex((img) => img === activeImageUrl);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    } else if (colorSelected === false) {
      // Color was explicitly DESELECTED → reset to default (360° or main image)
      setActiveIndex(hasVideo ? "video" : 0);
    }
    // if colorSelected=true but activeImageUrl=null: color selected but no linked image, keep current view
  }, [activeImageUrl, colorSelected]);

  return (
    <div className="space-y-3">
      {/* Main view */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl sm:aspect-[4/5] sm:rounded-3xl"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {activeIndex === "video" && product.video_url ? (
          <Interactive360Video src={product.video_url} poster={images[0]} className="w-full h-full" />
        ) : images.length > 0 && typeof activeIndex === "number" ? (
          <>
            <img
              src={images[activeIndex]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Zoom button */}
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-110 sm:h-10 sm:w-10"
              style={{
                background: "rgba(69,212,232,0.16)",
                border: "1px solid rgba(69,212,232,0.28)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ZoomIn className="h-4 w-4" style={{ color: "var(--fg)" }} />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 image-sheen">
            <Package className="h-14 w-14 opacity-20" style={{ color: "var(--neon-blue)" }} />
            <span className="text-xs font-black uppercase tracking-[0.18em] opacity-25" style={{ color: "var(--fg)" }}>
              Al Cartel Shop
            </span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span
            className="badge absolute left-3 top-3"
            style={{
              background: "rgba(69,212,232,0.12)",
              color: "var(--fg)",
              backdropFilter: "blur(8px)",
              padding: "0.3rem 0.75rem",
            }}
          >
            {product.category}
          </span>
        )}

        {/* 360 indicator */}
        {activeIndex === "video" && (
          <div
            className="badge absolute top-3 right-3"
            style={{
              background: "rgba(69,212,232,0.12)",
              border: "1px solid rgba(69,212,232,0.22)",
              color: "var(--fg)",
              padding: "0.3rem 0.75rem",
            }}
          >
            <Play className="h-3 w-3" />
            Vue 360°
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {(images.length > 1 || hasVideo) && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 sm:gap-3">
          {/* 360 thumb */}
          {hasVideo && (
            <button
              onClick={() => setActiveIndex("video")}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all sm:h-20 sm:w-20 sm:rounded-2xl",
                activeIndex === "video" ? "scale-105" : "opacity-55 hover:opacity-80"
              )}
              style={{
                background: "var(--bg-card)",
                border: activeIndex === "video"
                  ? "2px solid rgba(69,212,232,0.42)"
                  : "2px solid var(--border)",
                boxShadow: activeIndex === "video" ? "0 0 10px rgba(69,212,232,0.16)" : "none",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Play className="h-4 w-4" style={{ color: "var(--fg)" }} />
                <span className="text-[8px] font-black uppercase tracking-[0.12em]" style={{ color: "var(--fg)" }}>360°</span>
              </div>
            </button>
          )}

          {/* Photo thumbs */}
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all sm:h-20 sm:w-20 sm:rounded-2xl",
                activeIndex === idx ? "scale-105" : "opacity-55 hover:opacity-80"
              )}
              style={{
                background: "var(--bg-card)",
                border: activeIndex === idx
                  ? "2px solid rgba(69,212,232,0.42)"
                  : "2px solid var(--border)",
                boxShadow: activeIndex === idx ? "0 0 10px rgba(69,212,232,0.16)" : "none",
              }}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isZoomed && typeof activeIndex === "number" && images[activeIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors sm:right-6 sm:top-6"
            style={{ border: "1px solid var(--border-strong)" }}
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={images[activeIndex]}
            alt={product.name}
            className="max-h-full max-w-full rounded-2xl object-contain"
            style={{ boxShadow: "0 0 60px rgba(69,212,232,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

