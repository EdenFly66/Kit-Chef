export function ImagenPlaceholder({
  aspect = "aspect-video",
  acento,
}: {
  aspect?: string;
  acento?: string;
}) {
  const color = acento ?? "var(--color-acero)";

  return (
    <div
      className={`flex ${aspect} w-full flex-col items-center justify-center gap-2 border border-borde`}
      style={{
        color,
        backgroundImage: `repeating-linear-gradient(135deg, color-mix(in srgb, ${color} 22%, var(--color-superficie-2)) 0 2px, color-mix(in srgb, ${color} 6%, var(--color-superficie)) 2px 14px)`,
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <ellipse cx="24" cy="34" rx="16" ry="4" />
        <path d="M8 34c0-9 7-16 16-16s16 7 16 16" />
        <circle cx="24" cy="16" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="rotate-[-3deg] border border-dashed border-current px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide">
        en camino
      </span>
    </div>
  );
}
