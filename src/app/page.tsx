import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Headphones, ShieldCheck, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { listPublicProductsAction } from "@/app/actions/storefront";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await listPublicProductsAction(8);
  const products = result.products;

  const featured = products[0];
  const heroImage = featured ? getProductImage(featured) : null;

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[620px] overflow-hidden bg-[var(--ink)] text-white">
          {heroImage ? (
            <img
              src={heroImage}
              alt={featured.name}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          ) : (
            <div className="absolute inset-0 image-sheen opacity-75" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,18,13,0.88),rgba(21,18,13,0.52)_45%,rgba(21,18,13,0.18))]" />

          <div className="shop-container relative flex min-h-[620px] items-end pb-10 pt-24 sm:pb-14">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
                <BadgeCheck className="h-3.5 w-3.5" />
                Nouvelle selection COD
              </p>
              <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
                Une boutique claire pour commander sans stress.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Des produits selectionnes, une confirmation rapide, et le paiement a la livraison partout en Algerie.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[var(--ink)] shadow-xl transition hover:-translate-y-0.5 hover:bg-[var(--cream)]"
                >
                  Acheter maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/checkout"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Commander en COD
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="shop-container -mt-9 relative z-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Livraison rapide", text: "24-72h selon la wilaya" },
            { icon: ShieldCheck, title: "Paiement securise", text: "Vous payez a la reception" },
            { icon: Headphones, title: "Support humain", text: "Confirmation avant expedition" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="shop-shadow rounded-2xl border border-black/8 bg-white p-5">
                <Icon className="h-5 w-5 text-[var(--primary)]" />
                <p className="mt-3 text-sm font-black">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.text}</p>
              </div>
            );
          })}
        </section>

        {featured && (
          <section className="shop-container py-16">
            <div className="grid overflow-hidden rounded-[2rem] border border-black/10 bg-[var(--cream)] shop-shadow lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[320px] bg-[var(--secondary)]">
                {getProductImage(featured) ? (
                  <img src={getProductImage(featured)!} alt={featured.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center image-sheen">
                    <span className="text-6xl font-black text-[var(--primary)] opacity-25">CS</span>
                  </div>
                )}
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                  Produit vedette
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{featured.name}</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                  Disponible maintenant avec confirmation rapide. Ajoutez-le au panier et finalisez votre commande
                  en quelques champs seulement.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <p className="text-3xl font-black text-[var(--primary)]">
                    {formatCurrency(featured.selling_price)}
                  </p>
                  <span className="rounded-full bg-[var(--sage)] px-3 py-1 text-xs font-black text-[var(--primary)]">
                    En stock
                  </span>
                </div>
                <Link
                  href={`/products/${featured.id}`}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--ink)] px-7 text-sm font-black text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Voir le produit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="shop-container pb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                Selection populaire
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Produits a decouvrir</h2>
            </div>
            <Link href="/products" className="inline-flex items-center text-sm font-black text-[var(--primary)]">
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-[var(--border)] bg-white p-14 text-center text-sm text-[var(--muted-foreground)]">
              Aucun produit disponible pour le moment.
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="shop-container py-14">
          <div className="grid gap-4 rounded-[2rem] bg-[var(--ink)] p-6 text-white sm:grid-cols-3 sm:p-8">
            {[
              { icon: Clock3, value: "24-72h", label: "delai de livraison" },
              { icon: BadgeCheck, value: "COD", label: "paiement a reception" },
              { icon: ShieldCheck, value: "Suivi", label: "commande confirmee" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Icon className="h-5 w-5 text-[var(--gold)]" />
                  <p className="mt-4 text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-sm text-white/60">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
