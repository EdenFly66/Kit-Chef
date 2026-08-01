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
}: {
  progreso: number;
  size?: "sm" | "lg";
  detalle?: string;
}) {
  const angulo = -120 + (Math.max(0, Math.min(100, progreso)) / 100) * 240;
  const { diametro, agujaLargo } = TAMANOS[size];

  return (
    <div
      className={styles.dial}
      style={{ width: diametro, height: diametro }}
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
