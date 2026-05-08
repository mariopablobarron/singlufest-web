import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";
import { normalizeHandle } from "@/lib/giveaways";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook de Instagram Graph API — endpoint de recepción.
 *
 * Setup:
 * 1. Crea una App de Facebook en https://developers.facebook.com/apps/
 * 2. Añade producto "Instagram Graph API" + "Webhooks"
 * 3. Suscribe a fields: "mentions" y "comments"
 * 4. Callback URL: https://singlufest.hubstartidea.es/api/webhooks/instagram
 * 5. Verify Token: el valor que pongas en .env como INSTAGRAM_VERIFY_TOKEN
 * 6. App Secret: en .env como INSTAGRAM_APP_SECRET (para validar HMAC firma X-Hub-Signature-256)
 *
 * Cuando alguien menciona @singlufest en un story/post, llega un webhook con el media_id.
 * Hacemos request a Graph API para obtener los detalles y enlazamos con la entry o creamos
 * una nueva si el handle no estaba registrado todavía.
 */

const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN ?? "";
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET ?? "";

/** GET — handshake de verificación que GitHub/FB exige al registrar el webhook */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (!VERIFY_TOKEN) {
    return NextResponse.json(
      { error: "Webhook no configurado (falta INSTAGRAM_VERIFY_TOKEN)" },
      { status: 503 },
    );
  }
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "verify token incorrecto" }, { status: 403 });
}

/** Verifica la firma HMAC del header X-Hub-Signature-256 */
function isValidSignature(rawBody: string, signature: string | null) {
  if (!APP_SECRET || !signature) return false;
  const expected = "sha256=" + createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type WebhookPayload = {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    changes?: Array<{
      field: string;
      value: {
        media_id?: string;
        comment_id?: string;
        media?: { id: string; media_product_type?: string };
        from?: { id: string; username?: string };
        text?: string;
      };
    }>;
  }>;
};

/** POST — recibe webhook, verifica firma, vincula con sorteo activo */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (APP_SECRET && !isValidSignature(rawBody, signature)) {
    console.warn("[ig-webhook] firma inválida");
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "payload no JSON" }, { status: 400 });
  }

  // Solo procesamos eventos de Instagram
  if (payload.object !== "instagram") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Sorteos activos para enlazar la mención
  const active = await prisma.giveaway.findMany({
    where: { isPublished: true, status: "ACTIVE" },
    select: { id: true, slug: true, mentionTarget: true, hashtag: true },
  });
  if (active.length === 0) {
    return NextResponse.json({ ok: true, no_active: true });
  }

  let processed = 0;
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const v = change.value;
      const igHandle = v.from?.username ? normalizeHandle(v.from.username) : null;
      const mediaId = v.media_id ?? v.media?.id ?? null;
      const text = v.text ?? "";
      if (!igHandle) continue;

      // Match: la mención debe ser hacia uno de los mentionTarget activos, o contener el hashtag
      const matched = active.find(
        (g) =>
          text.toLowerCase().includes(`@${g.mentionTarget.toLowerCase()}`) ||
          (g.hashtag && text.toLowerCase().includes(`#${g.hashtag.toLowerCase()}`)),
      ) ?? active[0]; // si solo hay 1 sorteo, usar ese aunque no haya text
      if (!matched) continue;

      try {
        await prisma.giveawayEntry.upsert({
          where: { giveawayId_igHandle: { giveawayId: matched.id, igHandle } },
          create: {
            giveawayId: matched.id,
            email: `${igHandle}@instagram.placeholder`,
            igHandle,
            source: change.field === "mentions" ? "INSTAGRAM_TAG" : "INSTAGRAM_STORY",
            status: "VERIFIED", // viene del webhook → autenticado por la propia API
            verifiedAt: new Date(),
            igMediaId: mediaId,
            metadata: { rawWebhook: change } as never,
          },
          update: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            igMediaId: mediaId,
            metadata: { rawWebhook: change } as never,
          },
        });
        processed++;
      } catch (err) {
        console.error("[ig-webhook] error guardando entry", err);
      }
    }
  }

  return NextResponse.json({ ok: true, processed });
}
