# SingluFest · Brand & UX Brief v2

> Documento maestro. Cualquier cambio de copy, layout o branding parte de aquí.
> Última actualización: 2026-05-06.

---

## 0. ADN — la frase que define todo

**SingluFest no es una feria celíaca. Es el primer festival foodie premium 100% Sin Gluten.**

Si una decisión de diseño, copy o funcional hace que la web parezca "guía nutricional", "asociación celíaca" o "stand de supermercado", está mal. Si la hace parecer **Champions Burger / Madrid Fusión / Primavera Sound, pero sin gluten**, está bien.

### Pilares
- **Estatus** · "comer sin miedo es un upgrade, no una limitación"
- **Inclusión radical** · el celíaco es el rey, no la excepción
- **Seguridad obsesiva** · protocolo 100% sin trazas como ventaja competitiva
- **Foodporn** · cada plano vertical pega un puñetazo

---

## 1. Sitemap

```
SingluFest
├── / (Home — funnel principal)
│   ├── Hero · vídeo full-bleed + CTA agresivo
│   ├── Marquee · "POR FIN · SIN MIEDO · SIN TRAZAS · …"
│   ├── Manifiesto · 3 frases que dejan k.o.
│   ├── Cartel (Line-up) · cabezas de cartel + emergentes
│   ├── Entradas · 3 tiers + countdown + scarcity
│   ├── Protocolo SingluFest · 5 sellos de seguridad
│   ├── Aftermovie · vídeo de la edición pasada (autoplay muted)
│   ├── Social Wall · grid de 9 reels en directo
│   ├── Partners Premium (logos KIMCAKES, Carmela…)
│   ├── FAQ · 6 preguntas duras
│   └── CTA final · "El paraíso existe y no tiene trazas. Reserva ya."
│
├── /cartel
│   ├── Listado completo de partners gastronómicos
│   ├── Filtros: dulce / salado / cervezas / brunch / heladería
│   └── Cada partner enlaza a /partner/[slug]
│
├── /partner/[slug]               # ficha individual (KIMCAKES, Carmela, …)
│   ├── Hero del partner (logo + portada hi-res)
│   ├── Manifiesto del partner (qué hacen y por qué)
│   ├── Reels embebidos
│   ├── Producto que llevan al festival
│   ├── Certificaciones / Sello SingluFest
│   └── CTA "Quiero probarlo en SingluFest"
│
├── /entradas
│   ├── Comparativa de tiers
│   ├── Bundles (entrada + merch)
│   ├── Add-ons (cata privada, mesa del chef, parking)
│   ├── Codes (early bird, refer-a-friend, prensa)
│   └── Checkout (Stripe + Apple Pay)
│
├── /manifiesto
│   └── Long-form: por qué rompemos las reglas del mercado celíaco
│
├── /protocolo
│   ├── 5 sellos visuales del protocolo SingluFest
│   ├── Auditorías y certificaciones (FACE, AOECS, ELISA)
│   ├── Formación obligatoria para personal y partners
│   └── Carta de compromiso (descargable PDF)
│
├── /b2b
│   ├── "¿Eres obrador o marca premium sin gluten?"
│   ├── Beneficios para partners
│   ├── Stats de la edición pasada (asistentes, ventas, prensa)
│   ├── Tiers de partnership
│   └── Form "Quiero ser partner" (Calendly + email)
│
├── /blog                         # autoridad SEO, drafts via agente IA
├── /blog/[slug]
│
├── /aftermovie                   # archivo de vídeos del evento
├── /prensa                       # dossier + descargables (logos, fotos)
├── /faq
├── /aviso-legal · /privacidad · /cookies
│
└── /admin (oculto, NextAuth)
    ├── Dashboard
    ├── Reservas / Tickets
    ├── Cartel (CRUD partners)
    ├── Posts
    ├── Patrocinadores
    ├── Agentes IA (redactor, analista, video-builder)
    └── Settings (incluye toggle preventa, countdowns, scarcity)
```

