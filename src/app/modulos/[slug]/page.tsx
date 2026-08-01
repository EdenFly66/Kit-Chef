import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Leccion, Modulo } from "@/lib/types/database";
import { ListaLeccionesConProgreso } from "@/components/progreso/ListaLeccionesConProgreso";

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

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-wide text-acero">
        Módulo {modulo.numero}
      </p>
      <h1 className="font-titulo text-3xl font-semibold text-foreground">
        {modulo.nombre}
      </h1>
      {modulo.descripcion && (
        <p className="mt-2 text-ink-dim">{modulo.descripcion}</p>
      )}

      {lecciones && lecciones.length > 0 ? (
        <ListaLeccionesConProgreso lecciones={lecciones} />
      ) : (
        <p className="mt-8 border border-dashed border-borde px-4 py-6 text-center font-mono text-sm uppercase tracking-wide text-ink-dim">
          Contenido en camino
        </p>
      )}
    </main>
  );
}
