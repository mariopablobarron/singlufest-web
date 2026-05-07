/**
 * Agente Redactor
 * --------------
 * Genera un borrador SEO sobre un tema sin gluten + Granada y lo guarda
 * en la BD como Post(status=DRAFT). Diseñado para correr semanalmente
 * (lunes 09:00) o lanzarse on-demand desde /admin/agentes.
 *
 * Coste estimado con Haiku 4.5: ~$0.01 por draft.
 */
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const SYSTEM = `Eres editor del blog de Singlufest, festival sin gluten en Granada.
Escribes en español neutro, cercano, con cariño y rigor. Cero marketing hueco.
Datos:
- Tono: cálido, andaluz sin caer en tópicos. Frases cortas. Verbo activo.
- Audiencia: celíacos, sensibles al gluten y curiosos foodies que viven o visitan Granada.
- Política: nunca recetas con gluten encubierto, siempre claros con la trazabilidad.
Estructura ideal de un post:
1. Lead que enganche en 2 frases.
2. 3-5 bloques con subtítulos H2.
3. Llamada final invitando al festival o al newsletter.
Devuelve estrictamente un JSON con: title, slug, excerpt (max 220 chars), contentMdx (markdown sin frontmatter), tags (array 3-5), seoTitle (max 65), seoDescription (max 160).`;

const TEMA_FALLBACK_POOL = [
  "Pan sin gluten en Granada: panaderías recomendadas",
  "Cervezas artesanas sin gluten: qué probar",
  "Tapeo sin gluten en el Realejo y el Albaicín",
  "Recetas tradicionales granadinas sin gluten",
  "Niños celíacos: cómo organizar un cumpleaños sin gluten",
  "Cómo leer el etiquetado: las trampas más comunes",
  "Restaurantes sin gluten certificados FACE en Granada",
  "Repostería sin gluten en Granada: confiterías y obradores",
  "Viajar a Granada siendo celíaco: 7 imprescindibles",
  "Comer sin gluten en la Alhambra y la Sierra",
];

function pickTopic() {
  return TEMA_FALLBACK_POOL[Math.floor(Math.random() * TEMA_FALLBACK_POOL.length)];
}

export async function runRedactor({
  topic,
  trigger,
}: { topic?: string; trigger: "manual" | "cron" } = { trigger: "manual" }) {
  const start = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

  if (!apiKey) {
    await prisma.agentRun.create({
      data: {
        agent: "redactor",
        status: "error",
        errorMsg: "ANTHROPIC_API_KEY no configurada en el .env del servidor",
      },
    });
    return { ok: false as const, error: "ANTHROPIC_API_KEY no configurada en el .env del servidor" };
  }

  const chosenTopic = topic ?? pickTopic();
  const client = new Anthropic({ apiKey });

  try {
    const resp = await client.messages.create({
      model,
      max_tokens: 4000,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Escribe un post sobre: "${chosenTopic}". Devuelve solo el JSON, sin texto adicional.`,
        },
      ],
    });

    const text = resp.content
      .filter((c) => c.type === "text")
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("\n")
      .trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Respuesta sin JSON parseable");

    const parsed = JSON.parse(jsonMatch[0]) as {
      title: string;
      slug?: string;
      excerpt?: string;
      contentMdx: string;
      tags?: string[];
      seoTitle?: string;
      seoDescription?: string;
    };

    const slug = parsed.slug || slugify(parsed.title);

    const post = await prisma.post.create({
      data: {
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt ?? null,
        contentMdx: parsed.contentMdx,
        tags: parsed.tags ?? [],
        status: "DRAFT",
        seoTitle: parsed.seoTitle ?? parsed.title,
        seoDescription: parsed.seoDescription ?? parsed.excerpt ?? null,
      },
    });

    const tokensIn = resp.usage.input_tokens;
    const tokensOut = resp.usage.output_tokens;
    // Haiku 4.5 indicativo: $0.80/1M input, $4/1M output
    const costUsd = (tokensIn * 0.80 + tokensOut * 4) / 1_000_000;

    await prisma.agentRun.create({
      data: {
        agent: "redactor",
        status: "ok",
        tokensIn,
        tokensOut,
        costUsd,
        output: `post:${post.id}|topic:${chosenTopic}|trigger:${trigger}|ms:${Date.now() - start}`,
      },
    });

    return { ok: true as const, postId: post.id, topic: chosenTopic, costUsd };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await prisma.agentRun.create({
      data: {
        agent: "redactor",
        status: "error",
        errorMsg: msg,
        output: `topic:${chosenTopic}|trigger:${trigger}`,
      },
    });
    throw err;
  }
}

// CLI invocation (npm run agents:redactor)
const isCli = typeof process !== "undefined" && process.argv?.[1]?.endsWith("redactor/run.ts");
if (isCli) {
  runRedactor({ trigger: "cron" })
    .then((r) => { console.log("[redactor]", r); process.exit(0); })
    .catch((e) => { console.error("[redactor] fallo:", e); process.exit(1); });
}
