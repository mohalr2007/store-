import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock3, Headphones, ShieldCheck, Truck, Zap, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { listPublicProductsAction } from "@/app/actions/storefront";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function HomePage() {
  const result = await listPublicProductsAction(8);
  const products = result.products;
  const featured = products[0];

  return (
    <>
      <Header />
      <main className="neon-grid-bg">
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 lg:min-h-[680px] lg:py-20 lg:flex lg:items-center">
          <div
            className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full opacity-14 blur-[100px] sm:h-[500px] sm:w-[500px]"
            style={{ background: "radial-gradient(circle, rgba(69,212,232,0.85), transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 rounded-full opacity-8 blur-[80px] sm:h-96 sm:w-96"
            style={{ background: "radial-gradient(circle, rgba(69,212,232,0.75), transparent 70%)" }}
          />

          <div className="shop-container relative z-10 flex flex-col items-center gap-10 lg:flex-row-reverse lg:justify-between lg:gap-0">
            <div className="flex w-full justify-center lg:w-[48%] lg:justify-start">
              <div
                className="relative flex h-[240px] w-[240px] items-center justify-center sm:h-[320px] sm:w-[320px] lg:h-[460px] lg:w-[460px]"
                style={{
                  filter: "drop-shadow(0 0 40px rgba(69,212,232,0.14)) drop-shadow(0 0 80px rgba(69,212,232,0.08))",
                }}
              >
                <img src="/logo.jpg" alt="AL CARTEL SHOP DZ" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="w-full max-w-2xl text-right">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] sm:mb-6 sm:py-2 sm:text-[11px]"
                style={{
                  background: "rgba(69,212,232,0.12)",
                  border: "1px solid rgba(69,212,232,0.35)",
                  color: "var(--neon-blue)",
                }}
              >
                <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                AL CARTEL SHOP DZ
              </div>

              <h1 className="text-[2.5rem] font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block" style={{ color: "var(--fg)" }}>أفضل</span>
                <span className="block gradient-text-brand">ستايل حضري</span>
                <span className="block" style={{ color: "var(--fg)" }}>في الجزائر.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-[13px] leading-6 sm:mx-0 sm:mt-5 sm:text-base sm:leading-7 lg:mx-0" style={{ color: "var(--fg-muted)" }}>
                تشكيلات أنيقة وفاخرة مع الدفع عند الاستلام، وخدمة توصيل تغطي كامل الولايات.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 xs:flex-row justify-end">
                <Link href="/products" className="btn-primary w-full xs:w-auto">
                  تصفح الكتالوج
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
                <Link href="/checkout" className="btn-outline w-full xs:w-auto">
                  ابدأ الطلب الآن
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-2">
                {["توصيل 24-72 ساعة", "الدفع عند الاستلام", "تغطية كاملة للجزائر"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--fg-muted)",
                    }}
                  >
                    <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shop-container grid gap-3 pb-4 sm:grid-cols-3">
          {[
            { icon: Truck, title: "توصيل سريع", text: "24-72 ساعة حسب الولاية", color: "var(--neon-blue)" },
            { icon: ShieldCheck, title: "الدفع عند الاستلام", text: "ادفع عند الاستلام فقط", color: "var(--neon-blue)" },
            { icon: Headphones, title: "دعم مباشر", text: "تأكيد الطلب قبل الشحن", color: "var(--neon-gold)" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card rounded-2xl p-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <p className="mt-4 text-sm font-black" style={{ color: "var(--fg)" }}>{item.title}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--fg-muted)" }}>{item.text}</p>
              </div>
            );
          })}
        </section>

        {featured && (
          <section className="shop-container py-12 sm:py-16">
            <div className="card-glow relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <div
                className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full blur-[80px] opacity-50"
                style={{ background: "radial-gradient(circle, rgba(69,212,232,0.22), transparent)" }}
              />

              <div className="grid lg:grid-cols-[1fr_1.1fr]">
                <div
                  className="relative min-h-[280px] overflow-hidden sm:min-h-[360px]"
                  style={{ background: "rgba(69,212,232,0.035)" }}
                >
                  {getProductImage(featured) ? (
                    <img src={getProductImage(featured)!} alt={featured.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-7xl font-black gradient-text-brand opacity-20">AC</span>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none lg:block hidden" style={{ background: "linear-gradient(to right, transparent 60%, var(--bg-card))" }} />
                  <div className="absolute inset-0 pointer-events-none lg:hidden" style={{ background: "linear-gradient(to top, var(--bg-card) 10%, transparent 60%)" }} />
                </div>

                <div className="relative z-10 p-6 sm:p-10 lg:p-12">
                  <span
                    className="badge"
                    style={{
                      background: "rgba(251,191,36,0.12)",
                      border: "1px solid rgba(251,191,36,0.35)",
                      color: "var(--neon-gold)",
                    }}
                  >
                    ⭐ منتج مميز
                  </span>

                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--fg)" }}>
                    {featured.name}
                  </h2>

                  <p className="mt-4 text-sm leading-7" style={{ color: "var(--fg-muted)" }}>
                    تشكيلة حصرية متوفرة مع الدفع عند الاستلام. أكمل طلبك خلال ثوانٍ.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <p className="text-4xl font-black gradient-text-gold sm:text-5xl">
                      {formatCurrency(featured.selling_price)}
                    </p>
                    {featured.current_quantity > 0 ? (
                      <span className="badge" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--neon-green)", fontSize: "0.7rem", padding: "0.4rem 0.9rem" }}>
                        متوفر
                      </span>
                    ) : (
                      <span className="badge" style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", color: "var(--neon-red)", fontSize: "0.7rem", padding: "0.4rem 0.9rem" }}>
                        نفد
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${featured.id}`} className="btn-primary mt-8 w-full sm:w-auto">
                    عرض المنتج
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="shop-container pb-12 sm:pb-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--neon-blue)" }}>
                المجموعة المختارة
              </p>
              <h2 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--fg)" }}>
                منتجات <span className="gradient-text-brand">مميزة</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-black transition-all hover:scale-105 sm:self-auto"
              style={{
                background: "rgba(69,212,232,0.1)",
                border: "1px solid var(--border-strong)",
                color: "var(--neon-blue)",
              }}
            >
              مشاهدة الكل
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="divider-neon mb-8" />

          {products.length === 0 ? (
            <div
              className="rounded-3xl p-14 text-center text-sm"
              style={{
                background: "var(--bg-card)",
                border: "1px dashed var(--border-strong)",
                color: "var(--fg-muted)",
              }}
            >
              لا توجد منتجات متاحة حاليا.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="shop-container pb-14 sm:pb-20">
          <div
            className="relative overflow-hidden rounded-2xl p-7 sm:rounded-3xl sm:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(69,212,232,0.08), rgba(69,212,232,0.03))",
              border: "1px solid var(--border-strong)",
            }}
          >
            <div className="divider-neon mb-8" />
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              {[
                { icon: Clock3, value: "24-72 ساعة", label: "مدة التوصيل", color: "var(--neon-blue)" },
                { icon: BadgeCheck, value: "COD", label: "الدفع عند الاستلام", color: "var(--neon-blue)" },
                { icon: ShieldCheck, value: "الجزائر", label: "تغطية وطنية", color: "var(--neon-gold)" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <Icon className="h-7 w-7" style={{ color: item.color }} />
                    <p className="text-3xl font-black" style={{ color: "var(--fg)" }}>{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--fg-muted)" }}>
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
