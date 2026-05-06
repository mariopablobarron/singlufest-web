# --- Singlufest · Next.js 15 standalone ---
# Patrón canónico Startidea: multistage + Next standalone + HOSTNAME=0.0.0.0
# Lección: Astro 6 exigió Node 22; aquí también vamos a node:22-alpine para futuro-proof.

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ libc6-compat openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl openssl tini && \
    addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/prisma ./prisma
COPY --from=builder --chown=app:app /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=app:app /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=app:app /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=app:app /app/agents ./agents

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fs http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
