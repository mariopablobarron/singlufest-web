# Deploy de singlufest.hubstartidea.es

Procedimiento operativo (patrón portfolio Startidea).

## Pre-requisitos

- Acceso SSH a `root@72.61.195.108`.
- Hostinger MCP disponible (para DNS).
- `.env` preparado con valores reales (NUNCA commitear).

## 1. DNS

Vía Hostinger MCP en chat:

```
DNS_updateDNSRecordsV1(
  domain="hubstartidea.es",
  overwrite=False,
  zone=[{
    "name": "singlufest",
    "type": "A",
    "ttl": 3600,
    "records": [{"content": "72.61.195.108"}]
  }]
)
```

Propagación típica 30-90s vía CloudFlare DNS:

```bash
dig +short singlufest.hubstartidea.es @1.1.1.1
# debería devolver 72.61.195.108
```

## 2. Carpeta del VPS

```bash
ssh root@72.61.195.108
mkdir -p /data/singlufest-startidea && cd /data/singlufest-startidea
git clone <repo> .   # o rsync desde local

# .env con valores reales (chmod 600)
cp .env.example .env
nano .env
chmod 600 .env

# generar AUTH_SECRET y CRON_SECRET aleatorios
# AUTH_SECRET=$(openssl rand -base64 32)
# CRON_SECRET=$(openssl rand -base64 24)
# DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 28)
```

## 3. Build & arranque

```bash
docker compose up -d --build
docker compose logs -f singlufest-app
```

El boot del container ejecuta `prisma migrate deploy && node server.js`:

- Si la BD está vacía, aplica todas las migraciones.
- Si ya está al día, deploy es no-op.

## 4. Seed inicial

```bash
docker compose exec singlufest-app node -e "import('./scripts/seed.js')" \
  || docker compose exec singlufest-app npx tsx scripts/seed.ts
```

(En la imagen de producción `tsx` quizás no esté disponible; opción alternativa es ejecutar seed en build local antes de subir, o transpilar el script.)

## 5. Crons VPS

```bash
crontab -e
```

Pegar:

```cron
# Singlufest — publicación de posts programados
* * * * * curl -sX POST "https://singlufest.hubstartidea.es/api/cron/publish-scheduled?secret=$(grep ^CRON_SECRET= /data/singlufest-startidea/.env | cut -d= -f2)" >> /var/log/singlufest-publish.log 2>&1

# Singlufest — redactor (lunes 09:00 Europa/Madrid)
CRON_TZ=Europe/Madrid
0 9 * * 1 curl -sX POST "https://singlufest.hubstartidea.es/api/cron/agents?agent=redactor&secret=$(grep ^CRON_SECRET= /data/singlufest-startidea/.env | cut -d= -f2)" >> /var/log/singlufest-redactor.log 2>&1

# Singlufest — analista (lunes 07:00 Europa/Madrid)
0 7 * * 1 curl -sX POST "https://singlufest.hubstartidea.es/api/cron/agents?agent=analista&secret=$(grep ^CRON_SECRET= /data/singlufest-startidea/.env | cut -d= -f2)" >> /var/log/singlufest-analista.log 2>&1
```

## 6. Verificación post-deploy

```bash
# Health
curl -s https://singlufest.hubstartidea.es/api/health
# {"ok":true,"db":"ok",...}

# Frontend
curl -sI https://singlufest.hubstartidea.es | head -1
# HTTP/2 200

# Container healthy
docker compose ps
# singlufest-app · healthy
```

## Rollback

Imagen anterior (no construida) servida con `--no-build`:

```bash
docker compose up -d --no-build singlufest-app
```

Si necesitas más atrás, `docker images` para ver SHA y `docker tag <sha> singlufest-app:latest && docker compose up -d`.

## Troubleshooting habitual

- **`unhealthy` y Traefik no enruta**: revisar `docker compose logs singlufest-app`. Casos típicos:
  - `HOSTNAME` no es `0.0.0.0` → next bindea al ID del container, healthcheck falla.
  - Postgres no listo → `depends_on: condition: service_healthy` resuelve esto pero a veces Postgres tarda > 10s en cold start.
  - Migraciones fallan → ver salida de `prisma migrate deploy` en logs.

- **404 desde Traefik**: comprobar que las labels apuntan a `entrypoints=websecure` (no `https`), `tls.certresolver=letsencrypt`, y que el container está en network `coolify`.

- **SSL no se emite**: `docker exec coolify-proxy wget -qO- "http://localhost:8080/api/http/routers"` y filtrar `disabled`. Causa común: container `unhealthy` → Traefik excluye del routing → Let's Encrypt no puede validar HTTP-01.

Más detalles en `~/.claude/memory/infra-startidea.md`.
