"use client";

import { useState } from "react";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionDial } from "./PuntoCoccionDial";

/**
 * Dial + botón comparten un único useProgreso: si estuvieran separados, marcar
 * como leída no movería la aguja hasta el próximo fetch (nunca, en esta página).
 */
export function MarcarLeidaButton({
  leccionId,
  acento,
}: {
  leccionId: string;
  acento?: string;
}) {
  const { leidas, loading, marcarLeida, desmarcarLeida } = useProgreso([leccionId]);
  const [enviando, setEnviando] = useState(false);
  const leida = leidas.has(leccionId);
  const color = acento ?? "var(--color-brasa)";

  async function onClick() {
    setEnviando(true);
    if (leida) {
      await desmarcarLeida(leccionId);
    } else {
      await marcarLeida(leccionId);
    }
    setEnviando(false);
  }

  return (
    <div className="flex items-center gap-6">
      <PuntoCoccionDial progreso={leida ? 100 : 0} size="lg" acento={acento} />
      <button
        onClick={onClick}
        disabled={loading || enviando}
        aria-pressed={leida}
        title={leida ? "Marcar como no leída" : undefined}
        style={
          leida
            ? { borderColor: color, color }
            : { backgroundColor: color, color: "var(--color-pergamino)" }
        }
        className={
          leida
            ? "border px-4 py-2 font-mono text-sm uppercase tracking-wide transition-opacity hover:opacity-75 disabled:opacity-50"
            : "rounded-md px-4 py-2 font-mono text-sm uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
        }
      >
        {enviando ? "Guardando…" : leida ? "Leída ✓" : "Marcar como leída"}
      </button>
    </div>
  );
}
