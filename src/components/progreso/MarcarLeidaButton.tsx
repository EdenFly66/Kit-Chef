"use client";

import { useState } from "react";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionDial } from "./PuntoCoccionDial";

/**
 * Dial + botón comparten un único useProgreso: si estuvieran separados, marcar
 * como leída no movería la aguja hasta el próximo fetch (nunca, en esta página).
 */
export function MarcarLeidaButton({ leccionId }: { leccionId: string }) {
  const { leidas, loading, marcarLeida } = useProgreso([leccionId]);
  const [enviando, setEnviando] = useState(false);
  const leida = leidas.has(leccionId);

  async function onClick() {
    setEnviando(true);
    await marcarLeida(leccionId);
    setEnviando(false);
  }

  return (
    <div className="flex items-center gap-6">
      <PuntoCoccionDial progreso={leida ? 100 : 0} size="lg" />
      <button
        onClick={onClick}
        disabled={loading || leida || enviando}
        className="rounded-md bg-brasa px-4 py-2 font-mono text-sm uppercase tracking-wide text-pergamino disabled:opacity-50"
      >
        {leida ? "Leída ✓" : enviando ? "Guardando…" : "Marcar como leída"}
      </button>
    </div>
  );
}
