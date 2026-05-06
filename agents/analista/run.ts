/**
 * Agente Analista
 * ---------------
 * Resumen semanal: tráfico (placeholder), reservas nuevas, conversiones por landing,
 * patrocinadores activos. Resumen ejecutivo con Anthropic + envío por Telegram.
 * Diseñado para correr cada lunes 07:00 (Europa/Madrid).
 */
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const SYSTEM = `Eres analista de marketing de Singlufest. Recibes datos crudos de la última semana y generas un resumen ejecutivo en español, en 6-8 bullets.
Estilo: claro, sin jerga, datos concretos.
Estructura:
- Titular: 1 frase sobre el cambio más importante.
- Métricas clave (reservas, conversión).
- Lo que funcionó.
- Riesgos / lo que vigilar.
- Recomendación accionable para esta semana.
NO inventes datos: si un campo es 0 o "sin datos", dilo así.`;

async function loadStats() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const prevSince = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [resWeek, resPrev, posts, subs, sponsors] = await Promise.all([
    prisma.reservation.count({ where: { createdAt: { gte: since } } }),
    prisma.reservation.count({ where: { createdAt: { gte: prevSince, lt: since } } }),
    prisma.post.count({ where: { publishedAt: { gte: since } } }),
    prisma.emailSubscriber.count({ where: { createdAt: { gte: since }, unsubscribedAt: null } }),
    prisma.sponsor.count({ where: { isPublished: true } }),
  ]);

  const byStatus = await prisma.reservation.groupBy({
    by: ["status"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });

  return { resWeek, resPrev, posts, subs, sponsors, byStatus };
}

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true }),
  });
  return true;
}

export async function runAnalista({
  trigger,
}: { trigger: "manual" | "cron" } = { trigger: "manual" }) {
  const start = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  if (!apiKey) {
    await prisma.agentRun.create({
      data: { agent: "analista", status: "error", errorMsg: "ANTHROPIC_API_KEY no configurada" },
    });
    throw new Error("ANTHROPIC_API_KEY no configurada");
  }

  const stats = await loadStats();
  const client = new Anthropic({ apiKey });

  const dataDump = `Reservas última semana: ${stats.resWeek}\nReservas semana anterior: ${stats.resPrev}\nDelta: ${stats.resWeek - stats.resPrev}\nPosts publicados: ${stats.posts}\nNuevos suscriptores email: ${stats.subs}\nPatrocinadores activos: ${stats.sponsors}\nReservas por estado: ${JSON.stringify(stats.byStatus)}`;

  const resp = await client.messages.create({
    model,
    max_tokens: 800,
    system: SYSTEM,
    messages: [{ role: "user", content: dataDump }],
  });

  const summary = resp.content
    .filter((c) => c.type === "text")
    .map((c) => (c.type === "text" ? c.text : ""))
    .join("\n")
    .trim();

  const sent = await notifyTelegram(`*Singlufest · informe semanal*\n\n${summary}`);

  const tokensIn = resp.usage.input_tokens;
  const tokensOut = resp.usage.output_tokens;
  const costUsd = (tokensIn * 0.80 + tokensOut * 4) / 1_000_000;

  await prisma.agentRun.create({
    data: {
      agent: "analista",
      status: "ok",
      tokensIn,
      tokensOut,
      costUsd,
      output: `telegram:${sent ? "ok" : "skipped"}|trigger:${trigger}|ms:${Date.now() - start}\n\n${summary}`,
    },
  });

  return { ok: true as const, summary, sentTelegram: sent, costUsd };
}

// CLI invocation (npm run agents:analista)
const isCli = typeof process !== "undefined" && process.argv?.[1]?.endsWith("analista/run.ts");
if (isCli) {
  runAnalista({ trigger: "cron" })
    .then((r) => { console.log("[analista]", r.summary); process.exit(0); })
    .catch((e) => { console.error("[analista] fallo:", e); process.exit(1); });
}
