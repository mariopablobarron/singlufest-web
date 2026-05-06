import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint idempotente para publicar posts programados.
 * Cron VPS: cada minuto.
 *   * * * * * curl -sX POST 'https://singlufest.hubstartidea.es/api/cron/publish-scheduled?secret=...' >> /var/log/singlufest-publish.log 2>&1
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const due = await prisma.post.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: now },
    },
    select: { id: true, scheduledAt: true },
  });

  if (due.length === 0) {
    return NextResponse.json({ ok: true, published: 0 });
  }

  await prisma.$transaction(
    due.map((p) =>
      prisma.post.update({
        where: { id: p.id },
        data: {
          status: "PUBLISHED",
          publishedAt: p.scheduledAt ?? now,
        },
      }),
    ),
  );

  return NextResponse.json({ ok: true, published: due.length, ids: due.map((d) => d.id) });
}
