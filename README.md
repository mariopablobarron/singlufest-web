# Singlufest · web

Plataforma del Festival Sin Gluten de Granada (`@singlufest`).
Stack: **Next.js 15 (App Router) + Prisma + Postgres + NextAuth v5 + Tailwind + Framer Motion**.
Despliegue: VPS Hostinger vía **Coolify + Traefik** en `singlufest.hubstartidea.es`.

## Características

- 🎨 **Tema festival**: oscuro + naranja, tipografía decorativa Almendra SC, scroll cinematográfico.
- 🎟️ **Reservas** con validación Zod, email Resend/SMTP, rate-limit por email/24h, honeypot anti-bots.
- 📺 **Wall of reels** integrando Instagram/YouTube vía embeds oficiales.
- 🤝 **Patrocinadores** por tiers (Diamante / Oro / Plata / Bronce / Colaboran).
- 📰 **Blog MDX** con publicación programada (cron).
- 🔐 **Panel admin** (`/admin`) con CRUD de reservas, programa, sponsors, posts y settings.
- 🤖 **Agentes IA** (Anthropic Haiku 4.5):
  - **Redactor**: drafts de blog automáticos.
  - **Analista**: informe semanal por Telegram.
  - *(Próximamente)* **Generador de Reels** con HyperFrames + TTS español.
- 📊 Analytics Umami compartidos con el resto del portfolio Startidea.

## Estructura

```
app/                 # App Router de Next.js 15
  (public)/          # rutas públicas (home, programa, blog, vídeos, reservas…)
  admin/             # panel privado (auth requerido)
  api/               # endpoints (reservations, subscribe, cron, auth, health)
agents/              # agentes IA (redactor, analista)
components/          # UI compartida (Hero, NavBar, Footer, VideoWall…)
lib/                 # db, auth, email, validations, utils
prisma/              # schema + migraciones
public/brand/        # logos oficiales (logo.png, partners/…)
scripts/             # seed
docker-compose.yml   # Postgres + app + Traefik labels
Dockerfile           # multistage Node 22 + Next standalone
```

## Setup local

```bash
# 1. Variables
cp .env.example .env
# rellena DATABASE_URL, AUTH_SECRET (openssl rand -base64 32), ADMIN_*

# 2. Deps
npm install

# 3. BD (necesitas Postgres local; o levanta solo el servicio db con docker compose up -d singlufest-db)
npx prisma migrate dev
npm run db:seed

# 4. Dev
npm run dev
# http://localhost:3000  ·  /admin/login con ADMIN_EMAIL/ADMIN_PASSWORD del .env
```

## Deploy en VPS (Hostinger / Coolify)

> Patrón canónico Startidea. Ver detalles en `~/.claude/memory/infra-startidea.md`.

1. **DNS**: registro A `singlufest.hubstartidea.es` → `72.61.195.108` vía Hostinger MCP.
2. **Carpeta VPS**: `/data/singlufest-startidea/` con `docker-compose.yml` + `.env` (chmod 600).
3. **Levantar**:
   ```bash
   cd /data/singlufest-startidea
   docker compose up -d --build
   docker compose exec singlufest-app npm run db:seed
   ```
4. **SSL**: Traefik emite cert Let's Encrypt automáticamente al detectar el container `healthy`.
5. **Crons VPS** (`crontab -e`):
   ```cron
   # Publicación programada de posts (cada minuto)
   * * * * * curl -sX POST "https://singlufest.hubstartidea.es/api/cron/publish-scheduled?secret=$CRON_SECRET" >> /var/log/singlufest-publish.log 2>&1

   # Redactor IA (lunes 09:00 Madrid)
   0 9 * * 1 curl -sX POST "https://singlufest.hubstartidea.es/api/cron/agents?agent=redactor&secret=$CRON_SECRET" >> /var/log/singlufest-redactor.log 2>&1

   # Analista IA (lunes 07:00 Madrid)
   0 7 * * 1 curl -sX POST "https://singlufest.hubstartidea.es/api/cron/agents?agent=analista&secret=$CRON_SECRET" >> /var/log/singlufest-analista.log 2>&1
   ```

## Variables de entorno

Ver `.env.example`. Críticas para producción:

| Var | Para qué |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | NextAuth JWT signing |
| `AUTH_URL` | URL pública del sitio |
| `RESEND_API_KEY` o `SMTP_*` | Envío de emails de reserva |
| `CRON_SECRET` | Protege endpoints `/api/cron/*` |
| `ANTHROPIC_API_KEY` | Agentes IA |
| `TELEGRAM_BOT_TOKEN` + `_CHAT_ID` | Notificaciones del analista |
| `NEXT_PUBLIC_UMAMI_*` | Analytics |
| `HOSTNAME=0.0.0.0` | **Imprescindible** en Docker (Next 15) |

## Decisiones técnicas

- **Node 22-alpine** en builder y runner. Lección aprendida: Astro 6 exigió 22, mantenemos línea para futuro-proof.
- **Next standalone output** → imagen final ~180MB (vs 1.2GB sin standalone).
- **`prisma migrate deploy` en boot** del container: no necesita SSH para aplicar nuevas migraciones tras un deploy.
- **Traefik labels en `docker-compose.yml`**, no en Coolify UI: las labels se pierden con `buildPack=compose` si están en otro sitio.
- **Middleware con prefijo `singlufest-`**: evita colisiones con otros stacks del portfolio.

## Roadmap inmediato

- [ ] Subir `public/brand/logo.png` definitivo (alta resolución, transparente).
- [ ] Subir reels reales del Instagram al panel `/admin/videos`.
- [ ] Configurar Resend (`RESEND_API_KEY`) para emails de reserva.
- [ ] Crear sitio en Coolify y registrar DNS via Hostinger MCP.
- [ ] Generar primer Reel HyperFrames promo con TTS español (siguiente sesión).

## Licencia

Privada. © Singlufest · Startidea.
