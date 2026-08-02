import styles from "./PuntoCoccionDial.module.css";

const ETAPAS = [
  { hasta: 25, etiqueta: "crudo" },
  { hasta: 50, etiqueta: "a punto" },
  { hasta: 75, etiqueta: "dorado" },
  { hasta: 101, etiqueta: "dominado" },
];

function etiquetaDe(progreso: number) {
  return ETAPAS.find((etapa) => progreso < etapa.hasta)?.etiqueta ?? "dominado";
}

const TAMANOS = {
  sm: { diametro: 96, agujaLargo: 34 },
  lg: { diametro: 200, agujaLargo: 76 },
};

export function PuntoCoccionDial({
  progreso,
  size = "lg",
  detalle,
  acento,
}: {
  progreso: number;
  size?: "sm" | "lg";
  detalle?: string;
  acento?: string;
}) {
  const angulo = -120 + (Math.max(0, Math.min(100, progreso)) / 100) * 240;
  const { diametro, agujaLargo } = TAMANOS[size];

  // Sin acento, el dial usa la escala cálida por defecto de globals.css.
  // Con acento (contexto de módulo), la escala crudo→dominado se recalcula
  // en el propio tono del módulo (claro a oscuro) en vez de siempre
  // naranja/dorado, que da sensación de horno aunque el módulo sea, por
  // ejemplo, una ensalada.
  const escala = acento
    ? ({
        "--color-crudo": `color-mix(in srgb, ${acento} 25%, white)`,
        "--color-apunto": `color-mix(in srgb, ${acento} 55%, white)`,
        "--color-dorado": acento,
        "--color-dominado": `color-mix(in srgb, ${acento} 65%, black)`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={styles.dial}
      style={{ width: diametro, height: diametro, ...escala }}
      role="img"
      aria-label={`Progreso: ${etiquetaDe(progreso)}, ${Math.round(progreso)}%`}
    >
      <div
        className={styles.needle}
        style={
          {
            height: agujaLargo,
            "--angulo": `${angulo}deg`,
          } as React.CSSProperties
        }
      />
      {size === "lg" && (
        <div className={styles.readout} style={{ fontSize: "0.68rem" }}>
          {etiquetaDe(progreso)}
          {detalle && <div style={{ fontSize: "0.6rem", marginTop: 2 }}>{detalle}</div>}
        </div>
      )}
    </div>
  );
}
