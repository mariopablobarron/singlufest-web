import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subscribeSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function parseBody(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return req.json();
  const fd = await req.formData();
  return Object.fromEntries(fd.entries());
}

export async function POST(req: NextRequest) {
  const raw = await parseBody(req);
  const parsed = subscribeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email no válido" }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  await prisma.emailSubscriber.upsert({
    where: { email: parsed.data.email },
    create: {
      email: parsed.data.email,
      source: parsed.data.source ?? "web",
    },
    update: { unsubscribedAt: null },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
