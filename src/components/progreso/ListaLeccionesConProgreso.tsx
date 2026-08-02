"use client";

import Link from "next/link";
import { useProgreso } from "@/lib/progreso/useProgreso";
import { PuntoCoccionPip } from "./PuntoCoccionPip";
import { ImagenPlaceholder } from "@/components/bloques/ImagenPlaceholder";
import { acentoDeModulo } from "@/lib/modulos/colores";
import type { Leccion } from "@/lib/types/database";

export function ListaLeccionesConProgreso({
  lecciones,
  moduloNumero,
}: {
  lecciones: Leccion[];
  moduloNumero: number;
}) {
  const { leidas } = useProgreso(lecciones.map((l) => l.id));
  const acento = acentoDeModulo(moduloNumero);

  return (
    <ol
      style={{ "--acento": acento } as React.CSSProperties}
      className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {lecciones.map((leccion) => (
        <li key={leccion.id}>
          <Link
            href={`/lecciones/${leccion.slug}`}
            style={{
              borderColor: acento,
              backgroundColor: `color-mix(in srgb, ${acento} 10%, var(--color-superficie))`,
            }}
            className="relative block border-2 transition-[transform,box-shadow] duration-200 ease-out hover:z-10 hover:shadow-[0_0_0_3px_var(--acento)] motion-safe:hover:-rotate-1 motion-safe:hover:scale-105"
          >
            <ImagenPlaceholder aspect="aspect-square" acento={acento} />
            <div className="flex items-center gap-2 p-3">
              <PuntoCoccionPip progreso={leidas.has(leccion.id) ? 100 : 0} acento={acento} />
              <span className="font-mono text-xs font-medium text-[var(--acento)]">
                {leccion.numero}
              </span>
            </div>
            <p className="px-3 pb-3 text-sm text-foreground">{leccion.titulo}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
