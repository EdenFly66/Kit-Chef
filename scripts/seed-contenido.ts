import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
}

// Cliente con service role: bypassea RLS, no se reutiliza en el frontend.
const supabase = createClient(supabaseUrl, serviceRoleKey);

type BloqueContenido = Record<string, unknown>;

interface LeccionJson {
  modulo: number;
  leccion_numero: string;
  titulo: string;
  slug: string;
  tiene_quiz: boolean;
  contenido: BloqueContenido[];
}

function ordenDesdeNumero(numero: string): number {
  const [, minor] = numero.split(".").map(Number);
  return minor;
}

async function main() {
  const contenidoRoot = path.join(process.cwd(), "docs", "contenido");
  const carpetasModulo = readdirSync(contenidoRoot).filter((f) =>
    f.startsWith("modulo-")
  );

  const { data: modulos, error: errorModulos } = await supabase
    .from("modulos")
    .select("id, numero");

  if (errorModulos || !modulos) {
    throw errorModulos ?? new Error("No se pudieron leer los módulos");
  }

  const moduloIdPorNumero = new Map(modulos.map((m) => [m.numero, m.id]));

  let totalLecciones = 0;

  for (const carpeta of carpetasModulo.sort()) {
    const contenidoDir = path.join(contenidoRoot, carpeta);
    const archivos = readdirSync(contenidoDir).filter((f) => f.endsWith(".json"));

    const crudos: Record<string, unknown>[] = archivos.map((archivo) =>
      JSON.parse(readFileSync(path.join(contenidoDir, archivo), "utf-8"))
    );

    if (crudos.length === 0) continue;

    // Carpetas con forma de receta (ingredientes/pasos/tecnica_relacionada),
    // no de lección — van a recetas/receta_pasos vía npm run seed:recetas.
    if (!("contenido" in crudos[0])) {
      console.log(
        `\nMódulo ${crudos[0].modulo} (${carpeta}): contenido de recetas, no de lecciones — se omite (correr "npm run seed:recetas" para cargarlo).`
      );
      continue;
    }

    const lecciones = crudos as unknown as LeccionJson[];
    const numeroModulo = lecciones[0].modulo;
    const moduloId = moduloIdPorNumero.get(numeroModulo);

    if (!moduloId) {
      throw new Error(
        `No existe el módulo ${numeroModulo} en la tabla modulos (¿corriste npm run seed:modulos?)`
      );
    }

    lecciones.sort(
      (a, b) => ordenDesdeNumero(a.leccion_numero) - ordenDesdeNumero(b.leccion_numero)
    );

    console.log(`\nMódulo ${numeroModulo} (${carpeta}):`);

    for (const leccion of lecciones) {
      const { error } = await supabase.from("lecciones").upsert(
        {
          modulo_id: moduloId,
          numero: leccion.leccion_numero,
          orden: ordenDesdeNumero(leccion.leccion_numero),
          titulo: leccion.titulo,
          slug: leccion.slug,
          contenido: leccion.contenido,
          tiene_quiz: leccion.tiene_quiz,
        },
        { onConflict: "slug" }
      );

      if (error) {
        throw new Error(`Error al cargar ${leccion.slug}: ${error.message}`);
      }

      console.log(`  ✓ ${leccion.leccion_numero} ${leccion.titulo}`);
      totalLecciones++;
    }
  }

  console.log(`\n${totalLecciones} lecciones cargadas en total.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
