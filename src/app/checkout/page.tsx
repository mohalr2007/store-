"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Loader2, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCartItemKey, useCart } from "@/components/CartProvider";
import { formatCurrency, getProductImage } from "@/lib/utils";
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
  "M'sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "Alger",
    city: "",
    address: "",
    notes: "",
    delivery_mode: "home",
  });

  useEffect(() => {
    const fetchRates = async () => {
      const res = await getStoreShippingRatesAction();
      if (res.success && res.rates) {
        setRates(res.rates);
        if (res.rates.length > 0 && !res.rates.find(r => r.province === form.province)) {
          setForm(prev => ({ ...prev, province: res.rates[0].province }));
        }
      }
      setRatesLoading(false);
    };
    fetchRates();
  }, []);

  const currentRate = rates.find(r => r.province === form.province);
  const shippingCost = currentRate
    ? (form.delivery_mode === "home" ? currentRate.home_price : currentRate.desk_price)
    : 0;
  const finalTotal = total + shippingCost;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("سلتك فارغة");
      return;
    }
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("يرجى ملء الحقول الإلزامية.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const outOfStockItems = items.filter((item) => {
        const availableQuantity = item.variant?.quantity ?? item.product.current_quantity;
        return availableQuantity < item.quantity;
      });
      if (outOfStockItems.length > 0) {
        toast.error(`المخزون غير كافٍ لـ: ${outOfStockItems.map(i => i.product.name).join(", ")}`);
        setLoading(false);
        return;
      }

      const result = await submitStoreOrderAction({
        fullName: form.fullName,
        phone: form.phone,
        province: form.province,
        city: form.city,
        address: form.address,
        notes: form.notes,
        delivery_mode: form.delivery_mode,
      }, items.map((item) => ({ product: item.product, quantity: item.quantity, variant: item.variant })), shippingCost);

      if (!result.success) {
        throw new Error(result.error);
      }

      clearCart();
      toast.success("تم تأكيد الطلب بنجاح!");
      router.push(`/order-confirmation?order=${result.orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ.");
      setError(err.message || "حدث خطأ.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="neon-grid-bg min-h-[50vh]">
          <div className="shop-container flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-14 w-14 text-[var(--muted-foreground)]/30" />
            <p className="mt-4 text-xl font-black">سلتك فارغة</p>
            <Link href="/products" className="btn-primary mt-6 h-12 px-7">
              العودة إلى الكتالوج
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="neon-grid-bg min-h-screen py-10">
        <div className="shop-container">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
              إتمام الطلب COD
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              تأكيد طلبك
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
              املأ بياناتك. سنتصل بك لتأكيد الطلب قبل الشحن.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_390px]">
            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glow rounded-[2rem] p-5 sm:p-7">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الاسم الكامل *">
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="محمد لعربي"
                    className="shop-input"
                  />
                </Field>
                <Field label="رقم الهاتف *">
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
                <Field label="الولاية *">
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
                        <option key={wilaya} value={wilaya}>
                          {wilaya}
                        </option>
                      ))
                    )}
                  </select>
                </Field>
                <Field label="المدينة / البلدية">
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="البلدية"
                    className="shop-input"
                  />
                </Field>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  طريقة التوصيل *
                </span>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${form.delivery_mode === "home" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:bg-[rgba(69,212,232,0.08)]"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery_mode"
                        value="home"
                        checked={form.delivery_mode === "home"}
                        onChange={handleChange}
                        className="h-4 w-4 text-[var(--primary)]"
                      />
                      <span className="text-sm font-bold">إلى المنزل</span>
                    </div>
                    {currentRate && <span className="text-sm font-black text-[var(--primary)]">{currentRate.home_price > 0 ? `+${currentRate.home_price} د.ج` : "مجاني"}</span>}
                  </label>

                  <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${form.delivery_mode === "desk" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:bg-[rgba(69,212,232,0.08)]"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery_mode"
                        value="desk"
                        checked={form.delivery_mode === "desk"}
                        onChange={handleChange}
                        className="h-4 w-4 text-[var(--primary)]"
                      />
                      <span className="text-sm font-bold">استلام من المكتب</span>
                    </div>
                    {currentRate && <span className="text-sm font-black text-[var(--primary)]">{currentRate.desk_price > 0 ? `+${currentRate.desk_price} د.ج` : "مجاني"}</span>}
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Field label="العنوان الكامل *">
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="الشارع، الرقم، الحي، علامة مميزة..."
                    className="shop-input resize-none"
                  />
                </Field>
                <Field label="ملاحظات الطلب">
                  <input
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="تعليمات إضافية"
                    className="shop-input"
                  />
                </Field>
              </div>
            </motion.section>

            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card-glow h-fit rounded-[2rem] p-5 lg:sticky lg:top-32">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
                طلبك
              </p>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <CheckoutLine key={getCartItemKey(item)} item={item} />
                ))}
              </div>

              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">المجموع الفرعي</span>
                  <span className="font-black">{formatCurrency(total)}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">التوصيل ({form.delivery_mode === "home" ? "إلى المنزل" : "استلام من المكتب"})</span>
                  <span className="font-black">{shippingCost > 0 ? formatCurrency(shippingCost) : "مجاني"}</span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <span className="text-sm font-bold text-[var(--muted-foreground)]">المبلغ الإجمالي</span>
                  <span className="text-2xl font-black text-[var(--primary)]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-6 h-12 w-full shadow-xl disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التأكيد...
                  </>
                ) : (
                  "تأكيد الطلب"
                )}
              </button>

              <div className="mt-5 grid gap-2 text-xs text-[var(--muted-foreground)]">
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[var(--primary)]" />
                  الدفع عند الاستلام فقط.
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[var(--primary)]" />
                  الشحن محسوب حسب الولاية.
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                  بياناتك تبقى خاصة.
                </p>
              </div>
            </motion.aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CheckoutLine({ item }: { item: ReturnType<typeof useCart>["items"][number] }) {
  const image = getProductImage(item.product);

  return (
    <div className="flex gap-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--bg-card-2)]">
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
        {item.variant?.value && (
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {item.variant.attribute}: {item.variant.value}
          </p>
        )}
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">الكمية {item.quantity}</p>
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
