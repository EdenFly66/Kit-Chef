"use client";

import Link from "next/link";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionDial } from "./PuntoCoccionDial";
import type { Modulo } from "@/lib/types/database";

export function ModuloCard({
  modulo,
  leccionIds,
}: {
  modulo: Modulo;
  leccionIds: string[];
}) {
  const { leidas } = useProgreso(leccionIds);
  const total = leccionIds.length;
  const progreso = total === 0 ? 0 : (leidas.size / total) * 100;

  const contenido = (
    <div className="flex items-center gap-4 border border-borde bg-superficie p-4 transition-colors hover:border-brasa">
      <PuntoCoccionDial progreso={progreso} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-ink-dim">Módulo {modulo.numero}</p>
        <p className="font-titulo text-lg font-semibold text-foreground">{modulo.nombre}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-dim">
          {total === 0 ? "Próximamente" : `${leidas.size}/${total} lecciones leídas`}
        </p>
      </div>
    </div>
  );

  if (total === 0) {
    return <div aria-disabled="true">{contenido}</div>;
  }

  return <Link href={`/modulos/${modulo.slug}`}>{contenido}</Link>;
}
