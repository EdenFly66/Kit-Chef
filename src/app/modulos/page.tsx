import { supabase } from "@/lib/supabase/client";
import type { Modulo } from "@/lib/types/database";
import { ModuloCard } from "@/components/progreso/ModuloCard";

export default async function ModulosPage() {
  const { data: modulos } = await supabase
    .from("modulos")
    .select("*")
    .order("numero")
    .returns<Modulo[]>();

  const { data: lecciones } = await supabase
    .from("lecciones")
    .select("id, modulo_id");

  const idsPorModulo = new Map<string, string[]>();
  for (const leccion of lecciones ?? []) {
    const lista = idsPorModulo.get(leccion.modulo_id) ?? [];
    lista.push(leccion.id);
    idsPorModulo.set(leccion.modulo_id, lista);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-wide text-acero">Kit-Chef</p>
      <h1 className="font-titulo text-3xl font-semibold text-foreground">Módulos</h1>
      <p className="mt-2 text-ink-dim">
        Técnicas antes que recetas. Diez módulos, a tu ritmo.
      </p>

      <div className="mt-8 grid gap-3">
        {(modulos ?? []).map((modulo) => (
          <ModuloCard
            key={modulo.id}
            modulo={modulo}
            leccionIds={idsPorModulo.get(modulo.id) ?? []}
          />
        ))}
      </div>
    </main>
  );
}
