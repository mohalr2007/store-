"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PhoneCall } from "lucide-react";
import type { Product } from "@/lib/types";
import { submitStoreOrderAction, getStoreShippingRatesAction } from "@/app/actions/storefront";

interface ShippingRate {
  province: string;
  home_price: number;
  desk_price: number;
  is_active: boolean;
}

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra",
  "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda",
  "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem",
  "M'sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj",
  "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent",
  "Ghardaia", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal",
  "Beni Abbes", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair",
  "El Meniaa"
];

export function DirectOrderForm({ product, selectedVariant }: { product: Product; selectedVariant?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "Alger",
    address: "",
    quantity: 1,
    delivery_mode: "home",
  });

  useEffect(() => {
    const fetchRates = async () => {
      const res = await getStoreShippingRatesAction();
      if (res.success && res.rates) {
        setRates(res.rates);
        // Preselect the first active wilaya from database if form.province is not found
        if (res.rates.length > 0 && !res.rates.find((r) => r.province === form.province)) {
          setForm((prev) => ({ ...prev, province: res.rates[0].province }));
        }
      }
      setRatesLoading(false);
    };
    fetchRates();
  }, []);

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
          delivery_mode: form.delivery_mode,
        },
        [{ product, quantity }],
        shippingCost
      );

      if (!result.success) throw new Error(result.error);

      router.push(`/order-confirmation?order=${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "تعذر تأكيد الطلب.");
    } finally {
      setLoading(false);
    }
  };

  const currentRate = rates.find((r) => r.province === form.province);
  const shippingCost = currentRate
    ? (form.delivery_mode === "home" ? currentRate.home_price : currentRate.desk_price)
    : 0;

  const productPrice = Number(product.selling_price || 0);
  const subtotal = productPrice * form.quantity;
  const finalTotal = subtotal + shippingCost;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl p-5"
      style={{ background: "rgba(69,212,232,0.06)", border: "1px solid var(--border-strong)" }}
    >
      <p className="flex items-center gap-2 text-sm font-black" style={{ color: "var(--fg)" }}>
        <PhoneCall className="h-4 w-4" style={{ color: "var(--neon-blue)" }} />
        اطلب هذا ...
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="الاسم الكامل" className="shop-input text-right" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="رقم الهاتف" className="shop-input text-right" dir="ltr" />
        
        <select name="province" value={form.province} onChange={handleChange} className="shop-input" disabled={ratesLoading}>
          {ratesLoading ? (
            <option>جاري التحميل...</option>
          ) : rates.length > 0 ? (
            rates.map((rate) => (
              <option key={rate.province} value={rate.province}>
                {rate.province}
              </option>
            ))
          ) : (
            WILAYAS.map((wilaya) => (
              <option key={wilaya} value={wilaya}>{wilaya}</option>
            ))
          )}
        </select>
        
        <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} className="shop-input text-center" />
      </div>
      <input name="address" value={form.address} onChange={handleChange} required placeholder="العنوان الكامل" className="shop-input mt-3 text-right" />

      {/* Mode de livraison */}
      <div className="mt-4 border-t border-dashed border-cyan-200/50 pt-4">
        <span className="text-xs font-bold text-gray-500 block mb-2 text-right">طريقة التوصيل:</span>
        <div className="grid gap-2 grid-cols-2" dir="rtl">
          <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all text-xs font-bold ${form.delivery_mode === "home" ? "border-cyan-600 bg-cyan-50/50" : "border-gray-200 hover:bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery_mode"
                value="home"
                checked={form.delivery_mode === "home"}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-cyan-600 focus:ring-cyan-500"
              />
              <span>توصيل للمنزل</span>
            </div>
            {currentRate && <span className="text-[10px] text-cyan-600">{currentRate.home_price > 0 ? `+${currentRate.home_price} د.ج` : "مجاني"}</span>}
          </label>
          
          <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all text-xs font-bold ${form.delivery_mode === "desk" ? "border-cyan-600 bg-cyan-50/50" : "border-gray-200 hover:bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery_mode"
                value="desk"
                checked={form.delivery_mode === "desk"}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-cyan-600 focus:ring-cyan-500"
              />
              <span>استلام من المكتب</span>
            </div>
            {currentRate && <span className="text-[10px] text-cyan-600">{currentRate.desk_price > 0 ? `+${currentRate.desk_price} د.ج` : "مجاني"}</span>}
          </label>
        </div>
      </div>

      {/* Recapitulatif prix */}
      <div className="mt-4 rounded-xl bg-cyan-50/30 p-3 border border-cyan-100 text-xs space-y-1.5 text-right" dir="rtl">
        <div className="flex justify-between text-gray-500">
          <span>سعر المنتج ({form.quantity}):</span>
          <span className="font-semibold">{subtotal} د.ج</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>سعر الشحن ({form.delivery_mode === "home" ? "المنزل" : "المكتب"}):</span>
          <span className="font-semibold">{shippingCost > 0 ? `${shippingCost} د.ج` : "مجاني"}</span>
        </div>
        <div className="flex justify-between text-sm font-black border-t border-cyan-100 pt-1.5 text-cyan-900">
          <span>المجموع الإجمالي:</span>
          <span>{finalTotal} د.ج</span>
        </div>
      </div>

      {error && (
        <p
          className="mt-3 rounded-xl px-3 py-2 text-xs font-bold text-right"
          style={{ background: "rgba(255,45,120,0.1)", border: "1px solid rgba(255,45,120,0.3)", color: "#ff2d78" }}
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || product.current_quantity <= 0}
        className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white transition-all hover:scale-[1.01] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand))", boxShadow: loading ? "none" : "0 0 24px var(--brand-glow)" }}
      >
        {loading ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> جاري الإرسال...</> : "تأكيد الطلب"}
      </button>
    </form>
  );
}
