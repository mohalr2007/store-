export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
      aria-label="Chargement du store"
      role="status"
      style={{
        background: "rgba(5,14,16,0.85)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo with spinning ring around it — logo stays still */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {/* Spinning cyan ring */}
          <svg
            className="absolute inset-0 h-full w-full animate-spin"
            style={{ animationDuration: "2.2s" }}
            viewBox="0 0 128 128"
            fill="none"
          >
            <circle
              cx="64" cy="64" r="60"
              stroke="rgba(69,212,232,0.2)"
              strokeWidth="3"
            />
            <path
              d="M64 4 A60 60 0 0 1 124 64"
              stroke="#45d4e8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* White logo frame */}
          <div
            className="relative flex h-24 w-24 items-center justify-center overflow-hidden"
            style={{
              borderRadius: "20px",
              background: "#ffffff",
              border: "2px solid rgba(69,212,232,0.5)",
              boxShadow: "0 0 30px rgba(69,212,232,0.3), 0 4px 16px rgba(0,0,0,0.2)",
              padding: "6px",
            }}
          >
            <img
              src="/logo.jpg"
              alt="AL CARTEL SHOP DZ"
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px" }}
            />
          </div>
        </div>

        {/* Brand name */}
        <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: "var(--neon-blue)" }}>
          AL CARTEL SHOP DZ
        </p>

        {/* Loading dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full animate-bounce"
              style={{
                background: "#45d4e8",
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
