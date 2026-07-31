# Esquema de Base de Datos — Kit-Chef
Versión 1.0 · Postgres (Supabase)

---

## Principios de diseño

- Todo el **contenido educativo** (técnicas, recetas, tips) es de lectura pública — no requiere join con tablas de usuario para mostrarse
- Los datos **por usuario** (progreso, despensa, resultados de quiz, suscripción) viven en tablas separadas, protegidas con Row Level Security (RLS)
- Las relaciones técnica↔receta son explícitas y a nivel de paso, no solo a nivel de receta completa, para soportar el cross-link (RF-07b)
- **La cuenta es opcional**: navegar contenido free no requiere fila en `perfiles`. Esto implica que `progreso_lecciones` puede no existir para un usuario anónimo — el frontend debe manejar progreso no persistido (ej. en estado local) para usuarios sin sesión, y ofrecer migrar ese progreso si el usuario se registra después

---

## 1. Contenido — Módulos y técnicas

### `modulos`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| numero | int | orden de visualización (1-10) |
| nombre | text | ej. "Fundamentos" |
| slug | text (unique) | para URLs |
| descripcion | text | |
| es_premium | boolean | false para todos según decisión actual |

### `lecciones`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| modulo_id | uuid (FK → modulos) | |
| numero | numeric | orden dentro del módulo (ej. 1.1, 1.2) |
| titulo | text | |
| slug | text (unique) | |
| contenido | jsonb | **bloques estructurados** (ver detalle abajo) |
| imagen_url | text | opcional, imagen de portada de la lección |
| video_url | text | opcional |
| tiene_quiz | boolean | |

**Estructura de `contenido` (bloques):** un array de objetos, cada uno con `tipo` y su data específica. Esto permite que el frontend renderice cada bloque con su propio componente visual, en vez de un solo bloque de texto plano.

```json
[
  { "tipo": "parrafo", "texto": "..." },
  { "tipo": "imagen", "url": "...", "caption": "..." },
  { "tipo": "tip", "titulo": "Pro tip", "texto": "..." },
  { "tipo": "tabla", "titulo": "...", "columnas": ["..."], "filas": [["..."]] },
  { "tipo": "video", "url": "..." }
]
```

Tipos de bloque iniciales sugeridos: `parrafo`, `imagen`, `tip` (caja destacada), `tabla`, `video`, `lista`.

> Las tablas de referencia (temperaturas, tiempos, etc.) viven directamente como bloques `tipo: "tabla"` dentro de `contenido` — no existe una tabla separada en la base de datos para esto, se descartó por simplicidad.

---

## 2. Recetas

### `recetas`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| titulo | text | |
| slug | text (unique) | |
| descripcion | text | |
| imagen_url | text | |
| tiempo_preparacion_min | int | |
| dificultad | enum('facil','media','dificil') | |
| porciones | int | |
| modulo_id | uuid (FK → modulos) | ej. Módulo 6, 7, 9 |

### `receta_pasos`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| receta_id | uuid (FK → recetas) | |
| numero_paso | int | |
| instruccion | text | |
| tecnica_id | uuid (FK → lecciones, nullable) | **cross-link directo a la lección de técnica usada en este paso (RF-07b)** |

### `ingredientes`
Catálogo maestro de ingredientes (para matching de despensa). **Crece automáticamente**: no se precarga un catálogo extenso — se puebla a medida que se cargan recetas. Al crear una receta, si un ingrediente no existe en la tabla, se crea en el mismo flujo (evitando duplicados por nombre normalizado).
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| nombre | text (unique) | ej. "pollo", "cebolla" — **normalizado sin tildes y siempre en singular** (ej. "Cebollas" y "cebolla" se guardan ambas como "cebolla"), para evitar duplicados |
| categoria | text | ej. "proteína", "verdura", "lácteo" |
| creado_desde_receta_id | uuid (FK → recetas, nullable) | referencia de trazabilidad: qué receta originó este ingrediente en el catálogo |

### `receta_ingredientes`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| receta_id | uuid (FK → recetas) | |
| ingrediente_id | uuid (FK → ingredientes) | |
| cantidad | numeric | |
| unidad | text | ej. "g", "ml", "unidad" |

### `tags_dieta`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| nombre | text (unique) | vegetariano, vegano, keto, apto_diabetes, sin_gluten, etc. |

### `receta_tags_dieta`
Relación muchos-a-muchos
| Campo | Tipo | Notas |
|---|---|---|
| receta_id | uuid (FK → recetas) | |
| tag_id | uuid (FK → tags_dieta) | |

---

## 3. Tips por ingrediente

