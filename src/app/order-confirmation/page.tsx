"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, CreditCard, Package, Phone, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <>
      <Header />
      <main className="neon-grid-bg min-h-screen py-14">
        <section className="card-glow mx-auto max-w-2xl rounded-[2rem] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(69,212,232,0.12)]">
            <CheckCircle className="h-10 w-10 text-[var(--primary)]" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
            تم استلام الطلب
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            شكرا لك على طلبك
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
            سيتواصل معك فريقنا لتأكيد التفاصيل قبل الشحن.
          </p>

          {orderNumber && (
            <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-3">
              <Package className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-black">{orderNumber}</span>
            </div>
          )}

          <div className="mt-8 grid gap-3 text-right sm:grid-cols-3">
            {[
              { icon: Truck, title: "التوصيل", text: "24-72 ساعة حسب الولاية" },
              { icon: CreditCard, title: "الدفع", text: "عند الاستلام" },
              { icon: Phone, title: "التأكيد", text: "اتصال قبل الإرسال" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card-2)] p-4">
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                  <p className="mt-3 text-sm font-black">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{item.text}</p>
                </div>
              );
            })}
          </div>

          <Link href="/" className="btn-primary mt-8 h-12 px-7">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            العودة إلى الرئيسية
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">جاري التحميل...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
