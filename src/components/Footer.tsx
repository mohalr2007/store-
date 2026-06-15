export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-[var(--ink)] text-white">
      <div className="shop-container py-10">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="text-xl font-black tracking-tight">COD Store</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              Boutique cash-on-delivery pensee pour commander vite, recevoir clairement,
              et payer uniquement a la livraison.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Service
            </p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>Paiement a la livraison</p>
              <p>Livraison 24-72h</p>
              <p>Confirmation par telephone</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Confiance
            </p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>Produits verifies</p>
              <p>Stock suivi en direct</p>
              <p>Support WhatsApp</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row">
          <p>© 2026 COD Store. Tous droits reserves.</p>
          <p>Made for high-trust COD shopping in Algeria.</p>
        </div>
      </div>
    </footer>
  );
}
