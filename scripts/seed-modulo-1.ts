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
  const { data: modulo, error: errorModulo } = await supabase
    .from("modulos")
    .upsert(
      {
        numero: 1,
        nombre: "Fundamentos",
        slug: "fundamentos",
        descripcion:
          "Cuchillo, cortes, limpieza, sal, grasas, ácidos, umami, balance",
        es_premium: false,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (errorModulo || !modulo) {
    throw errorModulo ?? new Error("No se pudo crear/leer el módulo 1");
  }

  const contenidoDir = path.join(
    process.cwd(),
    "docs",
    "contenido",
    "modulo-1"
  );
  const archivos = readdirSync(contenidoDir).filter((f) =>
    f.endsWith(".json")
  );

  const lecciones: LeccionJson[] = archivos.map((archivo) =>
    JSON.parse(readFileSync(path.join(contenidoDir, archivo), "utf-8"))
  );

  lecciones.sort(
    (a, b) => ordenDesdeNumero(a.leccion_numero) - ordenDesdeNumero(b.leccion_numero)
  );

  for (const leccion of lecciones) {
    const { error } = await supabase.from("lecciones").upsert(
      {
        modulo_id: modulo.id,
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

    console.log(`✓ ${leccion.leccion_numero} ${leccion.titulo}`);
  }

  console.log(`\nMódulo 1 cargado: ${lecciones.length} lecciones.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
