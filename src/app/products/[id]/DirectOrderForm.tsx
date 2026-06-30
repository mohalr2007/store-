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

export function DirectOrderForm({ product, selectedVariant }: { product: Product; selectedVariant?: string }) {
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
      setError("يرجى ملء الاسم، الهاتف والعنوان.");
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
          notes: `Commande directe store: ${product.name}${selectedVariant ? `\n${selectedVariant}` : ''}`,
        },
        [{ product, quantity }]
      );

      if (!result.success) throw new Error(result.error);

      router.push(`/order-confirmation?order=${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "تعذر تأكيد الطلب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl p-5"
      style={{ background: "rgba(124,58,237,0.06)", border: "1px solid var(--border-strong)" }}
    >
      <p className="flex items-center gap-2 text-sm font-black" style={{ color: "var(--fg)" }}>
        <PhoneCall className="h-4 w-4" style={{ color: "var(--neon-purple)" }} />
        اطلب هذا المنتج
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="الاسم الكامل" className="shop-input" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="رقم الهاتف" className="shop-input text-right" dir="ltr" />
        <select name="province" value={form.province} onChange={handleChange} className="shop-input">
          {WILAYAS.map((wilaya) => (
            <option key={wilaya} value={wilaya}>{wilaya}</option>
          ))}
        </select>
        <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} className="shop-input" />
      </div>
      <input name="address" value={form.address} onChange={handleChange} required placeholder="العنوان الكامل" className="shop-input mt-3" />
      {error && (
        <p
          className="mt-3 rounded-xl px-3 py-2 text-xs font-bold"
          style={{ background: "rgba(255,45,120,0.1)", border: "1px solid rgba(255,45,120,0.3)", color: "#ff2d78" }}
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || product.current_quantity <= 0}
        className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white transition-all hover:scale-[1.01] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: loading ? "none" : "0 0 24px rgba(124,58,237,0.5)" }}
      >
        {loading ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> جاري الإرسال...</> : "تأكيد الطلب"}
      </button>
    </form>
  );
}