### Por qué ESTE sitemap (no más, no menos)

- **`/cartel` separado de `/partners`** porque el partner gastronómico es producto, no logo. Cada uno merece ficha individual con reels propios.
- **`/protocolo` como página entera** porque la seguridad es ventaja competitiva y SEO ("celíaco granada certificado", "festival sin trazas"…).
- **`/b2b` aparte** porque el ciclo de venta es totalmente distinto (Calendly + dossier, no carrito).
- Sin "/sobre nosotros" — el manifiesto es lo más cercano y va en la home.

---

## 2. Copywriting de la Home

### Hero (full-bleed, vídeo vertical 9:16 con autoplay muted, overlay degradado)

**Eyebrow** *(badge superior)*
> ⚡ GRANADA · 14-16 NOVIEMBRE 2026 · SOLD OUT EL AÑO PASADO

**H1** *(Almendra SC + Druk Wide)*
> El paraíso existe.
> *Y no tiene trazas.*

**Sub** *(Manrope, 18-22px)*
> El primer festival foodie 100% sin gluten.
> 70+ obradores premium, 20+ chefs en directo, 0 excusas.

**CTA primario** (pulse + sombra naranja brutal)
> 🎟️ QUIERO MI ENTRADA

**CTA secundario** (link sutil con flecha)
> ver el cartel completo →

**Microcopy bajo CTA**
> Last release · quedan 312 entradas

---

### Marquee de transición (tipografía masiva, scroll horizontal, naranja sobre negro)

> POR FIN · SIN MIEDO · SIN TRAZAS · EL ESTATUS DE COMER · POR FIN · SIN MIEDO · …

---

### Manifiesto

**H2**
> Llevamos 30 años pidiendo perdón por ser celíacos.
> *Se acabó.*

**Body** *(2 párrafos cortos, tipografía grande, lectura cómoda)*
> Mientras el mercado nos vendía pan que sabe a cartón en bolsas tristes con letras verdes,
> en otros países montaban festivales con chefs Michelin sin gluten. Aquí no.
>
> SingluFest es nuestra respuesta. Tres días en Granada con los **mejores obradores y chefs del país** cocinando para ti. Sin compromisos. Sin "ya he limpiado la sartén". Sin trazas. Aquí tú eres el rey.

**CTA final del bloque**
> Lee el manifiesto completo →

---

### Cartel (Line-up estilo festival musical)

**Eyebrow**
> CARTEL 2026

**H2**
> Cabezas de cartel.
> *Y los que pronto lo serán.*

**Disposición**
- Top tier (3 cabezas): logo enorme tipo "headliner". KIMCAKES, Carmela, *(tercer headliner)*.
- Mid tier: 6-8 partners con foto + nombre.
- Lower tier: nombres más pequeños tipo "festival lineup poster".

**CTA**
> Ver el cartel completo →

---

### Entradas (con scarcity en tiempo real)

**Eyebrow**
> ENTRADAS · LAST RELEASE

**H2**
> Quien tarda, paga doble.

**3 cards de tiers**:

| Tier | Precio | Incluye | Stock |
|------|--------|---------|-------|
| **GENERAL** | 18€ | Acceso al festival · acceso al mercado · 1 showcooking | "Quedan X" |
| **VIP** *(destacado)* | 49€ | Todo lo anterior + cata privada · mesa reservada · merch · acceso 1h antes | "Quedan Y" |
| **MESA DEL CHEF** | 149€ | Todo lo anterior + cena de 6 platos con chef invitado · botella firmada · meet & greet | "Solo 30" |

**CTA por card**
> COMPRAR — 18€

**Microcopy bajo entradas**
> El precio sube el viernes a las 23:59. Sin trampa, sin cartón.

---

### Protocolo SingluFest (visual, 5 sellos en grid)

**Eyebrow**
> SEGURIDAD

**H2**
> Cero trazas.
> *No es un eslogan. Es un protocolo auditado.*

