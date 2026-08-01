# Guía de Estilo y Diseño — Kit-Chef
Versión 1.0

Esta guía define los lineamientos visuales para lograr un frontend "llamativo, dinámico y sencillo de usar" (RNF-14), manteniendo consistencia entre los 10 módulos y las distintas vistas.

---

## 1. Principios de diseño

- **Claridad antes que decoración**: cada elemento visual debe ayudar a entender el contenido (una técnica, un paso de receta), no competir con él
- **Progreso visible en todo momento**: el usuario siempre debe poder ver cuánto avanzó, sea en un módulo o en una receta
- **Cálido, no clínico**: siendo una app de cocina, la estética debe transmitir apetito y calidez, evitando el look "manual técnico aburrido" — esto es justamente lo que diferencia a la app del PDF original que la inspiró
- **Mobile-first**: la mayoría del uso real probablemente ocurra desde el celular en la cocina; el diseño se piensa primero para pantalla chica

---

## 2. Paleta de color (implementada)

Reemplaza la propuesta inicial de terracota/oliva/dorado/crema — en la revisión de diseño se descartó por parecer "IA genérica cálida" (crema plana + acento pastel). La dirección final se inspira en una cocina profesional (hierro curado, acero de mostrador, fichas de pedido) y ya está implementada en `src/app/globals.css`.

| Token | Hex | Uso |
|---|---|---|
| `tinta` | `#1C1410` | Negro cálido — texto en modo claro, fondo en modo oscuro |
| `acero` | `#5B6670` | Gris-azulado frío — bordes, texto secundario, contrapeso frío |
| `pergamino` | `#EDE4D3` | Papel de carnicero — fondo en modo claro (no crema plana) |
| `brasa` | `#E3491B` | Ascua — único acento cálido, uso puntual (CTA, foco, links) |

**Escala de "punto de cocción"** (el propio medidor de progreso, no solo color decorativo — ver `PuntoCoccionDial`): `crudo #E8C9A0` → `a punto #D98A2B` → `dorado #B5501C` → `dominado #5C2A12`.

Ambos temas (claro/oscuro) están definidos como variables CSS y son intercambiables con el toggle del header — ver `:root[data-theme]` en `globals.css`.

---

## 3. Tipografía

- **Títulos:** una fuente con carácter (serif moderna o sans-serif con personalidad) para nombres de técnicas y recetas — refuerza la sensación editorial/premium del contenido
- **Cuerpo de texto:** sans-serif muy legible (ej. Inter, o similar), optimizada para lectura en pantalla, sobre todo en bloques largos de explicación técnica
- **Jerarquía clara:** máximo 3-4 niveles de tamaño (título de lección, subtítulo de sección, cuerpo, texto secundario/notas) — evitar más niveles, que generan ruido visual

---

## 4. Componentes clave

### Barra/anillo de progreso
- Presente en: dashboard de módulos, header de cada lección, resumen de quiz
- Debe distinguir visualmente los dos estados de completitud (leído vs. aprobado) — ej. relleno sólido para "leído", con un ícono/borde dorado adicional para "aprobado"

### Tarjeta de módulo
- Ícono o ilustración representativa del módulo
- Barra de progreso
- Cantidad de lecciones completadas / total

### Bloques de lección (según los tipos definidos en el esquema de datos)
- `parrafo`: tipografía de cuerpo estándar
- `tip`: caja destacada con color de acento, ícono distintivo (ej. estrella o bombilla)
- `tabla`: diseño limpio, con scroll horizontal en mobile si es necesario
- `imagen`: con caption opcional, bordes redondeados consistentes con el resto de la UI
- `video`: reproductor embebido, thumbnail atractivo antes de reproducir

### Cross-link técnica↔receta (RF-07b)
- Dentro de un paso de receta, la técnica mencionada debe ser un enlace visualmente distinguible (ej. subrayado punteado + color de acento), no un link azul genérico de navegador
- Al tocarlo: preferentemente abre en un panel lateral/modal (no navega fuera de la receta), para no perder el contexto de lo que se estaba cocinando

### Tarjeta de receta
- Imagen destacada, tiempo de preparación, dificultad, tags de dieta como chips/badges
- Indicador visual si "matchea" con la despensa del usuario (premium)

### Quiz
- Progreso de pregunta actual (ej. "3 de 12")
- Feedback inmediato con microanimación (correcto = check verde con transición suave; incorrecto = mostrar la respuesta correcta sin ser punitivo en el tono)
- Pantalla de resumen final con la calificación (aprobado/bien/muy bien/excelente) representada visualmente, no solo como texto — ej. medallas o niveles

---

## 5. Interacción y dinamismo (RNF-14)

- Transiciones suaves entre lecciones (no recargas de página abruptas — aprovechar que es una web app con Next.js para navegación fluida tipo SPA)
- Microanimaciones en: completar una lección, aprobar un quiz, agregar un ingrediente a la despensa
- Estados de carga con skeletons (placeholders animados), nunca solo un spinner genérico, para mantener la sensación de app pulida
- Evitar animaciones excesivas o que retrasen la lectura — el dinamismo acompaña el contenido, no lo demora

---

## 6. Accesibilidad y compatibilidad

- Contraste de color suficiente (mínimo AA de WCAG) entre texto y fondo, incluso dentro de la paleta cálida elegida
- Toda la interfaz navegable por teclado (importante también para compatibilidad cross-browser, RNF-14b)
- Tamaños de touch target adecuados para mobile (mínimo 44x44px) en botones y links, especialmente en los cross-links dentro de recetas

---

## 7. Contenido visual: fotografía real (decisión tomada)

Se usará **fotografía real de comida** en toda la app — técnicas, recetas y tips por ingrediente. Esto refuerza la sensación de apetito y calidad que buscamos frente a un manual técnico ilustrado, pero tiene una implicancia directa sobre la prioridad de **minimizar inversión** definida al inicio del proyecto:

**Opciones de bajo costo para conseguir las fotos:**
- **Fotografía propia**: con un celular moderno y luz natural se puede lograr un resultado decente, sobre todo para el contenido de Módulo 1-3 donde son fotos de proceso (cortes, sellado, etc.) más que de "food styling" elaborado
- **Bancos de imágenes gratuitos** (Unsplash, Pexels) para contenido genérico de ingredientes crudos o técnicas comunes — cuidado con no usar la misma imagen que usan miles de otros sitios, afecta la percepción de marca propia
- **Contratar fotografía puntual** solo para las piezas más importantes (portadas de módulo, recetas insignia) y usar fotografía propia/banco para el resto — así se reparte el costo en vez de fotografiar las +100 piezas de contenido con un fotógrafo profesional

**Recomendación:** empezar con fotografía propia + bancos gratuitos para el MVP (bajo costo, más trabajo — consistente con tu prioridad), y evaluar invertir en fotografía profesional más adelante para las piezas de mayor tráfico, una vez que haya validación de que la app tiene tracción.

## 8. Tipografía definida

- **Títulos** (nombres de técnicas, recetas, encabezados de módulo): **Fraunces** (serif variable) — aporta el carácter editorial/artesanal que buscamos, sin caer en lo clásico-aburrido
- **Cuerpo de texto y UI** (párrafos, botones, badges): **Inter** — máxima legibilidad en pantalla, con variedad de pesos para cubrir toda la jerarquía definida en la sección 3

Ambas son gratuitas (Google Fonts) e integrables directo vía `next/font` en Next.js, sin costo ni licencias adicionales — consistente con la prioridad de bajo costo del proyecto.