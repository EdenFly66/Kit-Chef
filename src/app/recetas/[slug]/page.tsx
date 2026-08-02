import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Receta } from "@/lib/types/database";
import { acentoDeModulo } from "@/lib/modulos/colores";

const ETIQUETA_DIFICULTAD: Record<Receta["dificultad"], string> = {
  facil: "Fácil",
  media: "Media",
  dificil: "Difícil",
};

interface PasoConTecnica {
  numero_paso: number;
  instruccion: string;
  lecciones: { slug: string; titulo: string } | null;
}

interface IngredienteFila {
  cantidad: number;
  unidad: string;
  ingredientes: { nombre: string } | null;
}

export default async function RecetaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: receta } = await supabase
    .from("recetas")
    .select("*, modulos(slug, numero)")
    .eq("slug", slug)
    .single<Receta & { modulos: { slug: string; numero: number } | null }>();

  if (!receta) notFound();

  const acento = acentoDeModulo(receta.modulos?.numero ?? 0);

  const [{ data: pasos }, { data: ingredientes }, { data: tags }] = await Promise.all([
    supabase
      .from("receta_pasos")
      .select("numero_paso, instruccion, lecciones(slug, titulo)")
      .eq("receta_id", receta.id)
      .order("numero_paso")
      .returns<PasoConTecnica[]>(),
    supabase
      .from("receta_ingredientes")
      .select("cantidad, unidad, ingredientes(nombre)")
      .eq("receta_id", receta.id)
      .returns<IngredienteFila[]>(),
    supabase
      .from("receta_tags_dieta")
      .select("tags_dieta(nombre)")
      .eq("receta_id", receta.id)
      .returns<{ tags_dieta: { nombre: string } | null }[]>(),
  ]);

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
        <Link
          href={`/modulos/${receta.modulos?.slug ?? ""}`}
          className="text-sm text-acero hover:underline"
        >
          ← Volver al módulo
        </Link>

        <div className="mt-6 border-l-4 border-[var(--acento)] pl-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-[var(--acento)]">
            {ETIQUETA_DIFICULTAD[receta.dificultad]} · {receta.tiempo_preparacion_min} min ·{" "}
            {receta.porciones} porciones
          </p>
          <h1 className="font-titulo text-3xl font-semibold text-foreground">{receta.titulo}</h1>
          {receta.descripcion && <p className="mt-2 text-ink-dim">{receta.descripcion}</p>}

          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map(
                (t, i) =>
                  t.tags_dieta && (
                    <span
                      key={i}
                      className="border border-borde px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-ink-dim"
                    >
                      {t.tags_dieta.nombre.replace("_", " ")}
                    </span>
                  )
              )}
            </div>
          )}
        </div>

        {ingredientes && ingredientes.length > 0 && (
          <section className="mt-8">
            <h2 className="font-titulo text-lg font-semibold text-foreground">Ingredientes</h2>
            <ul className="mt-3 space-y-1.5">
              {ingredientes.map((ing, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground">
                  <span className="font-mono text-ink-dim">
                    {ing.cantidad} {ing.unidad}
                  </span>
                  <span>{ing.ingredientes?.nombre}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pasos && pasos.length > 0 && (
          <section className="mt-8">
            <h2 className="font-titulo text-lg font-semibold text-foreground">Pasos</h2>
            <ol className="mt-3 space-y-4">
              {pasos.map((paso) => (
                <li key={paso.numero_paso} className="flex gap-3">
                  <span className="font-mono text-sm font-semibold text-[var(--acento)]">
                    {paso.numero_paso}
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{paso.instruccion}</p>
                    {paso.lecciones && (
                      <Link
                        href={`/lecciones/${paso.lecciones.slug}`}
                        className="mt-1 inline-block border-b border-dashed border-brasa text-xs text-brasa"
                      >
                        Técnica: {paso.lecciones.titulo}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
}
