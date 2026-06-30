import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { listPublicProductsAction } from "@/app/actions/storefront";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const result = await listPublicProductsAction();
  const products = result.products;

  return (
    <>
      <Header />
      <main className="neon-grid-bg min-h-screen">
        <section
          style={{
            background: "var(--bg-card-2)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="shop-container py-10 sm:py-16">
            <p
              className="mb-2 text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: "var(--neon-purple)" }}
            >
              الكتالوج
            </p>
            <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1
                  className="max-w-2xl text-[2.2rem] font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ color: "var(--fg)" }}
                >
                  جميع المنتجات المتوفرة.
                </h1>
                <p
                  className="mt-4 max-w-xl text-sm leading-6 sm:mt-5 sm:text-base sm:leading-7"
                  style={{ color: "var(--fg-muted)" }}
                >
                  تصفح التشكيلات، قم بتصفية النتائج بسرعة، ثم اطلب والدفع عند الاستلام (COD) بدون دفع إلكتروني.
                </p>
              </div>
              <div
                className="card rounded-2xl px-6 py-5 text-center"
              >
                <p className="text-3xl font-black gradient-text-purple sm:text-4xl">
                  {products.length}
                </p>
                <p
                  className="mt-1 text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  منتج
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="shop-container py-8 sm:py-14">
          <ProductGrid products={products} />
        </section>
      </main>
      <Footer />
    </>
  );
}
