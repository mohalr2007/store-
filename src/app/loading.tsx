export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
      aria-label="Chargement du store"
      role="status"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[rgba(69,212,232,0.22)] bg-[rgba(255,255,255,0.22)] shadow-[0_0_40px_rgba(69,212,232,0.18)]">
          <div className="absolute inset-0 rounded-full border border-[rgba(69,212,232,0.3)] animate-pulse" />
          <img
            src="/logo.jpg"
            alt="AL CARTEL SHOP DZ"
            className="h-20 w-20 object-contain animate-spin"
            style={{ animationDuration: "1.8s" }}
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--neon-blue)]">
          AL CARTEL SHOP DZ
        </p>
      </div>
    </div>
  );
}
