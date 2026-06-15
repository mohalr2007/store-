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
      <main>
        <section className="border-b border-black/8 bg-[var(--cream)]">
          <div className="shop-container py-12 sm:py-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
              Catalogue
            </p>
            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
                  Tous les produits disponibles.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                  Parcourez les collections, filtrez rapidement, puis commandez en COD sans paiement en ligne.
                </p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white px-5 py-4 shop-shadow">
                <p className="text-3xl font-black">{products.length}</p>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  produits
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="shop-container py-10">
          <ProductGrid products={products} />
        </section>
      </main>
      <Footer />
    </>
  );
}
