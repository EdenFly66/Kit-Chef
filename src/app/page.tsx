import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Modulo } from "@/lib/types/database";
import { PuntoCoccionDialDemo } from "@/components/landing/PuntoCoccionDialDemo";

export default async function LandingPage() {
  const { data: modulos } = await supabase
    .from("modulos")
    .select("*")
    .order("numero")
    .returns<Modulo[]>();

  const { data: lecciones } = await supabase.from("lecciones").select("id, modulo_id");
  const { data: recetas } = await supabase.from("recetas").select("id, modulo_id");

  const leccionCountPorModulo = new Map<string, number>();
  for (const l of lecciones ?? []) {
    leccionCountPorModulo.set(l.modulo_id, (leccionCountPorModulo.get(l.modulo_id) ?? 0) + 1);
  }
  const recetaCountPorModulo = new Map<string, number>();
  for (const r of recetas ?? []) {
    recetaCountPorModulo.set(r.modulo_id, (recetaCountPorModulo.get(r.modulo_id) ?? 0) + 1);
  }

  return (
    <main>
      {/* 1. Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-16 pb-20 text-center sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-wide text-brasa">Kit-Chef</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-balance font-titulo text-4xl font-semibold text-foreground sm:text-5xl">
          La técnica primero. La receta después.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ink-dim">
          Diez módulos gratuitos que enseñan a cocinar por técnica —cortar, salar, dorar,
          emulsionar— para que después cualquier receta te salga sin depender de seguir
          instrucciones al pie de la letra.
        </p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <Link
            href="/modulos"
            className="rounded-md bg-brasa px-6 py-3 font-mono text-sm uppercase tracking-wide text-pergamino"
          >
            Explorar los módulos →
          </Link>
          <p className="text-xs text-ink-dim">Gratis. Sin necesidad de crear cuenta.</p>
        </div>
      </section>

      {/* 2. El diferencial */}
      <section className="border-t border-borde bg-superficie">
        <div className="mx-auto grid w-full max-w-3xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-acero">El enfoque</p>
            <h2 className="mt-2 text-balance font-titulo text-2xl font-semibold text-foreground sm:text-3xl">
              Una receta te enseña un plato. Una técnica te enseña a cocinar.
            </h2>
            <p className="mt-4 text-ink-dim">
              Una receta caduca apenas falta un ingrediente o cambia la sartén. La técnica
              —cuándo salar, cómo armar una emulsión, qué le hace el calor a una proteína— se
              transfiere a cualquier plato, para siempre.
            </p>
          </div>
          <PuntoCoccionDialDemo />
        </div>
      </section>

      {/* 3. Módulos */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-wide text-acero">Los módulos</p>
        <h2 className="mt-2 text-balance font-titulo text-2xl font-semibold text-foreground sm:text-3xl">
          Diez módulos, del cuchillo a la despensa llena.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {(modulos ?? []).map((modulo) => {
            const leccionCount = leccionCountPorModulo.get(modulo.id) ?? 0;
            const recetaCount = recetaCountPorModulo.get(modulo.id) ?? 0;

            let descripcion: string;
            if (leccionCount > 0) descripcion = `${leccionCount} lecciones`;
            else if (recetaCount > 0) descripcion = `${recetaCount} recetas`;
            else descripcion = "Próximamente";

            return (
              <div key={modulo.id} className="border border-borde bg-superficie p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-titulo text-base font-semibold text-foreground">
                    {modulo.numero}. {modulo.nombre}
                  </p>
                  {modulo.es_premium && (
                    <span className="shrink-0 border border-dashed border-acero px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-acero">
                      Premium
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-dim">
                  {descripcion}
                </p>
              </div>
            );
          })}
        </div>

        <Link href="/modulos" className="mt-6 inline-block text-sm text-brasa hover:underline">
          Ver todos los módulos →
        </Link>
      </section>

      {/* 4. Premium */}
      <section className="border-t border-borde bg-superficie">
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-wide text-acero">Premium · opcional</p>
          <h2 className="mt-2 text-balance font-titulo text-2xl font-semibold text-foreground sm:text-3xl">
            Todo el contenido es gratis. Premium es para ir más rápido.
          </h2>
          <p className="mt-4 text-ink-dim">
            Los diez módulos —lecciones y recetas— son gratis y completos, sin muro de pago.
            Premium agrega dos cosas: quizzes por lección con calificación, para saber si de
            verdad aprendiste, y un recomendador que cruza lo que tienes en tu despensa con las
            recetas disponibles.
          </p>
          <p className="mt-4 text-sm text-ink-dim">
            Premium está en construcción — el contenido educativo ya está disponible completo
            hoy.
          </p>
        </div>
      </section>

      {/* 5. CTA final */}
      <section className="mx-auto w-full max-w-2xl px-6 py-20 text-center">
        <h2 className="text-balance font-titulo text-2xl font-semibold text-foreground sm:text-3xl">
          Empieza por el principio: el cuchillo.
        </h2>
        <Link
          href="/modulos/fundamentos"
          className="mt-6 inline-block rounded-md bg-brasa px-6 py-3 font-mono text-sm uppercase tracking-wide text-pergamino"
        >
          Ir a Fundamentos →
        </Link>
      </section>
    </main>
  );
}
