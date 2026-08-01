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

const supabase = createClient(supabaseUrl, serviceRoleKey);

interface IngredienteJson {
  nombre: string;
  cantidad: number;
  unidad: string;
}

interface PasoJson {
  numero_paso: number;
  instruccion: string;
  tecnica_relacionada: string | null;
}

interface RecetaJson {
  modulo: number;
  titulo: string;
  slug: string;
  descripcion: string;
  tiempo_preparacion_min: number;
  dificultad: "facil" | "media" | "dificil";
  porciones: number;
  ingredientes: IngredienteJson[];
  pasos: (PasoJson | { tipo: string })[];
  tags_dieta: string[];
}

// Sin tildes, minúscula, singular. La única forma plural real en el
// catálogo actual es "nueces" (-ces -> -z); para el resto alcanza con
// recortar la "s" final — un pluralizador español genérico sería
// sobre-ingeniería para este catálogo.
function normalizarIngrediente(nombre: string): string {
  const base = nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  if (base.endsWith("ces")) return base.slice(0, -3) + "z";
  if (base.endsWith("s")) return base.slice(0, -1);
  return base;
}

function esPasoReal(item: PasoJson | { tipo: string }): item is PasoJson {
  return "numero_paso" in item;
}

async function main() {
  const contenidoRoot = path.join(process.cwd(), "docs", "contenido");
  const carpetasModulo = readdirSync(contenidoRoot).filter((f) =>
    f.startsWith("modulo-")
  );

  const { data: modulos, error: errorModulos } = await supabase
    .from("modulos")
    .select("id, numero");
  if (errorModulos || !modulos) throw errorModulos ?? new Error("No se pudieron leer los módulos");
  const moduloIdPorNumero = new Map(modulos.map((m) => [m.numero, m.id]));

  const { data: lecciones, error: errorLecciones } = await supabase
    .from("lecciones")
    .select("id, slug");
  if (errorLecciones || !lecciones) throw errorLecciones ?? new Error("No se pudieron leer las lecciones");
  const leccionIdPorSlug = new Map(lecciones.map((l) => [l.slug, l.id]));

  const crossLinksSinResolver: string[] = [];
  let recetasCargadas = 0;
  let pasosCargados = 0;
  let ingredientesNuevos = 0;

  for (const carpeta of carpetasModulo.sort()) {
    const contenidoDir = path.join(contenidoRoot, carpeta);
    const archivos = readdirSync(contenidoDir).filter((f) => f.endsWith(".json"));
    if (archivos.length === 0) continue;

    const primero = JSON.parse(readFileSync(path.join(contenidoDir, archivos[0]), "utf-8"));
    if (!("ingredientes" in primero && "pasos" in primero)) continue; // no es carpeta de recetas

    const recetas: RecetaJson[] = archivos.map((archivo) =>
      JSON.parse(readFileSync(path.join(contenidoDir, archivo), "utf-8"))
    );

    const numeroModulo = recetas[0].modulo;
    const moduloId = moduloIdPorNumero.get(numeroModulo);
    if (!moduloId) {
      throw new Error(`No existe el módulo ${numeroModulo} en la tabla modulos`);
    }

    console.log(`\nMódulo ${numeroModulo} (${carpeta}) — recetas:`);

    for (const receta of recetas) {
      const { data: recetaRow, error: errorReceta } = await supabase
        .from("recetas")
        .upsert(
          {
            titulo: receta.titulo,
            slug: receta.slug,
            descripcion: receta.descripcion,
            tiempo_preparacion_min: receta.tiempo_preparacion_min,
            dificultad: receta.dificultad,
            porciones: receta.porciones,
            modulo_id: moduloId,
          },
          { onConflict: "slug" }
        )
        .select("id")
        .single();

      if (errorReceta || !recetaRow) {
        throw new Error(`Error al cargar receta ${receta.slug}: ${errorReceta?.message}`);
      }
      const recetaId = recetaRow.id;

      // Ingredientes: upsert en el catálogo + fila de receta_ingredientes.
      for (const ing of receta.ingredientes) {
        const nombreNormalizado = normalizarIngrediente(ing.nombre);

        const { data: existente } = await supabase
          .from("ingredientes")
          .select("id")
          .eq("nombre", nombreNormalizado)
          .maybeSingle();

        let ingredienteId = existente?.id as string | undefined;

        if (!ingredienteId) {
          const { data: creado, error: errorIngrediente } = await supabase
            .from("ingredientes")
            .insert({ nombre: nombreNormalizado, creado_desde_receta_id: recetaId })
            .select("id")
            .single();
          if (errorIngrediente || !creado) {
            throw new Error(
              `Error al crear ingrediente "${nombreNormalizado}": ${errorIngrediente?.message}`
            );
          }
          ingredienteId = creado.id;
          ingredientesNuevos++;
        }

        const { error: errorRecetaIngrediente } = await supabase
          .from("receta_ingredientes")
          .upsert(
            {
              receta_id: recetaId,
              ingrediente_id: ingredienteId,
              cantidad: ing.cantidad,
              unidad: ing.unidad,
            },
            { onConflict: "receta_id,ingrediente_id" }
          );
        if (errorRecetaIngrediente) {
          throw new Error(
            `Error al asociar ingrediente "${nombreNormalizado}" a ${receta.slug}: ${errorRecetaIngrediente.message}`
          );
        }
      }

      // Pasos reales (se omiten los bloques de imagen: receta_pasos no
      // tiene un sistema de bloques como lecciones.contenido).
      const pasosReales = receta.pasos.filter(esPasoReal);
      for (const paso of pasosReales) {
        let tecnicaId: string | null = null;
        if (paso.tecnica_relacionada) {
          tecnicaId = leccionIdPorSlug.get(paso.tecnica_relacionada) ?? null;
          if (!tecnicaId) {
            crossLinksSinResolver.push(`${paso.tecnica_relacionada} (receta: ${receta.slug})`);
          }
        }

        const { error: errorPaso } = await supabase.from("receta_pasos").upsert(
          {
            receta_id: recetaId,
            numero_paso: paso.numero_paso,
            instruccion: paso.instruccion,
            tecnica_id: tecnicaId,
          },
          { onConflict: "receta_id,numero_paso" }
        );
        if (errorPaso) {
          throw new Error(`Error al cargar paso ${paso.numero_paso} de ${receta.slug}: ${errorPaso.message}`);
        }
        pasosCargados++;
      }

      // Tags de dieta: catálogo que crece solo, igual que ingredientes.
      for (const tagNombre of receta.tags_dieta ?? []) {
        const { data: tagExistente } = await supabase
          .from("tags_dieta")
          .select("id")
          .eq("nombre", tagNombre)
          .maybeSingle();

        let tagId = tagExistente?.id as string | undefined;
        if (!tagId) {
          const { data: tagCreado, error: errorTag } = await supabase
            .from("tags_dieta")
            .insert({ nombre: tagNombre })
            .select("id")
            .single();
          if (errorTag || !tagCreado) {
            throw new Error(`Error al crear tag "${tagNombre}": ${errorTag?.message}`);
          }
          tagId = tagCreado.id;
        }

        const { error: errorRecetaTag } = await supabase
          .from("receta_tags_dieta")
          .upsert({ receta_id: recetaId, tag_id: tagId }, { onConflict: "receta_id,tag_id" });
        if (errorRecetaTag) {
          throw new Error(`Error al asociar tag "${tagNombre}" a ${receta.slug}: ${errorRecetaTag.message}`);
        }
      }

      console.log(`  ✓ ${receta.titulo} (${pasosReales.length} pasos, ${receta.ingredientes.length} ingredientes)`);
      recetasCargadas++;
    }
  }

  console.log(
    `\n${recetasCargadas} recetas, ${pasosCargados} pasos, ${ingredientesNuevos} ingredientes nuevos cargados.`
  );

  if (crossLinksSinResolver.length > 0) {
    console.log(`\n⚠ Cross-links (tecnica_relacionada) sin resolver contra lecciones.slug:`);
    for (const item of crossLinksSinResolver) console.log(`  - ${item}`);
  } else {
    console.log("Todos los cross-links (tecnica_relacionada) resolvieron correctamente.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
