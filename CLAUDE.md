# Kit-Chef — Contexto del proyecto para Claude Code

Este archivo se lee automáticamente al abrir el proyecto. Contiene el contexto completo de decisiones ya tomadas — no las reabras salvo que el usuario lo pida explícitamente.

## Qué es
Kit-Chef: web app freemium de cocina enfocada en enseñar **técnicas antes que recetas** (pedagogía como diferencial). Mercado objetivo: Chile/Latinoamérica, contenido en español.

## Documentación completa
Ver carpeta `docs/`:
- `PRD-app-cocina.md` — producto, alcance, requisitos funcionales y no funcionales
- `esquema-base-datos-app-cocina.md` — modelo de datos completo (Postgres/Supabase)
- `especificacion-api-app-cocina.md` — todos los endpoints REST
- `documento-seguridad-app-cocina.md` — implementación de seguridad y checklist
- `guia-estilo-diseno-app-cocina.md` — paleta, tipografía, componentes
- `roadmap-app-cocina.md` — fases del proyecto
- `backlog-app-cocina.md` — tareas priorizadas (P0/P1/P2) por fase

## Stack técnico (decisión ya tomada, no reabrir)
- Frontend: Next.js (React)
- Backend: Next.js API routes
- Base de datos: Supabase (Postgres) — incluye Auth y RLS
- Hosting: Vercel (frontend) + Supabase (backend/DB)
- Pagos: Stripe o Mercado Pago
- Prioridad de negocio: **minimizar inversión económica, aunque implique más tiempo/trabajo** — preferir free tiers y servicios auditados antes que soluciones custom

## Decisiones de producto clave (no reabrir sin pedido explícito)
- Todo el contenido educativo (los 10 módulos) es de **libre acceso**, sin cuenta requerida
- Premium = solo interactividad: quizzes gamificados + recomendador de recetas por despensa
- Cuenta de usuario **opcional**: progreso se guarda local (localStorage) si no hay sesión, se migra al registrarse
- Una lección tiene dos estados: "leído" (manual, free) y "aprobado" (quiz, premium)
- Quizzes: 10+ preguntas, feedback inmediato + resumen final, intentos ilimitados, calificación por rango (70% aprobado, 80% bien, 90% muy bien, 100% excelente)
- Cross-link obligatorio: cada paso de receta que usa una técnica debe enlazar directo a esa lección específica (no al índice general)
- Contenido de lecciones se guarda en bloques estructurados (jsonb), no markdown plano
- Catálogo de ingredientes crece automáticamente al cargar recetas (sin tildes, singular, para evitar duplicados)
- Paginación de listados: por cursor, no offset
- Contenido visual: fotografía real (no ilustraciones) — priorizar fotografía propia y bancos gratuitos en el MVP por costo
- Compatibilidad requerida: Chrome, Firefox, Safari (últimas 2 versiones de cada uno)
- Debe soportar miles de usuarios concurrentes (arquitectura serverless ya contempla esto)

## Convenciones de nomenclatura
- Nombres de tablas y campos en español (ej. `recetas`, `usuario_despensa`), siguiendo el esquema de `esquema-base-datos-app-cocina.md`
- Todo el contenido de usuario final (UI, copy) en español, tono chileno/latinoamericano — no traducir literal de fuentes en inglés

## Qué NO está en el alcance del MVP
App móvil nativa, funciones sociales, contenido en video propio, recomendador con IA/LLM, múltiples idiomas, 2FA, pentest externo.

## Al trabajar en este proyecto
- Antes de proponer una decisión de arquitectura o producto nueva, revisar si ya está resuelta en `docs/` — la mayoría de las decisiones de negocio ya están cerradas
- Seguir el checklist de seguridad en `documento-seguridad-app-cocina.md` antes de cualquier feature que toque autenticación, pagos o datos de usuario
- Seguir el orden de fases del `roadmap-app-cocina.md` y las prioridades P0/P1/P2 del `backlog-app-cocina.md`
