import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(value: unknown) {
  if (value === null || value === undefined) return "";
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      event: { select: { title: true, slug: true } },
      edition: { select: { title: true, year: true } },
    },
  });

  const headers = [
    "id", "createdAt", "edition", "event", "name", "email", "phone",
    "partySize", "dietary", "notes", "status",
  ];
  const lines = [headers.join(",")];
  for (const r of reservations) {
    lines.push(
      [
        r.id,
        r.createdAt.toISOString(),
        r.edition?.title,
        r.event?.title,
        r.name,
        r.email,
        r.phone,
        r.partySize,
        r.dietary,
        r.notes,
        r.status,
      ].map(csvEscape).join(","),
    );
  }
  const csv = lines.join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="reservas-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
