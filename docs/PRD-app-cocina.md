# PRD — Kit-Chef
**Documento de Requisitos de Producto**
Versión 1.0

---

## 1. Resumen ejecutivo

**Qué es:** **Kit-Chef** — juego de palabras entre "kit", "kitchen" y "chef", ya que la app entrega un kit de herramientas y habilidades para la cocina — es una web app freemium enfocada en enseñar **técnicas de cocina y pastelería** como eje pedagógico principal, antes que recetas sueltas. La receta es la aplicación práctica de la técnica, no el punto de partida.

**Problema que resuelve:** la mayoría de apps y sitios de cocina entregan recetas aisladas sin explicar el "por qué" detrás de cada paso. Esto deja al usuario dependiente de seguir instrucciones al pie de la letra, sin capacidad de improvisar o adaptar cuando falta un ingrediente o cambia el contexto.

**Propuesta de valor:**
- Pedagogía de técnicas primero, recetas después — diferencial frente a la competencia
- Contenido adaptado al mercado chileno/latinoamericano (ingredientes, medidas, ejemplos, tono)
- Modelo freemium: contenido educativo gratuito + recomendador de recetas premium según ingredientes disponibles en casa
- Tips específicos por ingrediente (pollo, carne, cerdo, etc.)
- Recetas tageadas por dieta (vegetariano, vegano, keto, apto para diabéticos, etc.)

**Prioridades del proyecto:**
- Minimizar inversión económica, aunque implique más tiempo/trabajo de desarrollo
- Frontend atractivo, dinámico y sencillo de usar
- Seguridad robusta (autenticación, datos, pagos)
- Capacidad de escalar a miles de usuarios concurrentes sin rediseñar arquitectura

---

## 2. Usuarios objetivo

**Perfil primario:** personas en Chile/Latinoamérica que quieren aprender a cocinar desde los fundamentos, no solo replicar recetas. Rango amplio: desde quien recién se independiza hasta quien cocina hace años pero quiere entender el "por qué".

**Perfil secundario:** personas con restricciones alimentarias (vegetarianos, veganos, diabéticos, etc.) que buscan recetas filtradas y confiables.

**Casos de uso principales:**
1. "Quiero aprender a cocinar desde cero, sin saber nada de técnica"
2. "Sé cocinar, pero quiero entender mejor por qué hago las cosas como las hago"
3. "Tengo estos ingredientes en la casa, ¿qué puedo cocinar?" (premium)
4. "Necesito recetas que cumplan con mi dieta/restricción"
5. "Quiero aprender panadería/pastelería desde los fundamentos (masa madre, etc.)"

---

## 3. Alcance funcional

**Principio rector:** toda la información y contenido educativo (los 10 módulos completos, incluyendo Ensaladas y Panadería) es de **libre acceso**. Lo que se monetiza es la interactividad avanzada, no el conocimiento.

### Plan Free
- Acceso completo a **todos los módulos de contenido** (1 a 10): técnicas, recetas técnica, tips por ingrediente, panadería/pastelería, ensaladas, conservación
- Navegación por módulos con progreso guardado
- Búsqueda y filtro básico de recetas por nombre, categoría y tag de dieta

### Plan Premium
- Todo lo del plan Free
- **Gamificación**: quizzes de autoevaluación por módulo/lección, con seguimiento de resultados
- **Recomendador de recetas según ingredientes disponibles en casa** (despensa del usuario)
- Filtros avanzados combinando despensa + tiempo disponible + nivel de dificultad + dieta
- Listas de compra automáticas generadas desde recetas

---

## 4. Estructura de contenido (módulos)

| Módulo | Contenido | Plan |
|---|---|---|
| 1. Fundamentos | Cuchillo, cortes, limpieza, sal, grasas, ácidos, umami, balance | Free |
| 2. Calor y técnicas | 4 cuadrantes de calor, dorado, hervido/blanqueado, braseado, salteado, asado | Free |
| 3. Precisión | Termómetro, puntos de cocción, carryover | Free |
| 4. Sabor y creatividad | Mapa de sabores regional, sustituciones, improvisación | Free |
| 5. Ensaladas | Tipos, componentes, sabores, aderezos, construcción | Free |
| 6. Recetas técnica | Huevos, sellado + salsa, otras a definir | Free |
| 7. Panadería y pastelería | Masa madre, fermentación, técnicas, equipo, diagnóstico | Free |
| 8. Tips por ingrediente | Pollo, carne, cerdo, pescados/mariscos, otros | Free |
| 9. Recetas guiadas | Recetas tageadas + recomendador "qué tengo en casa" | Premium |
| 10. Conservación y almacenamiento | Transversal, vinculado a recetas y técnicas | Free |

---

## 5. Requisitos funcionales

### 5.1 Navegación y progreso
- RF-01: El usuario puede navegar por módulos desde una pantalla principal tipo dashboard
- RF-02: Cada módulo muestra progreso visual (% completado, insignias)
- RF-03: El progreso se guarda por usuario autenticado
- RF-04: El usuario puede retomar donde quedó
- RF-04b: Una lección tiene dos estados de completitud: **"leído"** (marcado manual por el usuario, disponible en free) y **"aprobado"** (requiere aprobar el quiz de la lección, exclusivo premium). El progreso del módulo se calcula sobre el estado "leído"
- RF-04c: Un usuario free debe poder visualizar que existe el nivel "aprobado" con quiz, como incentivo visible de upgrade a premium (sin poder tomarlo)

