import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Leccion } from "@/lib/types/database";
import { BloqueRenderer } from "@/components/bloques/BloqueRenderer";
import { MarcarLeidaButton } from "@/components/progreso/MarcarLeidaButton";
import { acentoDeModulo } from "@/lib/modulos/colores";

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: leccion } = await supabase
    .from("lecciones")
    .select("*, modulos(slug, numero)")
    .eq("slug", slug)
    .single<Leccion & { modulos: { slug: string; numero: number } | null }>();

  if (!leccion) notFound();

  const acento = acentoDeModulo(leccion.modulos?.numero ?? 0);

  const { data: hermanas } = await supabase
    .from("lecciones")
    .select("slug, titulo, numero, orden")
    .eq("modulo_id", leccion.modulo_id)
    .order("orden")
    .returns<Pick<Leccion, "slug" | "titulo" | "numero" | "orden">[]>();

  const indice = (hermanas ?? []).findIndex((l) => l.slug === leccion.slug);
  const anterior = indice > 0 ? hermanas![indice - 1] : null;
  const siguiente =
    indice >= 0 && indice < (hermanas?.length ?? 0) - 1 ? hermanas![indice + 1] : null;

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
          href={`/modulos/${leccion.modulos?.slug ?? ""}`}
          className="text-sm text-acero hover:underline"
        >
          ← Volver al módulo
        </Link>

        <div className="mt-6 border-l-4 border-[var(--acento)] pl-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-[var(--acento)]">
            Lección {leccion.numero}
          </p>
          <h1 className="font-titulo text-3xl font-semibold text-foreground">
            {leccion.titulo}
          </h1>
        </div>

        <div className="mt-8 space-y-6">
          {leccion.contenido.map((bloque, i) => (
            <BloqueRenderer key={i} bloque={bloque} acento={acento} />
          ))}
        </div>

        <div className="mt-10 border-t-2 border-[var(--acento)] pt-6">
          <MarcarLeidaButton leccionId={leccion.id} acento={acento} />
        </div>

        {(anterior || siguiente) && (
          <nav className="mt-8 flex items-stretch justify-between gap-3 border-t border-borde pt-6">
            {anterior ? (
              <Link
                href={`/lecciones/${anterior.slug}`}
                style={{ borderColor: acento }}
                className="flex-1 border-2 bg-superficie p-3 transition-shadow hover:shadow-[0_0_0_3px_var(--acento)]"
              >
                <p className="font-mono text-xs uppercase tracking-wide text-ink-dim">
                  ← {anterior.numero}
                </p>
                <p className="mt-1 text-sm text-foreground">{anterior.titulo}</p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {siguiente ? (
              <Link
                href={`/lecciones/${siguiente.slug}`}
                style={{ borderColor: acento }}
                className="flex-1 border-2 bg-superficie p-3 text-right transition-shadow hover:shadow-[0_0_0_3px_var(--acento)]"
              >
                <p className="font-mono text-xs uppercase tracking-wide text-ink-dim">
                  {siguiente.numero} →
                </p>
                <p className="mt-1 text-sm text-foreground">{siguiente.titulo}</p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
      </main>
    </div>
  );
}
