import Link from "next/link";
import { ImagenPlaceholder } from "@/components/bloques/ImagenPlaceholder";
import { acentoDeModulo } from "@/lib/modulos/colores";
import type { Receta } from "@/lib/types/database";

const ETIQUETA_DIFICULTAD: Record<Receta["dificultad"], string> = {
  facil: "Fácil",
  media: "Media",
  dificil: "Difícil",
};

export function ListaRecetas({
  recetas,
  moduloNumero,
}: {
  recetas: Receta[];
  moduloNumero: number;
}) {
  const acento = acentoDeModulo(moduloNumero);

  return (
    <ol
      style={{ "--acento": acento } as React.CSSProperties}
      className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {recetas.map((receta) => (
        <li key={receta.id}>
          <Link
            href={`/recetas/${receta.slug}`}
            style={{
              borderColor: acento,
              backgroundColor: `color-mix(in srgb, ${acento} 10%, var(--color-superficie))`,
            }}
            className="relative block border-2 transition-[transform,box-shadow] duration-200 ease-out hover:z-10 hover:shadow-[0_0_0_3px_var(--acento)] motion-safe:hover:-rotate-1 motion-safe:hover:scale-105"
          >
            <ImagenPlaceholder aspect="aspect-square" acento={acento} />
            <div className="p-3">
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--acento)]">
                {ETIQUETA_DIFICULTAD[receta.dificultad]} · {receta.tiempo_preparacion_min} min
              </p>
              <p className="mt-1 text-sm text-foreground">{receta.titulo}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
