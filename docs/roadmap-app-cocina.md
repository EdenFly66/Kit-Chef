# Roadmap — Kit-Chef
Versión 1.0 (revisado, con documentación técnica cerrada)

---

## Fase 0 — Documentación y preparación

**Completado en esta etapa de planificación:**
- [x] PRD (Documento de Requisitos de Producto)
- [x] Esquema de base de datos
- [x] Especificación de API
- [x] Documento de seguridad
- [x] Guía de estilo/diseño

**Pendiente antes de escribir la primera línea de código:**
- [ ] Setup de repositorio (monorepo Next.js) con estructura de carpetas definida
- [ ] Setup de proyecto Supabase (base de datos, Auth, Storage para imágenes)
- [ ] Configuración de entornos (desarrollo, staging, producción) y variables de entorno
- [ ] Setup de Vercel conectado al repositorio
- [ ] Definir catálogo tipográfico final (única nota abierta de la guía de estilo)
- [ ] Redactar el contenido completo de al menos el Módulo 1 (texto real, no placeholder) — necesario para probar el sistema de bloques jsonb con contenido real, no ficticio

**Duración estimada:** 2-3 semanas

---

## Fase 1 — MVP técnico (fundaciones)

**Objetivo:** una versión navegable end-to-end, aunque con poco contenido, que valide toda la arquitectura.

- [ ] Modelo de datos implementado en Supabase (todas las tablas del esquema)
- [ ] RLS configurado y probado (checklist de seguridad, punto por punto)
- [ ] Autenticación funcionando (registro, login, recuperación de contraseña) — con cuenta opcional implementada (progreso local + migración al registrarse)
- [ ] Endpoints públicos de contenido (`/modulos`, `/lecciones`, `/recetas`) funcionando
- [ ] Frontend: navegación por módulos, vista de lección con los bloques definidos (párrafo, imagen, tip, tabla, video)
- [ ] Módulo 1 completo cargado como contenido real
- [ ] Sistema de progreso ("leído") funcionando

**Duración estimada:** 6-8 semanas

---

## Fase 2 — Contenido core + cross-links

- [ ] Módulos 2, 3, 4, 8, 10 cargados (técnicas y tips por ingrediente)
- [ ] Módulo 6 (recetas técnica) y sistema de `receta_pasos` con cross-link a técnicas (RF-07b) funcionando de punta a punta
- [ ] Búsqueda y filtros de recetas (por dieta, dificultad, texto) con paginación por cursor
- [ ] Catálogo de ingredientes creciendo automáticamente desde la carga de recetas

**Duración estimada:** 8-10 semanas

---

## Fase 3 — Contenido extendido

- [ ] Módulo 5 (Ensaladas) completo
- [ ] Módulo 7 (Panadería/pastelería) completo
- [ ] Todo el contenido queda de libre acceso, según la decisión de negocio ya tomada

**Duración estimada:** 6-8 semanas (puede correr en paralelo a Fase 4, ya que es carga de contenido y no depende de nueva arquitectura)

---

## Fase 4 — Premium

- [ ] Integración de pasarela de pago (Stripe o Mercado Pago) + webhook validado
- [ ] Flujo de suscripción (checkout, cancelación, estados)
- [ ] Sistema de quizzes: banco de preguntas por lección, endpoint de intentos, sistema de calificación por rango (70/80/90/100)
- [ ] Despensa de usuario + motor de recomendación de recetas
- [ ] Rate limiting en endpoints premium
- [ ] UI de incentivo para usuarios free (ver el quiz bloqueado, ver el recomendador bloqueado)

**Duración estimada:** 5-7 semanas

---

## Fase 5 — Pulido y lanzamiento

- [ ] Checklist de seguridad completa (headers, CORS, auditoría de dependencias, backups)
- [ ] Pruebas de compatibilidad cross-browser (Chrome, Firefox, Safari)
- [ ] Pruebas de carga básicas (validar comportamiento con picos de tráfico simulados)
- [ ] Optimización de performance (caching de contenido estático, revisión de índices)
- [ ] Contenido visual: fotografía propia + banco de imágenes cargada en todos los módulos
- [ ] Lanzamiento

**Duración estimada:** 3-4 semanas

---

## Resumen de duración total estimada

~30-40 semanas (7-9 meses) trabajando de forma sostenida, consistente con la prioridad de **minimizar inversión económica aunque implique más tiempo**. Las fases 2 y 3 pueden solaparse parcialmente si hay más de una persona cargando contenido mientras se desarrolla.

---

## Fuera de alcance (recordatorio del PRD)

- App móvil nativa
- Funciones sociales
- Contenido en video propio
- Recomendador con IA/LLM
- Múltiples idiomas
- 2FA y pentest externo (quedan para después del lanzamiento)
