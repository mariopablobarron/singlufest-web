import { NextRequest, NextResponse } from "next/server";
import { runRedactor } from "@/agents/redactor/run";
import { runAnalista } from "@/agents/analista/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

/**
 * Endpoint para disparar agentes desde cron del VPS sin necesidad de SSH.
 * Uso:
 *   POST /api/cron/agents?secret=<CRON_SECRET>&agent=redactor|analista
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agent = req.nextUrl.searchParams.get("agent");
  try {
    if (agent === "redactor") {
      const result = await runRedactor({ trigger: "cron" });
      return NextResponse.json(result);
    }
    if (agent === "analista") {
      const result = await runAnalista({ trigger: "cron" });
      return NextResponse.json({ ok: result.ok, sentTelegram: result.sentTelegram });
    }
    return NextResponse.json({ error: "agent desconocido (redactor|analista)" }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
