function etiquetaDe(progreso: number) {
  if (progreso < 25) return "crudo";
  if (progreso < 50) return "a punto";
  if (progreso < 75) return "dorado";
  return "dominado";
}

function colorDeEtapa(etapa: string, acento?: string): string {
  if (!acento) {
    const COLOR_POR_ETAPA: Record<string, string> = {
      crudo: "var(--color-crudo)",
      "a punto": "var(--color-apunto)",
      dorado: "var(--color-dorado)",
      dominado: "var(--color-dominado)",
    };
    return COLOR_POR_ETAPA[etapa];
  }
  switch (etapa) {
    case "crudo":
      return `color-mix(in srgb, ${acento} 25%, white)`;
    case "a punto":
      return `color-mix(in srgb, ${acento} 55%, white)`;
    case "dorado":
      return acento;
    default:
      return `color-mix(in srgb, ${acento} 65%, black)`;
  }
}

export function PuntoCoccionPip({
  progreso,
  acento,
}: {
  progreso: number;
  acento?: string;
}) {
  const etapa = etiquetaDe(progreso);
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full border border-borde"
      style={{ background: colorDeEtapa(etapa, acento) }}
      title={etapa}
      aria-label={`Estado: ${etapa}`}
    />
  );
}
