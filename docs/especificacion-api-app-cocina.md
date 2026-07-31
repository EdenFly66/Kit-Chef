# Especificación de API — Kit-Chef
Versión 1.0 · REST sobre Next.js API routes (o equivalente) + Supabase

---

## Principios generales

- **Autenticación:** JWT emitido por Supabase Auth. Endpoints públicos no requieren token; endpoints de usuario/premium lo requieren en header `Authorization: Bearer <token>`
- **Formato:** JSON en request/response
- **Errores:** formato consistente `{ "error": { "codigo": "...", "mensaje": "..." } }` con status HTTP correspondiente
- **Rate limiting:** aplicado especialmente en endpoints de autenticación y en el recomendador premium (RNF-11)
- **Versionado:** prefijo `/api/v1/` desde el día uno, para no romper clientes si la API evoluciona

---

## 1. Contenido público (sin autenticación)

### `GET /api/v1/modulos`
Lista todos los módulos con su info básica.
- Respuesta: array de `{ id, numero, nombre, slug, descripcion }`

### `GET /api/v1/modulos/:slug`
Detalle de un módulo con sus lecciones (resumen, sin contenido completo).
- Respuesta: `{ modulo: {...}, lecciones: [{ id, numero, titulo, slug, tiene_quiz }] }`

### `GET /api/v1/lecciones/:slug`
Contenido completo de una lección (bloques jsonb).
- Respuesta: `{ id, titulo, contenido: [...bloques], imagen_url, video_url, tiene_quiz, modulo: {...} }`

### `GET /api/v1/recetas`
Lista de recetas con filtros vía query params, paginada por cursor.
- Query params: `?dieta=vegano&dificultad=facil&busqueda=pollo&modulo=6&cursor=<id_ultima_receta>&limite=20`
- Respuesta: `{ recetas: [{ id, titulo, slug, imagen_url, tiempo_preparacion_min, dificultad, tags_dieta }], siguiente_cursor: "..." }`

### `GET /api/v1/recetas/:slug`
Detalle completo de una receta.
- Respuesta: `{ receta: {...}, ingredientes: [...], pasos: [{ numero_paso, instruccion, tecnica: { id, titulo, slug } }], tags_dieta: [...] }`
- **Nota:** cada paso trae la técnica relacionada ya resuelta (join), para que el frontend arme el cross-link (RF-07b) sin una segunda consulta

### `GET /api/v1/ingredientes/:id/tips`
Tips asociados a un ingrediente.
- Respuesta: array de `{ titulo, contenido }`

### `GET /api/v1/tags-dieta`
Catálogo de tags de dieta disponibles (para poblar filtros en el frontend).

---

## 2. Autenticación (delegada a Supabase Auth)

No se reimplementa — se usa el SDK de Supabase Auth directo desde el frontend para:
- `signUp`, `signIn`, `signOut`, `resetPassword`

La API propia solo interviene **después** de la autenticación, para completar el perfil:

### `POST /api/v1/perfil` *(requiere token)*
Crea el perfil asociado al usuario recién registrado.
- Body: `{ nombre }`
- Respuesta: `{ id, nombre, plan: "free", fecha_registro }`

### `GET /api/v1/perfil` *(requiere token)*
Devuelve el perfil del usuario autenticado, incluyendo plan y preferencias de dieta.

### `PATCH /api/v1/perfil` *(requiere token)*
Actualiza nombre o preferencias de dieta.

---

## 3. Progreso *(requiere token)*

### `GET /api/v1/progreso`
Progreso del usuario, agrupado por módulo.
- Respuesta: `{ modulos: [{ modulo_id, total_lecciones, lecciones_leidas, lecciones_aprobadas, porcentaje }] }`

### `POST /api/v1/progreso/:leccion_id/leido`
Marca una lección como leída (RF-04b). Disponible para cualquier usuario autenticado (free o premium).
- Respuesta: `{ leccion_id, leido: true, fecha_leido }`

