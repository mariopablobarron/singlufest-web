import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { reservationSchema } from "@/lib/validations";
import { sendEmail, reservationEmailHtml } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body no válido" }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // honeypot
  if (parsed.data.website) {
    return NextResponse.json({ id: "ok" }, { status: 200 });
  }

  const settings = await prisma.siteSettings.findFirst();
  if (!settings?.bookingsOpen) {
    return NextResponse.json(
      { error: "Las reservas están cerradas en este momento" },
      { status: 403 },
    );
  }

  const edition = await prisma.edition.findFirst({
    where: { isCurrent: true, isPublished: true },
  });
  if (!edition) {
    return NextResponse.json(
      { error: "No hay edición activa" },
      { status: 409 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex");

  const { name, email, phone, partySize, eventId, dietary, notes } = parsed.data;

  // Rate limit elemental: máximo 3 reservas por email/24h.
  const recent = await prisma.reservation.count({
    where: {
      email,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  if (recent >= 3) {
    return NextResponse.json(
      { error: "Has hecho demasiadas reservas hoy. Escríbenos por email." },
      { status: 429 },
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      editionId: edition.id,
      eventId: eventId || null,
      name,
      email,
      phone: phone || null,
      partySize,
      dietary: dietary || null,
      notes: notes || null,
      ipHash,
      userAgent: req.headers.get("user-agent") ?? null,
      source: "web",
    },
  });

  let eventTitle: string | null = null;
  if (eventId) {
    const ev = await prisma.event.findUnique({ where: { id: eventId } });
    eventTitle = ev?.title ?? null;
  }

  try {
    await sendEmail({
      to: email,
      subject: `Hemos recibido tu reserva · ${edition.title}`,
      html: reservationEmailHtml({
        name,
        partySize,
        eventTitle,
        editionTitle: edition.title,
        reservationId: reservation.id,
      }),
    });
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { emailedAt: new Date() },
    });
  } catch (err) {
    console.error("[reservations] email send failed", err);
  }

  return NextResponse.json(
    { id: reservation.id, status: reservation.status },
    { status: 201 },
  );
}
