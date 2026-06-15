import { notFound } from "next/navigation";
import { BadgeCheck, Clock3, Package, ShieldCheck, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AddToCartButton } from "./AddToCartButton";
import { DirectOrderForm } from "./DirectOrderForm";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { getPublicProductAction } from "@/app/actions/storefront";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPublicProductAction(id);
  const product = result.product;

  if (!product) notFound();
  const image = getProductImage(product);

  return (
    <>
      <Header />
      <main className="shop-container py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/8 bg-[var(--secondary)] shop-shadow lg:aspect-square">
              {image ? (
                <img src={image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 image-sheen text-[var(--muted-foreground)]">
                  <Package className="h-16 w-16 opacity-50" />
                  <span className="text-xs font-black uppercase tracking-[0.18em]">COD Store</span>
                </div>
              )}
              {product.category && (
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--ink)] shadow-sm backdrop-blur">
                  {product.category}
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, text: "Livraison 24-72h" },
                { icon: ShieldCheck, text: "Paiement a reception" },
                { icon: BadgeCheck, text: "Commande confirmee" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="rounded-2xl border border-black/8 bg-white p-4 text-sm font-bold shop-shadow">
                    <Icon className="mb-3 h-5 w-5 text-[var(--primary)]" />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[2rem] border border-black/8 bg-white p-6 shop-shadow sm:p-8">
              {product.category && (
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                  {product.category}
                </p>
              )}
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{product.name}</h1>
              {product.sku && (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  SKU {product.sku}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <p className="text-4xl font-black text-[var(--primary)]">
                  {formatCurrency(product.selling_price)}
                </p>
                {product.current_quantity > 0 ? (
                  <span className="rounded-full bg-[var(--sage)] px-4 py-2 text-xs font-black text-[var(--primary)]">
                    En stock
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700">
                    Rupture de stock
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-6 text-sm leading-7 text-[var(--muted-foreground)]">
                  {product.description}
                </p>
              )}

              <AddToCartButton product={product} />
              <DirectOrderForm product={product} />

              <div className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
                {[
                  { icon: Clock3, title: "Confirmation", text: "Un agent confirme votre commande avant expedition." },
                  { icon: Truck, title: "Livraison", text: "Frais selon wilaya, paiement uniquement a reception." },
                  { icon: ShieldCheck, title: "Confiance", text: "Vos informations servent seulement au traitement de la commande." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 p-4">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <div>
                        <p className="text-sm font-black">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