### `POST /api/v1/progreso/migrar` *(requiere token)*
Migra progreso guardado localmente (usuario que navegó anónimo y luego se registró) hacia la cuenta.
- Body: `{ lecciones_leidas: [leccion_id, ...] }`
- Ver nota de UX en el esquema de base de datos sobre progreso anónimo

---

## 4. Quizzes *(requiere token + plan premium)*

### `GET /api/v1/lecciones/:id/quiz`
Devuelve las preguntas del quiz (sin la respuesta correcta expuesta).
- Respuesta: `{ preguntas: [{ id, pregunta, opciones }] }`
- Si el usuario no es premium → `403` con código `PREMIUM_REQUERIDO`

### `POST /api/v1/lecciones/:id/quiz/intentos`
Envía las respuestas de un intento completo.
- Body: `{ respuestas: [{ pregunta_id, respuesta_dada }] }`
- Respuesta: `{ puntaje, calificacion, resumen: [{ pregunta_id, es_correcta, respuesta_correcta }] }`
- **Sistema de calificación por rango** (no solo aprobado/reprobado):
  - 70%-79% → `aprobado`
  - 80%-89% → `bien`
  - 90%-99% → `muy_bien`
  - 100% → `excelente`
  - menos de 70% → `no_aprobado` (no bloquea reintentos, ya ilimitados)
- Efecto secundario: si `puntaje >= 70`, marca `progreso_lecciones.aprobado = true` y guarda la mejor `calificacion` obtenida

### `GET /api/v1/lecciones/:id/quiz/intentos`
Historial de intentos del usuario para esa lección.

---

## 5. Despensa y recomendador *(requiere token + plan premium)*

### `GET /api/v1/despensa`
Lista los ingredientes actuales en la despensa del usuario.

### `POST /api/v1/despensa`
Agrega uno o más ingredientes.
- Body: `{ ingredientes: ["pollo", "cebolla", "arroz"] }`
- Si un ingrediente no existe en el catálogo, se crea automáticamente (según decisión de catálogo con crecimiento automático)

### `DELETE /api/v1/despensa/:ingrediente_id`
Elimina un ingrediente de la despensa.

### `GET /api/v1/recetas/recomendadas`
Motor de recomendación: recetas que matchean total o parcialmente con la despensa del usuario.
- Query params opcionales: `?tiempo_max=30&dificultad=facil&dieta=vegano`
- Respuesta: array de recetas ordenadas por % de ingredientes que coinciden, con el detalle de qué ingredientes faltan
- **Rate limiting aplicado** (RNF-11)

---

## 6. Suscripción / Pagos *(requiere token)*

### `POST /api/v1/suscripcion/checkout`
Crea una sesión de pago con la pasarela (Stripe/Mercado Pago) y devuelve la URL de checkout.

### `POST /api/v1/webhooks/pago` *(sin autenticación de usuario, validado por firma del proveedor)*
Webhook que recibe confirmaciones de pago/renovación/cancelación desde la pasarela, y actualiza `suscripciones` y `perfiles.plan`.

### `GET /api/v1/suscripcion`
Estado actual de la suscripción del usuario.

### `POST /api/v1/suscripcion/cancelar`
Cancela la renovación automática (mantiene acceso hasta el fin del período pagado).

---

## 7. Notas de seguridad aplicadas a la API

- Todos los endpoints bajo "requiere token" validan el JWT en cada request — no hay sesiones basadas en cookies propias
- Los endpoints premium validan el plan del usuario **en el backend**, nunca confiando solo en lo que el frontend muestra u oculta
- El webhook de pagos valida la firma criptográfica del proveedor antes de procesar cualquier cambio de estado
- Ningún endpoint propio maneja ni almacena datos de tarjetas — eso ocurre enteramente en la pasarela (RNF-07)

---

## 8. Estado de notas abiertas

Sin pendientes — todas las decisiones de esta especificación quedaron cerradas.
