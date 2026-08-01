/**
 * Tipos TypeScript que reflejan esquema-base-datos-app-cocina.md.
 * Placeholder de Fase 0: sin cliente Supabase conectado todavía.
 * Cuando se conecte Supabase (Fase 1), estos tipos pueden reemplazarse
 * por los generados automáticamente vía `supabase gen types typescript`.
 */

export type Dificultad = "facil" | "media" | "dificil";
export type Plan = "free" | "premium";
export type EstadoSuscripcion = "activa" | "vencida" | "cancelada";
export type Calificacion = "aprobado" | "bien" | "muy_bien" | "excelente";
export type CalificacionIntento = "no_aprobado" | Calificacion;

export type BloqueContenido =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "imagen"; url: string; caption?: string }
  | { tipo: "tip"; titulo: string; texto: string }
  | { tipo: "tabla"; titulo: string; columnas: string[]; filas: string[][] }
  | { tipo: "video"; url: string }
  | { tipo: "lista"; items: string[] };

export interface Modulo {
  id: string;
  numero: number;
  nombre: string;
  slug: string;
  descripcion: string;
  es_premium: boolean;
}

export interface Leccion {
  id: string;
  modulo_id: string;
  // text, no numeric: "1.10" y "1.1" colisionarían como numeric.
  numero: string;
  // orden numérico dentro del módulo, solo para sort (no está en el esquema documentado).
  orden: number;
  titulo: string;
  slug: string;
  contenido: BloqueContenido[];
  imagen_url: string | null;
  video_url: string | null;
  tiene_quiz: boolean;
}

export interface Receta {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  imagen_url: string | null;
  tiempo_preparacion_min: number;
  dificultad: Dificultad;
  porciones: number;
  modulo_id: string;
}

export interface RecetaPaso {
  id: string;
  receta_id: string;
  numero_paso: number;
  instruccion: string;
  tecnica_id: string | null;
}

export interface Ingrediente {
  id: string;
  nombre: string;
  categoria: string | null;
  creado_desde_receta_id: string | null;
}

export interface RecetaIngrediente {
  id: string;
  receta_id: string;
  ingrediente_id: string;
  cantidad: number;
  unidad: string;
}

export interface TagDieta {
  id: string;
  nombre: string;
}

export interface RecetaTagDieta {
  receta_id: string;
  tag_id: string;
}

export interface TipIngrediente {
  id: string;
  ingrediente_id: string;
  titulo: string;
  contenido: string;
}

export interface Perfil {
  id: string;
  nombre: string;
  plan: Plan;
  fecha_registro: string;
}

export interface Suscripcion {
  id: string;
  usuario_id: string;
  estado: EstadoSuscripcion;
  proveedor_pago: string;
  id_externo: string;
  fecha_inicio: string;
  fecha_renovacion: string;
}

export interface UsuarioPreferenciaDieta {
  usuario_id: string;
  tag_id: string;
}

export interface ProgresoLeccion {
  id: string;
  usuario_id: string;
  leccion_id: string;
  leido: boolean;
  fecha_leido: string | null;
  aprobado: boolean;
  mejor_calificacion: Calificacion | null;
  fecha_aprobado: string | null;
}

export interface QuizPregunta {
  id: string;
  leccion_id: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: string;
}

export interface QuizIntento {
  id: string;
  usuario_id: string;
  leccion_id: string;
  puntaje: number;
  calificacion: CalificacionIntento;
  fecha: string;
}

export interface QuizIntentoRespuesta {
  id: string;
  intento_id: string;
  pregunta_id: string;
  respuesta_dada: string;
  es_correcta: boolean;
}

export interface UsuarioDespensa {
  id: string;
  usuario_id: string;
  ingrediente_id: string;
  fecha_agregado: string;
}
