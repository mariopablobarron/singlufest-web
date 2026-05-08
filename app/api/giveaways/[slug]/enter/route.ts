import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { giveawayEntrySchema } from "@/lib/validations-giveaway";
import { fetchOEmbed, isGiveawayOpen, normalizeHandle } from "@/lib/giveaways";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

function getIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

export async function POST(req: NextRequest, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const giveaway = await prisma.giveaway.findUnique({ where: { slug } });
  if (!giveaway || !giveaway.isPublished) {
    return NextResponse.json({ error: "Sorteo no encontrado" }, { status: 404 });
  }
  if (!isGiveawayOpen(giveaway)) {
    return NextResponse.json({ error: "Sorteo cerrado" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }
  const parsed = giveawayEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // honeypot — devolvemos OK silencioso para no dar pistas a bots
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ig = normalizeHandle(parsed.data.igHandle);

  // límite de aforo
  if (giveaway.maxEntries) {
    const total = await prisma.giveawayEntry.count({ where: { giveawayId: giveaway.id } });
    if (total >= giveaway.maxEntries) {
      return NextResponse.json(
        { error: "El sorteo ha alcanzado el aforo máximo." },
        { status: 409 },
      );
    }
  }

  // dedupe por email + handle
  const existing = await prisma.giveawayEntry.findFirst({
    where: {
      giveawayId: giveaway.id,
      OR: [{ email: parsed.data.email }, { igHandle: ig }],
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Ya estás participando en este sorteo con ese email o handle." },
      { status: 409 },
    );
  }

  // Rate-limit por IP: 5 entradas por IP / 24h en cualquier sorteo
  const ip = getIp(req);
  const ipHash = createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex");
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const ipCount = await prisma.giveawayEntry.count({
    where: { ipHash, createdAt: { gte: since } },
  });
  if (ipCount >= 5) {
    return NextResponse.json(
      { error: "Demasiadas entradas desde este dispositivo." },
      { status: 429 },
    );
  }

  // Verificación blanda con oEmbed (puede fallar — la entrada queda PENDING en cualquier caso)
  let oembed: { author_name?: string; thumbnail_url?: string; html?: string } | null = null;
  if (parsed.data.sharedPostUrl) {
    oembed = await fetchOEmbed(parsed.data.sharedPostUrl);
  }
  // Si oEmbed devuelve un author_name distinto al handle declarado → posible fraude (lo marcamos pero no rechazamos)
  let suspicious = false;
  if (oembed?.author_name) {
    const author = normalizeHandle(oembed.author_name);
    if (author && author !== ig) suspicious = true;
  }

  const entry = await prisma.giveawayEntry.create({
    data: {
      giveawayId: giveaway.id,
      email: parsed.data.email,
      name: parsed.data.name || null,
      igHandle: ig,
      sharedPostUrl: parsed.data.sharedPostUrl || null,
      ipHash,
      userAgent: req.headers.get("user-agent") ?? null,
      source: "WEB",
      status: "PENDING",
      metadata: oembed
        ? { oembed: { author_name: oembed.author_name, thumbnail: oembed.thumbnail_url ?? null }, suspicious }
        : { suspicious },
    },
  });

  return NextResponse.json({ ok: true, entryId: entry.id, status: "PENDING" }, { status: 201 });
}

export async function GET(_req: NextRequest, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const g = await prisma.giveaway.findUnique({
    where: { slug },
    include: { _count: { select: { entries: true } } },
  });
  if (!g) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
  return NextResponse.json({
    slug: g.slug,
    title: g.title,
    status: g.status,
    open: isGiveawayOpen(g),
    entries: g._count.entries,
    endsAt: g.endsAt,
  });
}
