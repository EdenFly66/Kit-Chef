import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Nombres/descripciones desde docs/PRD-app-cocina.md, tabla de módulos (§2).
const modulos = [
  { numero: 1, nombre: "Fundamentos", slug: "fundamentos", descripcion: "Cuchillo, cortes, limpieza, sal, grasas, ácidos, umami, balance", es_premium: false },
  { numero: 2, nombre: "Calor y técnicas", slug: "calor-y-tecnicas", descripcion: "4 cuadrantes de calor, dorado, hervido/blanqueado, braseado, salteado, asado", es_premium: false },
  { numero: 3, nombre: "Precisión", slug: "precision", descripcion: "Termómetro, puntos de cocción, carryover", es_premium: false },
  { numero: 4, nombre: "Sabor y creatividad", slug: "sabor-y-creatividad", descripcion: "Mapa de sabores regional, sustituciones, improvisación", es_premium: false },
  { numero: 5, nombre: "Ensaladas", slug: "ensaladas", descripcion: "Tipos, componentes, sabores, aderezos, construcción", es_premium: false },
  { numero: 6, nombre: "Recetas técnica", slug: "recetas-tecnica", descripcion: "Huevos, sellado + salsa, otras a definir", es_premium: false },
  { numero: 7, nombre: "Panadería y pastelería", slug: "panaderia-y-pasteleria", descripcion: "Masa madre, fermentación, técnicas, equipo, diagnóstico", es_premium: false },
  { numero: 8, nombre: "Tips por ingrediente", slug: "tips-por-ingrediente", descripcion: "Pollo, carne, cerdo, pescados/mariscos, otros", es_premium: false },
  { numero: 9, nombre: "Recetas guiadas", slug: "recetas-guiadas", descripcion: "Recetas tageadas + recomendador \"qué tengo en casa\"", es_premium: true },
  { numero: 10, nombre: "Conservación y almacenamiento", slug: "conservacion-y-almacenamiento", descripcion: "Transversal, vinculado a recetas y técnicas", es_premium: false },
];

async function main() {
  for (const modulo of modulos) {
    const { error } = await supabase.from("modulos").upsert(modulo, { onConflict: "slug" });
    if (error) {
      throw new Error(`Error al cargar módulo ${modulo.numero}: ${error.message}`);
    }
    console.log(`✓ ${modulo.numero}. ${modulo.nombre}`);
  }
  console.log(`\n${modulos.length} módulos cargados.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
