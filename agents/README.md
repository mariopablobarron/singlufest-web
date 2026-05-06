# Agentes IA del Singlufest

Cada agente vive en su propia carpeta. La interfaz es uniforme:

```ts
export async function runX({ trigger: "manual" | "cron" }): Promise<...>
```

## Agentes activos

### `redactor/`
Genera un borrador SEO de blog (Anthropic Haiku 4.5). Coste ~$0.01/run.
- Manual: `/admin/agentes` → "Lanzar ahora".
- Cron VPS: `0 9 * * 1 docker compose -f /data/singlufest-startidea/docker-compose.yml exec singlufest-app npm run agents:redactor`

### `analista/`
Resumen semanal por Telegram con tráfico + reservas (Anthropic Haiku 4.5). Coste ~$0.005/run.
- Manual: `/admin/agentes`.
- Cron VPS: `0 7 * * 1 docker compose -f /data/singlufest-startidea/docker-compose.yml exec singlufest-app npm run agents:analista`

## Próximamente

### `video-builder/` (en diseño)
HyperFrames CLI + TTS español. Cada lunes monta un Reel 9:16 con el último post, lo sube a `/public/promos/` y notifica a Mario.
- Requiere: `hyperframes-cli` + `ffmpeg` en la imagen Docker.
- Patrón: leer último post `PUBLISHED`, generar `index.html` con HyperFrames, render a MP4, log en `agentRun`.

## Telemetría

Toda ejecución deja registro en `AgentRun`:
- `agent`, `status`, `tokensIn`, `tokensOut`, `costUsd`, `errorMsg`, `output`.

Visible en `/admin/agentes` con histórico de las últimas 30 ejecuciones.

## Coste mensual estimado

| Agente | Frecuencia | Coste/run | Mensual |
|--------|-----------|-----------|---------|
| redactor | semanal | $0.01 | $0.04 |
| analista | semanal | $0.005 | $0.02 |
| video-builder | semanal | (TBD, depende de TTS) | (TBD) |

Total actual: < $0.10/mes.
