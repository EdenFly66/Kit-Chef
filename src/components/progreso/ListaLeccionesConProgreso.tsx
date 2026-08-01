"use client";

import Link from "next/link";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionPip } from "./PuntoCoccionPip";
import type { Leccion } from "@/lib/types/database";

export function ListaLeccionesConProgreso({ lecciones }: { lecciones: Leccion[] }) {
  const { leidas } = useProgreso(lecciones.map((l) => l.id));

  return (
    <ol className="mt-8 space-y-3">
      {lecciones.map((leccion) => (
        <li key={leccion.id}>
          <Link
            href={`/lecciones/${leccion.slug}`}
            className="flex items-center gap-3 border border-borde bg-superficie px-4 py-3 transition-colors hover:border-brasa"
          >
            <PuntoCoccionPip progreso={leidas.has(leccion.id) ? 100 : 0} />
            <span className="font-mono text-sm font-medium text-brasa">{leccion.numero}</span>
            <span className="text-foreground">{leccion.titulo}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
