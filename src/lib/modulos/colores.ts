// Acento temático por módulo — reemplaza el naranja único (brasa) global
// cuando el contexto es un módulo específico (cards, números de lección,
// botones dentro de esa vista). El resto del sitio (header, landing, auth)
// sigue usando el token global --color-brasa sin cambios.
const ACENTO_POR_MODULO: Record<number, string> = {
  1: "#E3491B", // Fundamentos — brasa (cuchillo, sal, fuego)
  2: "#B5501C", // Calor y técnicas — ámbar Maillard (dorado, braseado)
  3: "#4A6B7A", // Precisión — acero de termómetro
  4: "#C9932E", // Sabor y creatividad — mostaza, especiado
  5: "#5C7A45", // Ensaladas — oliva, verduras frescas
  6: "#A67C3D", // Recetas técnica — manteca, roux
  7: "#8B5A2B", // Panadería y pastelería — corteza de trigo
  8: "#9A4B3F", // Tips por ingrediente — proteína cruda
  9: "#8F6A1E", // Recetas guiadas (premium) — bronce
  10: "#3F6B6B", // Conservación y almacenamiento — frío
};

const ACENTO_POR_DEFECTO = "#E3491B";

export function acentoDeModulo(numero: number): string {
  return ACENTO_POR_MODULO[numero] ?? ACENTO_POR_DEFECTO;
}
