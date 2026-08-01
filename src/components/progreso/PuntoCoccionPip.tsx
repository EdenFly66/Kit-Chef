const COLOR_POR_ETAPA: Record<string, string> = {
  crudo: "var(--color-crudo)",
  "a punto": "var(--color-apunto)",
  dorado: "var(--color-dorado)",
  dominado: "var(--color-dominado)",
};

function etiquetaDe(progreso: number) {
  if (progreso < 25) return "crudo";
  if (progreso < 50) return "a punto";
  if (progreso < 75) return "dorado";
  return "dominado";
}

export function PuntoCoccionPip({ progreso }: { progreso: number }) {
  const etapa = etiquetaDe(progreso);
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full border border-borde"
      style={{ background: COLOR_POR_ETAPA[etapa] }}
      title={etapa}
      aria-label={`Estado: ${etapa}`}
    />
  );
}
