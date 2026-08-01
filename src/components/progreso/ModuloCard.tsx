"use client";

import Link from "next/link";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionDial } from "./PuntoCoccionDial";
import { ImagenPlaceholder } from "@/components/bloques/ImagenPlaceholder";
import type { Modulo } from "@/lib/types/database";

export function ModuloCard({
  modulo,
  leccionIds,
  recetaCount = 0,
}: {
  modulo: Modulo;
  leccionIds: string[];
  recetaCount?: number;
}) {
  const { leidas } = useProgreso(leccionIds);
  const total = leccionIds.length;
  const progreso = total === 0 ? 0 : (leidas.size / total) * 100;

  let descripcion: string;
  if (total > 0) {
    descripcion = `${leidas.size}/${total} lecciones leídas`;
  } else if (recetaCount > 0) {
    // Todavía no hay progreso_recetas en el esquema, así que no hay un
    // "leídas/total" real para recetas — solo mostramos cuántas hay.
    descripcion = `${recetaCount} receta${recetaCount === 1 ? "" : "s"}`;
  } else {
    descripcion = "Próximamente";
  }

  const contenido = (
    <div className="border border-borde bg-superficie transition-colors hover:border-brasa">
      <ImagenPlaceholder />
      <div className="flex items-center gap-3 p-4">
        <PuntoCoccionDial progreso={progreso} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-ink-dim">Módulo {modulo.numero}</p>
          <p className="font-titulo text-lg font-semibold text-foreground">{modulo.nombre}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-dim">
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );

  if (total === 0) {
    return <div aria-disabled="true">{contenido}</div>;
  }

  return <Link href={`/modulos/${modulo.slug}`}>{contenido}</Link>;
}
