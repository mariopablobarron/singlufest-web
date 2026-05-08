import { prisma } from "@/lib/db";

export function normalizeHandle(input: string) {
  return input.trim().toLowerCase().replace(/^@+/, "").replace(/\s+/g, "");
}

const IG_URL = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv|stories|s)\/[a-zA-Z0-9_-]+/;

export function isValidInstagramUrl(url: string) {
  return IG_URL.test(url);
}

/**
 * Verifica que el post de IG existe usando el oEmbed público de Instagram.
 * No requiere autenticación pero a partir de 2020 IG limita las llamadas anónimas:
 * en producción puede fallar. Si falla, devolvemos null y la entrada queda PENDING
 * para verificación manual.
 */
export async function fetchOEmbed(url: string) {
  try {
    const r = await fetch(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { author_name?: string; html?: string; thumbnail_url?: string };
    return data;
  } catch {
    return null;
  }
}

export async function loadActiveGiveaways() {
  try {
    return await prisma.giveaway.findMany({
      where: {
        isPublished: true,
        status: { in: ["ACTIVE", "CLOSED", "DRAWN"] },
        endsAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 días grace
      },
      orderBy: { endsAt: "asc" },
      include: { _count: { select: { entries: true } } },
    });
  } catch {
    return [];
  }
}

export async function loadGiveawayBySlug(slug: string) {
  try {
    return await prisma.giveaway.findUnique({
      where: { slug },
      include: { _count: { select: { entries: true } } },
    });
  } catch {
    return null;
  }
}

export function isGiveawayOpen(g: { startsAt: Date; endsAt: Date; status: string; isPublished: boolean }) {
  const now = Date.now();
  return (
    g.isPublished &&
    g.status === "ACTIVE" &&
    g.startsAt.getTime() <= now &&
    g.endsAt.getTime() > now
  );
}

/**
 * Sortea un ganador de las entries verificadas. Determinístico si pasas seed.
 */
export function pickWinner<T extends { id: string }>(entries: T[], seed?: string): T | null {
  if (entries.length === 0) return null;
  const idx = seed
    ? hashStringToInt(seed) % entries.length
    : Math.floor(Math.random() * entries.length);
  return entries[idx];
}

function hashStringToInt(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
