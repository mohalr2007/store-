import Link from "next/link";
import { ArrowRight, Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="divider-neon" />

      <div className="shop-container py-10 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
                <img src="/logo.jpg" alt="Al Cartel Shop" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-base font-black" style={{ color: "var(--fg)" }}>AL CARTEL</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--neon-purple)" }}>
                  SHOP DZ
                </p>
              </div>
            </div>

            <p className="max-w-xs text-sm leading-6" style={{ color: "var(--fg-muted)" }}>
              أفضل بوتيك في الجزائر. تشكيلات حصرية مع خدمة الدفع عند الاستلام (COD) في جميع الولايات.
            </p>

            <div className="mt-5 flex gap-3">
              {[
                { icon: Instagram, color: "var(--neon-purple)", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.3)" },
                { icon: Phone, color: "var(--neon-blue)", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.25)" },
                { icon: Mail, color: "var(--neon-gold)", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-110"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Service */}
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--neon-purple)" }}>
              خدمات
            </p>
            <div className="space-y-3">
              {[
                { href: "/products", label: "كتالوج المنتجات" },
                { href: "/checkout", label: "الطلب والدفع عند الاستلام" },
                { href: "/cart", label: "سلة المشتريات" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--fg)]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 rotate-180" style={{ color: "var(--neon-purple)" }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--neon-blue)" }}>
              معلومات
            </p>
            <div className="space-y-2.5 text-sm" style={{ color: "var(--fg-muted)" }}>
              <p>🚚 توصيل خلال 24-72 ساعة</p>
              <p>💳 الدفع عند الاستلام</p>
              <p>📞 تأكيد الطلب عبر الهاتف</p>
              <p>✅ منتجات أصلية ومضمونة</p>
              <p>📍 توصيل لجميع ولايات الجزائر</p>
            </div>
          </div>
        </div>

        <div className="divider-neon mb-5 mt-10" />

        <div className="flex flex-col justify-between gap-3 text-xs sm:flex-row" style={{ color: "var(--fg-subtle)" }}>
          <p>© 2026 AL CARTEL SHOP DZ. جميع الحقوق محفوظة.</p>
          <p>صُنع بكل ❤️ للجزائر — خدمة الدفع عند الاستلام فقط.</p>
        </div>
      </div>
    </footer>
  );
}
