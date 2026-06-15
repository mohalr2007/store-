"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Loader2, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { submitStoreOrderAction } from "@/app/actions/storefront";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra",
  "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda",
  "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem",
  "M'sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "Alger",
    city: "",
    address: "",
    notes: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      setError("Panier vide");
      return;
    }
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await submitStoreOrderAction({
        fullName: form.fullName,
        phone: form.phone,
        province: form.province,
        city: form.city,
        address: form.address,
        notes: form.notes,
      }, items.map((item) => ({ product: item.product, quantity: item.quantity })));

      if (!result.success) {
        throw new Error(result.error);
      }

      clearCart();
      router.push(`/order-confirmation?order=${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="shop-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-14 w-14 text-[var(--muted-foreground)]/30" />
          <p className="mt-4 text-xl font-black">Votre panier est vide</p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-[var(--ink)] px-7 text-sm font-black text-white"
          >
            Retour au catalogue
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="shop-container py-10">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
            Checkout COD
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Confirmer votre commande.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            Remplissez vos coordonnees. Nous vous appelons pour confirmer avant l'expedition.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <section className="rounded-[2rem] border border-black/8 bg-white p-5 shop-shadow sm:p-7">
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom complet *">
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Mohamed Larabi"
                  className="shop-input"
                />
              </Field>
              <Field label="Telephone *">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  placeholder="0555 12 34 56"
                  className="shop-input"
                />
              </Field>
              <Field label="Wilaya *">
                <select name="province" value={form.province} onChange={handleChange} className="shop-input">
                  {WILAYAS.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ville / commune">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Commune"
                  className="shop-input"
                />
              </Field>
            </div>

            <div className="mt-4 space-y-4">
              <Field label="Adresse complete *">
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Rue, numero, lot, point de repere..."
                  className="shop-input resize-none"
                />
              </Field>
              <Field label="Notes de livraison">
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Instructions optionnelles"
                  className="shop-input"
                />
              </Field>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-black/8 bg-[var(--cream)] p-5 shop-shadow lg:sticky lg:top-32">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
              Votre commande
            </p>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <CheckoutLine key={item.product.id} item={item} />
              ))}
            </div>

            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Sous-total</span>
                <span className="font-black">{formatCurrency(total)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Paiement</span>
                <span className="font-black">A la livraison</span>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <span className="text-sm font-bold text-[var(--muted-foreground)]">Total</span>
                <span className="text-2xl font-black text-[var(--primary)]">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-sm font-black text-white shadow-xl transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirmation...
                </>
              ) : (
                "Confirmer la commande"
              )}
            </button>

            <div className="mt-5 grid gap-2 text-xs text-[var(--muted-foreground)]">
              <p className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[var(--primary)]" />
                Paiement COD, pas de carte bancaire.
              </p>
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[var(--primary)]" />
                Livraison calculee selon la wilaya.
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                Vos informations restent privees.
              </p>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}

function CheckoutLine({ item }: { item: ReturnType<typeof useCart>["items"][number] }) {
  const image = getProductImage(item.product);

  return (
    <div className="flex gap-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--secondary)]">
        {image ? (
          <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center image-sheen">
            <ShoppingBag className="h-5 w-5 text-[var(--muted-foreground)]/40" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{item.product.name}</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Quantite {item.quantity}</p>
      </div>
      <p className="text-sm font-black">
        {formatCurrency(item.product.selling_price * item.quantity)}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
