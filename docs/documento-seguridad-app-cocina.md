# Documento de Seguridad — Kit-Chef
Versión 1.0

Este documento detalla cómo se implementan los requisitos no funcionales de seguridad (RNF-06 a RNF-11 del PRD) y establece una checklist de buenas prácticas antes del lanzamiento.

---

## 1. Autenticación y gestión de sesiones

- **Proveedor:** Supabase Auth (no se implementa manejo propio de contraseñas ni de sesiones)
- Contraseñas nunca tocan el backend propio en texto plano — el hashing y almacenamiento seguro lo maneja Supabase (bcrypt)
- Tokens JWT con expiración corta + refresh token, gestionados por el SDK de Supabase
- Login social (opcional, RF-11) vía OAuth estándar (Google, u otro) delegado también a Supabase Auth
- **RNF-06 cubierto:** ninguna credencial se maneja fuera de un proveedor auditado

### Recuperación de contraseña
- Flujo estándar de "olvidé mi contraseña" vía email, gestionado por Supabase Auth
- Enlaces de recuperación con expiración corta (1 hora)

---

## 2. Autorización y control de acceso

- **Row Level Security (RLS)** activado en Postgres para todas las tablas de datos por usuario (`perfiles`, `suscripciones`, `progreso_lecciones`, `usuario_despensa`, `quiz_intentos`, `quiz_intento_respuestas`)
- Política base: `auth.uid() = usuario_id` — un usuario solo puede leer/escribir sus propias filas
- Tablas de contenido (`modulos`, `lecciones`, `recetas`, etc.) con RLS de solo lectura pública, sin excepción de escritura desde el cliente (la carga de contenido se hace vía rol de servicio, no desde el frontend)
- **Verificación de plan premium se hace siempre en el backend**, nunca confiando en el estado que muestra el frontend (evita que alguien fuerce acceso a rutas premium editando el cliente)
- **RNF-10 cubierto**

---

## 3. Seguridad de pagos

- Ningún dato de tarjeta o medio de pago toca el backend propio en ningún momento — el checkout se resuelve enteramente en la pasarela (Stripe/Mercado Pago), certificada PCI-DSS
- El backend solo recibe: confirmaciones vía webhook, IDs de suscripción externos, y estados (activa/vencida/cancelada)
- **Validación de firma del webhook obligatoria** antes de procesar cualquier evento de pago — sin esto, cualquiera podría simular un pago exitoso enviando una request falsa al endpoint
- **RNF-07 cubierto**

---

## 4. Transporte y comunicación

- HTTPS obligatorio en todo el sitio (forzado por el hosting — Vercel lo provee por defecto, sin configuración adicional)
- HSTS habilitado para prevenir downgrade a HTTP
- **RNF-08 cubierto**

---

## 5. Validación de inputs

- Validación en el **frontend** (UX: feedback inmediato) y en el **backend** (seguridad real — el frontend nunca es la línea de defensa, puede saltearse)
- Uso de una librería de validación de esquemas (ej. Zod) en cada endpoint de la API para tipar y validar el body de las requests antes de tocar la base de datos
- Sanitización de cualquier input que se use en búsquedas de texto (endpoint `?busqueda=`) para prevenir inyección
- Uso de queries parametrizadas/ORM (nunca concatenación de strings SQL) — esto es estándar en Supabase client y previene SQL injection por diseño
- **RNF-09 cubierto**

---

## 6. Rate limiting

Aplicado especialmente en:
- Endpoints de autenticación (login, registro, recuperación de contraseña) — previene fuerza bruta
- `GET /api/v1/recetas/recomendadas` (motor premium) — previene abuso de un endpoint más costoso computacionalmente
- Implementación sugerida: middleware de rate limiting por IP + por usuario autenticado (ej. Upstash Ratelimit, integra bien con Vercel)
- **RNF-11 cubierto**

---

## 7. Checklist de buenas prácticas (pre-lanzamiento)

- [ ] Variables sensibles (claves de API, secretos) solo en variables de entorno, nunca en el código fuente ni en el repositorio
- [ ] `.env` en `.gitignore` desde el primer commit
- [ ] CORS configurado restrictivamente (solo el dominio propio, no `*`)
- [ ] Headers de seguridad configurados (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options)
- [ ] Dependencias del proyecto auditadas (`npm audit`) antes de cada release
- [ ] Logs de errores sin exponer información sensible (nunca loguear tokens, contraseñas, datos de pago)
- [ ] Backups automáticos de la base de datos (Supabase los provee, verificar frecuencia y retención)
- [ ] Revisión de permisos: rol de servicio (service role key) de Supabase usado solo en el backend, nunca expuesto al cliente
- [ ] Prueba de que un usuario free no puede acceder a endpoints/datos premium manipulando el request directamente (no solo ocultando el botón en el frontend)
- [ ] Prueba de que un usuario no puede leer/modificar datos de otro usuario (verificación manual de RLS)

---

## 8. Fuera de alcance para el MVP

- Autenticación de dos factores (2FA) — se evalúa para una fase posterior, no bloquea el lanzamiento
- Auditoría de seguridad externa/pentest formal — recomendable antes de escalar fuerte, no imprescindible para el MVP inicial
