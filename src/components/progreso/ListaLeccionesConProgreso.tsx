"use client";

import Link from "next/link";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionPip } from "./PuntoCoccionPip";
import { ImagenPlaceholder } from "@/components/bloques/ImagenPlaceholder";
import type { Leccion } from "@/lib/types/database";

export function ListaLeccionesConProgreso({ lecciones }: { lecciones: Leccion[] }) {
  const { leidas } = useProgreso(lecciones.map((l) => l.id));

  return (
    <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {lecciones.map((leccion) => (
        <li key={leccion.id}>
          <Link
            href={`/lecciones/${leccion.slug}`}
            className="block border border-borde bg-superficie transition-colors hover:border-brasa"
          >
            <ImagenPlaceholder aspect="aspect-square" />
            <div className="flex items-center gap-2 p-3">
              <PuntoCoccionPip progreso={leidas.has(leccion.id) ? 100 : 0} />
              <span className="font-mono text-xs font-medium text-brasa">{leccion.numero}</span>
            </div>
            <p className="px-3 pb-3 text-sm text-foreground">{leccion.titulo}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
