import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Leccion, Modulo, Receta } from "@/lib/types/database";
import { ListaLeccionesConProgreso } from "@/components/progreso/ListaLeccionesConProgreso";
import { ListaRecetas } from "@/components/recetas/ListaRecetas";
import { acentoDeModulo } from "@/lib/modulos/colores";

export default async function ModuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: modulo } = await supabase
    .from("modulos")
    .select("*")
    .eq("slug", slug)
    .single<Modulo>();

  if (!modulo) notFound();

  const { data: lecciones } = await supabase
    .from("lecciones")
    .select("*")
    .eq("modulo_id", modulo.id)
    .order("orden")
    .returns<Leccion[]>();

  const { data: recetas } =
    lecciones && lecciones.length > 0
      ? { data: null }
      : await supabase
          .from("recetas")
          .select("*")
          .eq("modulo_id", modulo.id)
          .order("titulo")
          .returns<Receta[]>();

  const acento = acentoDeModulo(modulo.numero);

  return (
    <div
      style={
        {
          "--acento": acento,
          backgroundColor: `color-mix(in srgb, ${acento} 12%, var(--background))`,
        } as React.CSSProperties
      }
      className="flex-1"
    >
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <Link href="/modulos" className="text-sm text-acero hover:underline">
          ← Volver a módulos
        </Link>

        <div className="mt-4 border-l-4 border-[var(--acento)] pl-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-[var(--acento)]">
            Módulo {modulo.numero}
          </p>
          <h1 className="font-titulo text-3xl font-semibold text-foreground">
            {modulo.nombre}
          </h1>
          {modulo.descripcion && (
            <p className="mt-2 text-ink-dim">{modulo.descripcion}</p>
          )}
        </div>

        {lecciones && lecciones.length > 0 ? (
          <ListaLeccionesConProgreso lecciones={lecciones} moduloNumero={modulo.numero} />
        ) : recetas && recetas.length > 0 ? (
          <ListaRecetas recetas={recetas} moduloNumero={modulo.numero} />
        ) : (
          <p className="mt-8 border-2 border-dashed border-[var(--acento)] px-4 py-6 text-center font-mono text-sm uppercase tracking-wide text-ink-dim">
            Contenido en camino
          </p>
        )}
      </main>
    </div>
  );
}
