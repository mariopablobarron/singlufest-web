import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  buildVoterToken,
  newCookieToken,
  VOTE_COOKIE_NAME,
} from "@/lib/voting";

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

/** GET — devuelve el conteo actual y si tu cookie ya votó. */
export async function GET(req: NextRequest, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const jar = await cookies();
  const cookieToken = jar.get(VOTE_COOKIE_NAME)?.value;
  const ip = getIp(req);

  const [count, mine] = await Promise.all([
    prisma.vote.count({ where: { candidateSlug: slug } }),
    cookieToken
      ? prisma.vote.findUnique({
          where: {
            candidateSlug_voterToken: {
              candidateSlug: slug,
              voterToken: buildVoterToken({ ip, cookieToken }),
            },
          },
        })
      : Promise.resolve(null),
  ]);

  return NextResponse.json({ slug, count, voted: !!mine });
}

/** POST — registra voto. Si ya votaste, devuelve { ok: true, alreadyVoted: true }. */
export async function POST(req: NextRequest, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  if (!slug || slug.length > 80) {
    return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
  }

  // Anti-spam: el slug debe existir en Candidate y estar publicado.
  const candidate = await prisma.candidate.findUnique({
    where: { slug },
    select: { id: true, isPublished: true },
  });
  if (!candidate || !candidate.isPublished) {
    return NextResponse.json({ error: "Candidato no encontrado" }, { status: 404 });
  }

  const jar = await cookies();
  let cookieToken = jar.get(VOTE_COOKIE_NAME)?.value;
  if (!cookieToken) {
    cookieToken = newCookieToken();
    jar.set(VOTE_COOKIE_NAME, cookieToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365, // 1 año
      path: "/",
    });
  }

  const ip = getIp(req);
  const voterToken = buildVoterToken({ ip, cookieToken });

  // Rate limit elemental: máximo 30 votos / IP / 24h (anti-bot)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentByIp = await prisma.vote.count({
    where: { voterToken, createdAt: { gte: since } },
  });
  if (recentByIp >= 30) {
    return NextResponse.json(
      { error: "Has llegado al límite de votos diarios desde este dispositivo." },
      { status: 429 },
    );
  }

  let alreadyVoted = false;
  try {
    await prisma.vote.create({
      data: {
        candidateSlug: slug,
        voterToken,
        userAgent: req.headers.get("user-agent") ?? null,
      },
    });
  } catch (err: unknown) {
    // Unique constraint violation = ya votó
    const e = err as { code?: string };
    if (e.code === "P2002") {
      alreadyVoted = true;
    } else {
      throw err;
    }
  }

  const count = await prisma.vote.count({ where: { candidateSlug: slug } });
  return NextResponse.json({ ok: true, slug, count, alreadyVoted });
}
