# Agentes IA — Singlufest

Pequeños asistentes autónomos que escriben, analizan y producen contenido para el festival.

## Visión general

| Agente | Función | Modelo | Coste/run | Frecuencia |
|--------|---------|--------|-----------|-----------|
| `redactor` | Borrador SEO de blog | Haiku 4.5 | ~$0.01 | Semanal (lun 09:00) |
| `analista` | Informe semanal por Telegram | Haiku 4.5 | ~$0.005 | Semanal (lun 07:00) |
| `video-builder` | Reel HyperFrames con TTS | Haiku + ffmpeg | TBD | (en diseño) |

## Anatomía

Cada agente vive en `agents/<id>/run.ts` y exporta `runX({ trigger })`. Lo lanzas:

- **Manual**: `/admin/agentes` → "Lanzar ahora".
- **Programado**: cron VPS llama a `POST /api/cron/agents?agent=<id>&secret=<CRON_SECRET>`.
- **CLI dev**: `npm run agents:redactor` o `npm run agents:analista`.

Toda ejecución registra `AgentRun { agent, status, tokensIn, tokensOut, costUsd, output, errorMsg, ranAt }`. Visible en `/admin/agentes`.

## Diseñar uno nuevo

1. Crear `agents/<nombre>/run.ts` con la firma `runX({ trigger: "manual"|"cron" })`.
2. Hacer `await prisma.agentRun.create({ data: { agent: "<nombre>", status: "ok"|"error", ... } })` al final (siempre, error o no).
3. Añadir entrada en `app/admin/agentes/page.tsx` con icono y descripción.
4. Si va a estar programado, añadir endpoint en `app/api/cron/agents/route.ts` (switch por `agent`).
5. Documentar el cron en `docs/deploy.md` y en `~/.claude/memory/infra-startidea.md`.

## Política de coste

- Modelo por defecto: **Haiku 4.5** (`claude-haiku-4-5-20251001`). Si necesitas más calidad, sube a Sonnet 4.6 — pero registra en `AgentRun` el modelo usado.
- Prompts del sistema son **idénticos entre runs** → activar prompt caching con `cache_control: { type: "ephemeral" }` para reducir input cost ~90% en runs sucesivos del mismo día.
- Tope semanal de coste: si la suma de `costUsd` últimos 7 días supera $1, alerta a Telegram.

## Consideraciones

- **Idempotencia**: el redactor crea siempre un Post nuevo (no ediciones). Si dispara dos veces seguidas, hay dos drafts.
- **PII**: el analista NO incluye emails de reservas en el resumen, solo conteos y deltas. Verificar en `agents/analista/run.ts` antes de añadir nuevos campos.
- **Locale**: TODO en español. El system prompt lo refuerza explícitamente.