### `tips_ingrediente`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| ingrediente_id | uuid (FK → ingredientes) | |
| titulo | text | ej. "Cortes de pollo" |
| contenido | text/jsonb | |

---

## 4. Usuarios y cuentas

> Autenticación gestionada por Supabase Auth — esta tabla extiende el usuario base que Supabase ya provee (`auth.users`)

### `perfiles`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK, FK → auth.users) | |
| nombre | text | |
| plan | enum('free','premium') | |
| fecha_registro | timestamp | |

### `suscripciones`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| usuario_id | uuid (FK → perfiles) | |
| estado | enum('activa','vencida','cancelada') | |
| proveedor_pago | text | Stripe / Mercado Pago |
| id_externo | text | ID de la suscripción en la pasarela |
| fecha_inicio | timestamp | |
| fecha_renovacion | timestamp | |

### `usuario_preferencias_dieta`
| Campo | Tipo | Notas |
|---|---|---|
| usuario_id | uuid (FK → perfiles) | |
| tag_id | uuid (FK → tags_dieta) | |

---

## 5. Progreso (RLS: solo visible para el propio usuario)

### `progreso_lecciones`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| usuario_id | uuid (FK → perfiles) | |
| leccion_id | uuid (FK → lecciones) | |
| leido | boolean | marcado manual por el usuario ("Marcar como leída") |
| fecha_leido | timestamp | |
| aprobado | boolean | true si aprobó el quiz de la lección (requiere premium), puntaje >= 70% |
| mejor_calificacion | enum('aprobado','bien','muy_bien','excelente') nullable | mejor calificación obtenida entre todos los intentos |
| fecha_aprobado | timestamp | |

> El progreso de un módulo se calcula agregando esta tabla: % de lecciones con `leido = true` sobre el total. El estado `aprobado` es un segundo nivel, informativo, que solo aplica a usuarios premium — pero un usuario free debe poder **ver** en la UI que existe ese nivel superior ("Aprobá esta lección con el quiz — disponible en Premium"), como incentivo de conversión.

---

## 6. Quizzes (premium)

### `quiz_preguntas`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| leccion_id | uuid (FK → lecciones) | |
| pregunta | text | |
| opciones | jsonb | array de opciones |
| respuesta_correcta | text | |

### `quiz_intentos`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| usuario_id | uuid (FK → perfiles) | |
| leccion_id | uuid (FK → lecciones) | |
| puntaje | numeric | porcentaje (0-100) |
| calificacion | enum('no_aprobado','aprobado','bien','muy_bien','excelente') | derivada del puntaje: <70 no_aprobado, 70-79 aprobado, 80-89 bien, 90-99 muy_bien, 100 excelente |
| fecha | timestamp | |

### `quiz_intento_respuestas`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| intento_id | uuid (FK → quiz_intentos) | |
| pregunta_id | uuid (FK → quiz_preguntas) | |
| respuesta_dada | text | |
| es_correcta | boolean | |

---

## 7. Despensa y recomendador (premium)

### `usuario_despensa`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | |
| usuario_id | uuid (FK → perfiles) | |
| ingrediente_id | uuid (FK → ingredientes) | |
| fecha_agregado | timestamp | |

> El matching de recetas por despensa se resuelve en la capa de aplicación/API comparando `receta_ingredientes` contra `usuario_despensa`, no requiere tabla adicional — pero sí se beneficia de un índice sobre `receta_ingredientes.ingrediente_id`

---

## 8. Índices recomendados (rendimiento, RNF-01)

- `lecciones(slug)`, `recetas(slug)` — para lookups directos por URL
- `receta_ingredientes(ingrediente_id)` — clave para el recomendador premium
- `receta_pasos(tecnica_id)` — para resolver cross-links rápido
- `progreso_lecciones(usuario_id)`, `quiz_intentos(usuario_id)` — consultas de perfil de usuario

---

## 9. Seguridad a nivel de datos (RNF-10)

| Tabla | Política RLS |
|---|---|
| `modulos`, `lecciones`, `recetas`, `receta_pasos`, `ingredientes`, `tips_ingrediente` | Lectura pública, sin restricción (contenido free) |
| `perfiles`, `suscripciones`, `progreso_lecciones`, `usuario_despensa`, `quiz_intentos`, `quiz_intento_respuestas` | Solo el propio usuario puede leer/escribir sus filas (`auth.uid() = usuario_id`) |
| `quiz_preguntas` | Lectura solo para usuarios con `plan = 'premium'` (verificado vía join a `perfiles`) |

---

## 10. Estado de notas abiertas

Sin pendientes — todas las decisiones de este esquema quedaron cerradas.
