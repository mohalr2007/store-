"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Hash, MapPin, PhoneCall, Truck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product, ProductVariant } from "@/lib/types";
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

type Props = {
  product: Product;
  selectedVariant?: ProductVariant | null;
  selectedVariantLabel?: string;
  effectiveStock?: number;
};

export function DirectOrderForm({
  product,
  selectedVariant,
  selectedVariantLabel,
  effectiveStock,
}: Props) {
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
        if (res.rates.length > 0 && !res.rates.find((r) => r.province === form.province)) {
          setForm((prev) => ({ ...prev, province: res.rates[0].province }));
        }
      }
      setRatesLoading(false);
    };

    fetchRates();
  }, []);

  const currentRate = rates.find((r) => r.province === form.province);
  const shippingCost = currentRate
    ? (form.delivery_mode === "home" ? currentRate.home_price : currentRate.desk_price)
    : 0;
  const productPrice = Number(product.selling_price || 0);
  const subtotal = productPrice * form.quantity;
  const finalTotal = subtotal + shippingCost;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.name === "quantity" ? Number(event.target.value) : event.target.value;
    setForm((previous) => ({ ...previous, [event.target.name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Veuillez remplir le nom, le téléphone et l'adresse.");
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
          notes: `Commande directe store: ${product.name}${selectedVariantLabel ? `\n${selectedVariantLabel}` : ""}`,
          delivery_mode: form.delivery_mode,
        },
        [{ product, quantity, variant: selectedVariant || undefined }],
        shippingCost
      );

      if (!result.success) throw new Error(result.error);

      router.push(`/order-confirmation?order=${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Impossible de confirmer la commande.");
    } finally {
      setLoading(false);
    }
  };

  const hasStock = (effectiveStock ?? product.current_quantity) > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 w-full rounded-[1.75rem] border border-[rgba(69,212,232,0.18)] bg-[var(--bg-card)] p-6 shadow-sm sm:p-7 lg:p-8"
      style={{
        boxShadow: "var(--shadow)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,251,252,0.96))",
      }}
    >
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(69,212,232,0.24)] bg-[rgba(69,212,232,0.09)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg)]">
          <PhoneCall className="h-3.5 w-3.5" style={{ color: "var(--neon-blue)" }} />
          طلب سريع
        </div>
        <h2 className="mt-3 text-xl font-black leading-tight text-[var(--fg)] sm:text-2xl">
          اطلب هذا المنتج
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-7 text-[var(--fg-muted)] sm:text-[15px]">
          املأ المعلومات التالية وسنؤكد الطلب بسرعة قبل الشحن.
        </p>
      </div>

      <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
        <Field label="الاسم الكامل" icon={User}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="اكتب الاسم الكامل"
            className="shop-input h-14 text-[15px] font-medium text-right placeholder:text-[var(--fg-subtle)]"
          />
        </Field>

        <Field label="رقم الهاتف" icon={PhoneCall}>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="05xx xx xx xx"
            className="shop-input h-14 text-[15px] font-medium text-right placeholder:text-[var(--fg-subtle)]"
            dir="ltr"
          />
        </Field>

        <Field label="الولاية" icon={MapPin}>
          <select
            name="province"
            value={form.province}
            onChange={handleChange}
            className="shop-input h-14 text-[15px] font-medium text-right"
            disabled={ratesLoading}
          >
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
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))
            )}
          </select>
        </Field>

        <Field label="الكمية" icon={Hash}>
          <input
            name="quantity"
            type="number"
            min={1}
            value={form.quantity}
            onChange={handleChange}
            className="shop-input h-14 text-[15px] font-bold text-center"
          />
        </Field>
      </div>

      <Field label="العنوان الكامل" icon={MapPin} className="mt-3">
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="الشارع، رقم المنزل، الحي..."
          className="shop-input h-14 text-[15px] font-medium text-right placeholder:text-[var(--fg-subtle)]"
        />
      </Field>

      <div className="mt-5 rounded-[1.35rem] border border-dashed border-[rgba(69,212,232,0.25)] bg-[rgba(69,212,232,0.035)] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-black uppercase tracking-[0.14em] text-[var(--fg)]">
            طريقة التوصيل
          </span>
          <Truck className="h-4 w-4" style={{ color: "var(--neon-blue)" }} />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2" dir="rtl">
          <DeliveryOption
            name="delivery_mode"
            value="home"
            checked={form.delivery_mode === "home"}
            onChange={handleChange}
            title="توصيل للمنزل"
            price={currentRate ? currentRate.home_price : 0}
          />

          <DeliveryOption
            name="delivery_mode"
            value="desk"
            checked={form.delivery_mode === "desk"}
            onChange={handleChange}
            title="استلام من المكتب"
            price={currentRate ? currentRate.desk_price : 0}
          />
        </div>
      </div>

      <div className="mt-5 rounded-[1.35rem] border border-[rgba(69,212,232,0.16)] bg-[rgba(255,255,255,0.72)] p-4 sm:p-5">
        <div className="space-y-2.5 text-sm">
          <Row label={`سعر المنتج (${form.quantity})`} value={`${subtotal} د.ج`} />
          <Row
            label={`سعر الشحن (${form.delivery_mode === "home" ? "المنزل" : "المكتب"})`}
            value={shippingCost > 0 ? `${shippingCost} د.ج` : "مجاني"}
          />
        </div>

        <div className="mt-3 border-t border-[rgba(69,212,232,0.16)] pt-3">
          <Row
            label="المجموع الإجمالي"
            value={`${finalTotal} د.ج`}
            strong
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-right text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !hasStock}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[1.25rem] text-base font-black text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, var(--brand-dark), var(--brand))",
          boxShadow: loading ? "none" : "0 0 18px rgba(69,212,232,0.12)",
        }}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            جاري الإرسال...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            تأكيد الطلب
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2.5 flex items-center justify-between text-[12px] font-black tracking-[0.08em] text-[var(--fg)]">
        <span>{label}</span>
        {Icon ? <Icon className="h-3.5 w-3.5" style={{ color: "var(--neon-blue)" }} /> : null}
      </span>
      <div>{children}</div>
    </label>
  );
}

function DeliveryOption({
  name,
  value,
  checked,
  onChange,
  title,
  price,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  title: string;
  price: number;
}) {
  return (
    <label
      className="flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-all"
      style={{
        borderColor: checked ? "rgba(69,212,232,0.42)" : "var(--border)",
        background: checked ? "rgba(69,212,232,0.08)" : "var(--bg-card)",
        boxShadow: checked ? "0 0 0 1px rgba(69,212,232,0.08)" : "none",
      }}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-[var(--brand)]"
        />
        <span className="text-sm font-bold text-[var(--fg)]">{title}</span>
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: "var(--neon-blue)" }}>
        {price > 0 ? `+${price} د.ج` : "مجاني"}
      </span>
    </label>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`text-right ${strong ? "text-sm font-black text-[var(--fg)]" : "text-sm text-[var(--fg-muted)]"}`}>
        {label}
      </span>
      <span className={strong ? "text-base font-black text-[var(--fg)]" : "text-sm font-semibold text-[var(--fg)]"}>
        {value}
      </span>
    </div>
  );
}
