import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Leccion } from "@/lib/types/database";
import { BloqueRenderer } from "@/components/bloques/BloqueRenderer";
import { MarcarLeidaButton } from "@/components/progreso/MarcarLeidaButton";

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: leccion } = await supabase
    .from("lecciones")
    .select("*, modulos(slug)")
    .eq("slug", slug)
    .single<Leccion & { modulos: { slug: string } | null }>();

  if (!leccion) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href={`/modulos/${leccion.modulos?.slug ?? ""}`}
        className="text-sm text-acero hover:underline"
      >
        ← Volver al módulo
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brasa">
            Lección {leccion.numero}
          </p>
          <h1 className="font-titulo text-3xl font-semibold text-foreground">
            {leccion.titulo}
          </h1>
        </div>
        <MarcarLeidaButton leccionId={leccion.id} />
      </div>

      <div className="mt-8 space-y-6">
        {leccion.contenido.map((bloque, i) => (
          <BloqueRenderer key={i} bloque={bloque} />
        ))}
      </div>
    </main>
  );
}