**5 sellos en grid (icono + título + 1 línea)**:

1. **Cocina dedicada** — todos los obradores trabajan en líneas exclusivas sin gluten.
2. **Auditoría externa** — análisis ELISA aleatorios durante el evento.
3. **Formación obligatoria** — 100% del personal pasa el curso FACE antes de pisar el recinto.
4. **Trazabilidad** — cada plato lleva un QR con el lote y el responsable.
5. **Certificación AOECS** — partners verificados por la asociación europea de celiaquía.

**CTA**
> Descarga el protocolo (PDF) →

---

### Aftermovie

**Eyebrow**
> EDICIÓN 2025

**H2**
> Si no estuviste, esto te dolerá.

*(Vídeo grande horizontal 16:9, autoplay muted con botón sonido)*

**CTA**
> Ver galería completa →

---

### Social Wall

**Eyebrow**
> EN VIVO · #SINGLUFEST

**H2**
> El movimiento ya está en marcha.

*(Grid 3x3 de reels embebidos, autoplay sin sonido al hover)*

**CTA**
> Sigue @singlufest →

---

### Partners Premium (logos colaboradores B2B)

**Eyebrow**
> ELLOS HACEN POSIBLE EL FESTIVAL

*(Banda blanca con logos en grayscale, hover a color)*

**CTA**
> ¿Quieres ser partner? Hablemos →

---

### FAQ (6 preguntas, acordeón)

1. ¿Es 100% seguro para celíacos?
2. ¿Hay opciones para sensibles al gluten no celíacos? *(spoiler: sí, todo)*
3. ¿Puedo llevar a personas no celíacas?
4. ¿Hay opciones veganas / sin lactosa / sin frutos secos?
5. ¿Qué pasa si llueve? ¿Y si me pongo malo?
6. ¿Puedo devolver mi entrada?

---

### CTA final (sticky en mobile, full-bleed en desktop)

**H2**
> El paraíso existe y no tiene trazas.

**Sub**
> Tres días. Granada. Aforo limitado.

**CTA**
> 🎟️ QUIERO MI ENTRADA · 18€

**Línea de scarcity**
> 312 personas ya tienen la suya.

---

## 3. Look & Feel

### Filosofía visual

> "Si Champions Burger y un manuscrito iluminado de la Alhambra tuvieran un hijo en TikTok."

- Modo dominante: **Teatro oscuro foodporn** — fondo casi negro carbón, comida en primer plano hi-res, naranja del logo como spotlight.
- Modo descanso: **Papel cálido manifiesto** — para textos largos (manifiesto, protocolo, FAQ). Crema cálida + tinta cálida + naranja en titulares.
- Cambio de modo entre secciones genera ritmo cinematográfico (oscuro → claro → oscuro).

### Paleta

```
PRIMARIOS
─────────────────────────────────────
Carbón     #0B0807   ████  fondo teatro, texto sobre claro
Brasa      #14100C   ████  fondo alt teatro
Hueso      #FBF6EB   ████  fondo papel
Pergamino  #F4EAD7   ████  fondo papel alt

ACENTOS
─────────────────────────────────────
Naranja    #E85D1F   ████  el del logo · CTAs · headlines clave
Brasa-deep #C24412   ████  hover, contraste sobre claro
Limón      #F5C56B   ████  highlights pequeños (timers, badges scarcity)
Vino       #6B1D2E   ████  fondo VIP / mesa del chef

SEMÁNTICOS
─────────────────────────────────────
OK         #14784A   solo en panel admin (no en marketing)
Alerta     #C24412   "última hora", scarcity
Texto      #FBF6EB sobre teatro · #1B1209 sobre papel
```

