export function TipBlock({
  titulo,
  texto,
  acento,
}: {
  titulo: string;
  texto: string;
  acento?: string;
}) {
  return (
    <div
      className="rotate-[-0.6deg] border border-borde bg-superficie p-5"
      style={{
        clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
        backgroundImage: "radial-gradient(var(--color-grano) 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      }}
    >
      <p
        className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wide"
        style={{ color: acento ?? "var(--color-brasa)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 2 2 2 4a5 5 0 0 1-10 0c0-5 4-6 5-12z" />
        </svg>
        {titulo}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-dim">{texto}</p>
    </div>
  );
}
