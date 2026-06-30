import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Mail, MessageCircle, Music2 } from "lucide-react";

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/workaccount_of_cartel?igsh=MTg2ODN5OGQ1eDliaA==",
    label: "Instagram",
    color: "var(--neon-blue)",
    bg: "rgba(69,212,232,0.1)",
    border: "rgba(69,212,232,0.3)",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1H7hg28SMb/",
    label: "Facebook",
    color: "var(--neon-blue)",
    bg: "rgba(69,212,232,0.1)",
    border: "rgba(69,212,232,0.3)",
  },
  {
    icon: Music2,
    href: "https://www.tiktok.com/@al_cartel_shop_dz",
    label: "TikTok",
    color: "var(--neon-blue)",
    bg: "rgba(69,212,232,0.1)",
    border: "rgba(69,212,232,0.3)",
  },
  {
    icon: MessageCircle,
    href: "https://wa.me/213797823273",
    label: "WhatsApp",
    color: "var(--neon-green)",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.28)",
  },
  {
    icon: Mail,
    href: "mailto:alcatelshopdz@gmail.com",
    label: "Email",
    color: "var(--neon-gold)",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="divider-neon" />

      <div className="shop-container py-10 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
                <img src="/logo.jpg" alt="Al Cartel Shop" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-base font-black" style={{ color: "var(--fg)" }}>AL CARTEL</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--neon-blue)" }}>
                  SHOP DZ
                </p>
              </div>
            </div>

            <p className="max-w-xs text-sm leading-6" style={{ color: "var(--fg-muted)" }}>
              أفضل بوتيك في الجزائر. تشكيلات حصرية مع خدمة الدفع عند الاستلام في جميع الولايات.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-110"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--neon-blue)" }}>
              الخدمات
            </p>
            <div className="space-y-3">
              {[
                { href: "/products", label: "كتالوج المنتجات" },
                { href: "/checkout", label: "إتمام الطلب" },
                { href: "/cart", label: "سلة المشتريات" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--fg)]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 rotate-180" style={{ color: "var(--neon-blue)" }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

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
