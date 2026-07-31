# Backlog Priorizado — Kit-Chef
Versión 1.0

Desglose accionable de cada fase del roadmap en tareas concretas, priorizadas dentro de cada fase. Formato: **P0** (bloqueante, sin esto no avanza la fase) / **P1** (importante, no bloqueante) / **P2** (deseable, puede correrse a la fase siguiente sin dolor).

---

## Fase 0 — Documentación y preparación

| Tarea | Prioridad |
|---|---|
| Setup de repositorio (estructura de carpetas Next.js) | P0 |
| Setup de proyecto Supabase (DB, Auth, Storage) | P0 |
| Configuración de entornos (dev/staging/producción) | P0 |
| Conectar Vercel al repositorio | P0 |
| Elegir tipografías finales | P1 |
| Redactar contenido completo del Módulo 1 | P0 (necesario para probar el sistema de bloques con datos reales) |

---

## Fase 1 — MVP técnico

| Tarea | Prioridad |
|---|---|
| Crear todas las tablas del esquema en Supabase | P0 |
| Configurar y probar políticas RLS | P0 |
| Implementar registro/login/recuperación (Supabase Auth) | P0 |
| Implementar navegación anónima + progreso local (localStorage) | P0 |
| Implementar migración de progreso local → cuenta al registrarse | P1 |
| Endpoint `GET /modulos` | P0 |
| Endpoint `GET /modulos/:slug` | P0 |
| Endpoint `GET /lecciones/:slug` | P0 |
| Frontend: dashboard de módulos con progreso visual | P0 |
| Frontend: vista de lección, renderizado de bloques (párrafo, imagen, tip, tabla, video) | P0 |
| Frontend: marcar lección como "leída" | P0 |
| Endpoint `POST /progreso/:leccion_id/leido` | P0 |
| Endpoint `GET /progreso` | P0 |
| Carga de contenido real del Módulo 1 en la base de datos | P0 |

---

## Fase 2 — Contenido core + cross-links

| Tarea | Prioridad |
|---|---|
| Redactar y cargar contenido Módulos 2, 3, 4 | P0 |
| Redactar y cargar contenido Módulo 8 (tips por ingrediente) | P0 |
| Redactar y cargar contenido Módulo 10 (conservación) | P1 |
| Redactar recetas técnica del Módulo 6 | P0 |
| Implementar `receta_pasos` con `tecnica_id` (cross-link) | P0 |
| Endpoint `GET /recetas` con filtros y paginación por cursor | P0 |
| Endpoint `GET /recetas/:slug` con pasos + técnicas resueltas | P0 |
| Frontend: tarjeta y detalle de receta | P0 |
| Frontend: cross-link visual técnica↔receta (panel lateral/modal) | P0 |
| Catálogo de ingredientes: lógica de creación automática al cargar receta | P0 |
| Endpoint `GET /ingredientes/:id/tips` | P1 |
| Endpoint `GET /tags-dieta` | P1 |
| Frontend: filtros de búsqueda de recetas (dieta, dificultad, texto) | P1 |

---

## Fase 3 — Contenido extendido

| Tarea | Prioridad |
|---|---|
| Redactar y cargar contenido Módulo 5 (Ensaladas) | P0 |
| Redactar y cargar contenido Módulo 7 (Panadería/pastelería) | P0 |
| Revisión editorial de todo el contenido (consistencia de tono chileno/latam) | P1 |

---

## Fase 4 — Premium

| Tarea | Prioridad |
|---|---|
| Integrar pasarela de pago (Stripe o Mercado Pago) | P0 |
| Endpoint `POST /suscripcion/checkout` | P0 |
| Endpoint `POST /webhooks/pago` con validación de firma | P0 |
| Endpoint `GET /suscripcion` y `POST /suscripcion/cancelar` | P0 |
| Banco de preguntas de quiz por lección (contenido) | P0 |
| Endpoint `GET /lecciones/:id/quiz` | P0 |
| Endpoint `POST /lecciones/:id/quiz/intentos` con sistema de calificación | P0 |
| Frontend: interfaz de quiz (progreso, feedback inmediato, resumen) | P0 |
| Frontend: estado "aprobado" visible en progreso de módulo | P1 |
| Endpoints de despensa (`GET/POST/DELETE /despensa`) | P0 |
| Endpoint `GET /recetas/recomendadas` (motor de matching) | P0 |
| Frontend: gestión de despensa del usuario | P0 |
| Frontend: listado de recetas recomendadas con % de match | P0 |
| Rate limiting en endpoints premium | P0 |
| Frontend: UI de incentivo para usuarios free (quiz/recomendador bloqueados) | P1 |
| Listas de compra automáticas desde recetas | P2 |

---

## Fase 5 — Pulido y lanzamiento

| Tarea | Prioridad |
|---|---|
| Checklist completa de seguridad (headers, CORS, auditoría de dependencias) | P0 |
| Configurar backups de base de datos | P0 |
| Pruebas cross-browser (Chrome, Firefox, Safari) | P0 |
| Pruebas de carga básicas | P1 |
| Revisión y optimización de caching de contenido estático | P0 |
| Revisión de índices de base de datos | P1 |
| Producción/curación de fotografía real (propia + banco de imágenes) | P0 |
| Microanimaciones y estados de carga (skeletons) | P1 |
| Revisión de accesibilidad (contraste, navegación por teclado) | P1 |
| Lanzamiento | — |

---

## Notas de uso de este backlog

- Las tareas **P0** de cada fase son las que definen si esa fase está "lista" — no se avanza a la siguiente fase sin completarlas
- Las **P1** se pueden dejar para el final de la fase o correrse a la siguiente si el tiempo aprieta
- Las **P2** son las primeras candidatas a recortar si hace falta acelerar el lanzamiento