**Prohibido**:
- Verdes "healthy" (#00B894, sage, mint…). Asociación instantánea con dieta aburrida.
- Pastel decorativo. Esto es alta gastronomía, no panadería de pueblo.
- Beige sin contraste. Si hay crema, es papel; si hay carbón, es teatro. Punto medio = muerte.

### Tipografía

```
DISPLAY HEADLINE (impacto poster)
─────────────────────────────────
Druk Wide Bold     — para H1 cartel, números de precios, KPIs
Anton              — alternativa gratuita Google si Druk no entra en presupuesto

DISPLAY ORNAMENTAL (alma de la marca)
─────────────────────────────────
Almendra SC        — eyebrows, badges, secciones, frase del logo
                     mantiene el guiño art-nouveau-andaluz del logo

SCRIPT (énfasis emocional)
─────────────────────────────────
Pirata One         — para cursivas en H1: "y no tiene trazas"
Caveat / Reenie Beanie — handwritten para anotaciones tipo "agotado"

BODY (legibilidad sin perder personalidad)
─────────────────────────────────
Söhne (de pago) o Inter (gratuita)
Tamaños base 18-20px, no 16. Estamos en 2026, no en 2014.
```

**Combos canónicos**:
- H1 hero: `Druk Wide Bold` + 1 palabra clave en `Pirata One` cursiva
- H2 secciones: `Almendra SC` ALL CAPS pequeño + `Druk` grande debajo
- Body: `Inter` 18px, line-height 1.55
- Eyebrows / metadatos: `Almendra SC` 11px tracking 0.22em UPPERCASE

### Estilo de imagen

- **Vídeo vertical 9:16** dominando el fold. Reels de Instagram embebidos sí, pero también vídeos hi-res propios (not YouTube quality, calidad anuncio).
- **Foto de producto en primer plano**: macro del croissant, queso fundido, masa caliente. Tipo Eater / Bon Appétit. **Nunca** plato cenital con servilleta de tela.
- **Grano cinematográfico sutil** (no Instagram-2014, sino Kodak film).
- **Aspect ratios**: 9:16 (reels), 4:5 (posts cuadrados-altos), 16:9 (aftermovie). Ratio 1:1 está prohibido — es del 2018.
- **Color grading**: subexpuesto + saturación selectiva en naranjas/dorados. Sombras profundas. La comida brilla.

### Microinteracciones

- **Hover de cards**: micro-tilt 1.5deg + glow naranja sutil + el precio sube y baja "respirando".
- **CTA principal**: pulse anaranjado cada 4s. Sombra que crece y vuelve.
- **Scroll**: cada sección se anuncia con un fade del color de fondo (teatro ↔ papel).
- **Cursor**: en sección cartel, el cursor se transforma en "🎟️" al hover de cards de tickets.
- **Sound on**: reels embebidos preguntan "¿Activar sonido?" tras 5s en pantalla. Conversion-friendly.

---

## 4. Funcionalidades para maximizar margen

### Estructura de tickets (recomendada)

| Tier | Precio | Margen estimado | Comprador objetivo |
|------|--------|------------------|--------------------|
| **General** | 18€ | bajo (volumen) | celíaco curioso, primera vez |
| **VIP** ⭐ | 49€ | alto (sweet spot) | celíaco veterano, foodie |
| **Mesa del Chef** | 149€ | muy alto (escasez) | foodie premium, prensa, regalo |
| **Pase Pro** *(B2B)* | 89€ | medio | restaurador, prensa, partner |

**Truco psicológico**: VIP a 49€ se convierte en el "default" si el General es 18€ y la Mesa del Chef es 149€. Decoy pricing clásico — la mayoría compra VIP.

### Add-ons / upsells (post-purchase)

Después del checkout, una pantalla "no te vayas todavía" con:

- **Cata privada de cervezas sin gluten** — 25€
- **Mesa reservada con vista al escenario** — 35€
- **Pack de merch** (camiseta + tote + pin) — 29€ (margen ~70%)
- **Parking VIP** — 12€
- **Acceso 1h antes para foodies** *(antes de las colas)* — 15€
- **Botella firmada por el chef** *(numerada, 50 unidades)* — 79€

Conversión típica de upsells post-checkout: 15-25%. Con 5.000 entradas y AOV +12€, son 60-100k€ extra.

### Mecánicas de scarcity y FOMO

- **Countdown live** en home + entradas: "el precio sube en 3d 14h 22m".
- **Stock visible**: "quedan 312 entradas General" actualizado en tiempo real.
- **Live activity feed**: "Marta de Sevilla acaba de comprar 2 entradas VIP" (toast inferior cada 30-60s).
- **Wait list pública** para sold-out, con contador "+2.341 en lista".
- **Last-release badge**: "Last release before sold out" cuando queda <15% del stock.

### Mecánicas de adquisición orgánica

- **Refer-a-friend**: "trae a 3 celíacos = 1 entrada gratis". Code único por usuario.
- **Affiliate creators**: 8-10 creadores celíacos con código de descuento personal y comisión 10-15%. Visible en home como "Embajadores 2026".
- **Early bird newsletter**: 30 días antes de venta abierta, suscriptores ven precio 10€ (vs 18€). Engaña-pero-no-engaña.
- **Pre-venta KIMCAKES/Carmela**: clientes existentes de los partners reciben código exclusivo 48h antes.

### Bundles y B2B

- **Bundle "Para regalar"**: entrada + caja de productos KIMCAKES/Carmela enviada a casa. 89€.
- **Pack restaurante**: 6 entradas Pro + cata privada para staff. 480€. Convierte clientela a partners futuros.
- **Sponsoring tiered** *(/b2b)*:
  - Diamond 8.000€ — logo en cabecera, espacio premium, 1 showcooking dedicado, vídeo en redes.
  - Gold 3.500€ — logo destacado, espacio, mención.
  - Silver 1.500€, Bronze 600€, Collab (intercambio).

### Analítica de margen (panel admin)

Dashboard nuevo `/admin/finanzas`:
- Ticket sales por tier en tiempo real
- AOV (average order value) con / sin upsells
- Conversion rate por canal de origen (UTM, referral, affiliate)
- Forecast de ingresos basado en velocidad de venta vs edición pasada
- Alerta si AOV cae bajo 24€ (señal de que decoy pricing no funciona)

### Stripe + experiencia de pago

- **Stripe Checkout** con Apple Pay / Google Pay habilitados.
- **Pago en 3** vía Klarna (sí, para 49€ algunos lo usarán y subes conversión 8-12%).
- **Recibo bonito** branded, no el PDF feo de Stripe — usa Resend con plantilla MJML.
- **Wallet pass** Apple/Google con QR de la entrada.

---

## 5. Lo que rompe con la web actual

| Aspecto | Versión actual | Versión v2 |
|---------|---------------|-----------|
| Tono | comunidad cálida | foodie premium con ego |
| Modo | papel claro permanente | dual: teatro oscuro + papel claro alternándose |
| Tipografía display | Almendra SC sola | Druk + Almendra + Pirata (combo brutal) |
| Hero | logo grande + KPIs | vídeo full-bleed + frase puñetazo + CTA agresivo |
| Sponsors | grid de logos al final | "Cartel" estilo festival musical, ESTRELLA del scroll |
| Reservas | formulario simple | funnel tickets tier + upsells + Stripe |
| Seguridad | mención en footer | sección dedicada con 5 sellos visuales |
| Admin | CRUD básico | + módulo de finanzas y forecasting |

---

## 6. Riesgos y antídotos

- **"Demasiado pijo"** → contrapeso con humor andaluz en microcopy ("ese pan que sabe a cartón", "ya hemos limpiado la sartén").
- **"Excluye a celíacos low-cost"** → entrada General accesible (18€), todas las experiencias VIP son addon opcional.
- **"Saturado de movimiento"** → respeta secciones de papel (manifiesto, protocolo, FAQ) sin animaciones. El ojo necesita pausas.
- **"Frágil ante ruido en redes"** → Social Wall con curaduría manual desde admin (no auto-pull) para evitar trolls/spam visibles.