### 5.2 Contenido de técnicas
- RF-05: Cada lección se compone de bloques estructurados (párrafo, imagen, tip destacado, tabla, video, lista), permitiendo layouts ricos y consistentes en el frontend
- RF-06: Las lecciones pueden incluir bloques de tabla de referencia (temperaturas, tiempos) como parte de su contenido
- RF-07: Las recetas del Módulo 6 y 9 referencian técnicas relacionadas (cross-link)
- RF-07b: Todo uso de una técnica dentro de una receta debe incluir un enlace directo (cross-link) a la sección informativa de esa técnica específica, sin fricción de navegación adicional

### 5.3 Recetas
- RF-08: Cada receta tiene: ingredientes con cantidad, pasos, tags de dieta, técnicas relacionadas, tips de ingrediente relacionados
- RF-09: Búsqueda de recetas por nombre, categoría, tag de dieta
- RF-10: (Premium) El usuario ingresa ingredientes disponibles y el sistema sugiere recetas que matchean total o parcialmente

### 5.4 Usuarios y cuentas
- RF-11: Registro e inicio de sesión (email/contraseña + proveedor social opcional). **La cuenta es opcional**: todo el contenido free (módulos, técnicas, recetas) se navega sin necesidad de registro. Se solicita cuenta únicamente al intentar guardar progreso o acceder a funciones premium
- RF-12: Gestión de suscripción premium (alta, baja, estado)
- RF-13: Perfil de usuario con preferencias de dieta guardadas

### 5.5 Pagos
- RF-14: Integración con pasarela de pago (Stripe o Mercado Pago) para suscripción premium
- RF-15: Manejo de estados de pago (activo, vencido, cancelado)

### 5.6 Quizzes (premium)
- RF-16: Cada lección con quiz habilitado presenta 10 o más preguntas
- RF-17: Cada pregunta muestra feedback inmediato (correcto/incorrecto) al responder
- RF-18: Al finalizar el quiz se muestra un resumen con puntaje total
- RF-19: El usuario puede reintentar el quiz un número ilimitado de veces
- RF-20: El historial de resultados por intento se guarda asociado al usuario (para eventual seguimiento de progreso)

---

## 6. Requisitos no funcionales

### 6.1 Rendimiento
- RNF-01: Contenido estático (lecciones, recetas) debe cachearse para minimizar consultas a base de datos
- RNF-02: Tiempo de carga inicial menor a 3 segundos en conexión promedio

### 6.2 Escalabilidad
- RNF-03: La arquitectura debe soportar miles de usuarios concurrentes sin rediseño estructural
- RNF-04: Uso de hosting serverless (auto-escalable) y connection pooling en base de datos
- RNF-05: Separación de tráfico de lectura pública (contenido) vs. tráfico autenticado (progreso, recomendaciones)

### 6.3 Seguridad
- RNF-06: Autenticación gestionada por proveedor auditado (no manejo propio de contraseñas)
- RNF-07: Pagos procesados exclusivamente por pasarela certificada (PCI-DSS), sin almacenar datos de tarjetas
- RNF-08: HTTPS obligatorio en toda la aplicación
- RNF-09: Validación de inputs en frontend y backend
- RNF-10: Row Level Security (o equivalente) en base de datos para aislar datos por usuario
- RNF-11: Rate limiting en endpoints sensibles (recomendador premium, autenticación)

### 6.4 Usabilidad
- RNF-12: Navegación entendible sin tutorial, máximo 3 clics para llegar a cualquier contenido
- RNF-13: Diseño responsive (funcional en móvil y escritorio)
- RNF-14: Frontend visualmente atractivo y dinámico (animaciones de transición, progreso gamificado)
- RNF-14b: Compatibilidad total con Chrome, Firefox y Safari (última versión estable y una versión anterior de cada uno)

### 6.5 Costos
- RNF-15: Priorizar servicios con free tier funcional para fase inicial (MVP)
- RNF-16: Costos deben escalar con uso real, no con capacidad reservada anticipada

---

## 7. Métricas de éxito

- Usuarios registrados activos (mensual)
- Tasa de finalización de módulos (engagement con el contenido pedagógico)
- Tasa de conversión Free → Premium
- Retención a 30/60/90 días
- Uso del recomendador de recetas (frecuencia de uso premium)

---

## 8. Fuera de alcance (MVP)

- Aplicación móvil nativa (iOS/Android) — se prioriza web app responsive
- Funciones sociales (compartir, comentarios, seguir usuarios)
- Contenido en video propio (se contempla a futuro, no en MVP)
- Recomendador basado en IA/LLM (se usa matching por base de datos en MVP; IA queda como posible evolución)
- Múltiples idiomas (se lanza solo en español)

---

## 9. Riesgos y consideraciones abiertas

- Definir alcance exacto de contenido nuevo (pastelería, cortes, sustituciones, glosario regional) antes de fijar fecha de MVP
- **Formato de quizzes (definido):** 10+ preguntas por lección, feedback inmediato por pregunta (correcto/incorrecto) + resumen final con puntaje, intentos ilimitados
- Validar con usuarios reales si el orden pedagógico (técnica antes que receta) es intuitivo en la navegación, o si necesita una capa de onboarding
