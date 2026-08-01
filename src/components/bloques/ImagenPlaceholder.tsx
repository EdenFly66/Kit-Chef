export function ImagenPlaceholder({ aspect = "aspect-video" }: { aspect?: string }) {
  return (
    <div
      className={`flex ${aspect} w-full flex-col items-center justify-center gap-2 border border-borde text-acero`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-superficie-2) 0 2px, var(--color-superficie) 2px 14px)",
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
      <span className="rotate-[-3deg] border border-dashed border-acero px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-acero">
        en camino
      </span>
    </div>
  );
}
