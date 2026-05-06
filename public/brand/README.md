# /public/brand

Aquí van los assets oficiales del logo Singlufest.

Archivos esperados:

- `logo.png` — logo principal (lettering naranja sobre transparente, alta resolución, mín. 2000x2000).
- `logo.svg` — versión vectorial (preferida, ideal para imprimir y para escalar).
- `logo-light.png` — variante para fondos oscuros (la principal ya lo es).
- `logo-mono.png` — versión monocromo blanco para casos de baja saturación.
- `noise.svg` — textura de grano para overlays (la genera el equipo de diseño).
- `og-default.png` — 1200x630, imagen Open Graph por defecto.

El componente `<Logo>` (components/Logo.tsx) intenta cargar `logo.png` y cae al lettering tipográfico si no existe.
