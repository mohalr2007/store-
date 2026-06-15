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
      <main className="shop-container py-14">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-black/8 bg-white p-8 text-center shop-shadow sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--sage)]">
            <CheckCircle className="h-10 w-10 text-[var(--primary)]" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
            Commande recue
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Merci pour votre commande.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
            Notre equipe vous contactera pour confirmer les details avant l'expedition.
          </p>

          {orderNumber && (
            <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-3">
              <Package className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-black">{orderNumber}</span>
            </div>
          )}

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {[
              { icon: Truck, title: "Livraison", text: "24-72h selon wilaya" },
              { icon: CreditCard, title: "Paiement", text: "A la reception" },
              { icon: Phone, title: "Confirmation", text: "Appel avant envoi" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-4">
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                  <p className="mt-3 text-sm font-black">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{item.text}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--ink)] px-7 text-sm font-black text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a l'accueil
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
