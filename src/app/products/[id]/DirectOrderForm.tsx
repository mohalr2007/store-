"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PhoneCall } from "lucide-react";
import type { Product } from "@/lib/types";
import { submitStoreOrderAction } from "@/app/actions/storefront";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra",
  "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda",
  "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem",
  "M'sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
];

export function DirectOrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "Alger",
    address: "",
    quantity: 1,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.name === "quantity" ? Number(event.target.value) : event.target.value;
    setForm((previous) => ({ ...previous, [event.target.name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Veuillez remplir nom, telephone et adresse.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const quantity = Math.max(1, Number(form.quantity || 1));
      const result = await submitStoreOrderAction(
        {
          fullName: form.fullName,
          phone: form.phone,
          province: form.province,
          address: form.address,
          notes: `Commande directe store: ${product.name}`,
        },
        [{ product, quantity }]
      );

      if (!result.success) throw new Error(result.error);

      router.push(`/order-confirmation?order=${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Impossible de confirmer la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-4">
      <p className="flex items-center gap-2 text-sm font-black">
        <PhoneCall className="h-4 w-4 text-[var(--primary)]" />
        Commander ce produit maintenant
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Nom complet" className="shop-input" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Telephone" className="shop-input" />
        <select name="province" value={form.province} onChange={handleChange} className="shop-input">
          {WILAYAS.map((wilaya) => (
            <option key={wilaya} value={wilaya}>{wilaya}</option>
          ))}
        </select>
        <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} className="shop-input" />
      </div>
      <input name="address" value={form.address} onChange={handleChange} required placeholder="Adresse complete" className="shop-input mt-3" />
      {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || product.current_quantity <= 0}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi...</> : "Envoyer la commande"}
      </button>
    </form>
  );
}
