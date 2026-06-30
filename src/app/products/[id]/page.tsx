import { notFound } from "next/navigation";
import { BadgeCheck, Clock3, ShieldCheck, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { getPublicProductAction } from "@/app/actions/storefront";
import { ProductPageLayout } from "./ProductPageLayout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicProductAction(id);
  const product = result.product;

  if (!product) return { title: "المنتج غير موجود | AL CARTEL SHOP DZ" };

  return {
    title: `${product.name} | AL CARTEL SHOP DZ`,
    description:
      product.description ||
      `اشتري ${product.name} بأفضل سعر مع الدفع عند الاستلام (COD) في جميع أنحاء الجزائر.`,
    openGraph: {
      title: product.name,
      description: product.description || "الدفع عند الاستلام",
      images: getProductImage(product) ? [{ url: getProductImage(product)! }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPublicProductAction(id);
  const product = result.product;

  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="neon-grid-bg min-h-screen">
        <div className="shop-container py-6 sm:py-10 lg:py-14">
          <ProductPageLayout product={product} />
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 pb-safe lg:hidden"
        style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <a
          href="#direct-order"
          className="btn-primary w-full h-14 text-sm"
          style={{ borderRadius: "1rem", boxShadow: "0 0 28px rgba(124,58,237,0.5)" }}
        >
          اطلب الآن — الدفع عند الاستلام
        </a>
      </div>

      <Footer />
    </>
  );
}
