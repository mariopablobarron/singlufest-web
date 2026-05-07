import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  path: z.enum(["patrocinador", "colaborador", "embajador"]),
  budget: z.string().optional(),
  message: z.string().min(20),
  consent: z.literal(true),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PATH_LABEL: Record<string, string> = {
  patrocinador: "Patrocinador",
  colaborador: "Colaborador",
  embajador: "Embajador",
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { name, company, email, phone, path, budget, message } = parsed.data;
  const pathLabel = PATH_LABEL[path];

  const html = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FBF6EB;padding:32px">
<table role="presentation" width="100%" style="max-width:640px;margin:auto;background:#FBF6EB;border:1px solid rgba(11,8,7,.10);border-radius:16px;overflow:hidden">
  <tr><td style="padding:28px 28px 0">
    <p style="margin:0;color:#715A43;font-size:11px;letter-spacing:.22em;text-transform:uppercase">SingluFest · B2B · ${pathLabel}</p>
    <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:26px;color:#0B0807">Nueva solicitud de ${pathLabel.toLowerCase()}</h1>
  </td></tr>
  <tr><td style="padding:18px 28px;color:#0B0807;font-size:15px;line-height:1.6">
    <p><strong>${name}</strong> — ${company}</p>
    <p>📧 <a href="mailto:${email}">${email}</a> ${phone ? `· 📞 ${phone}` : ""}</p>
    ${budget ? `<p>💰 Presupuesto: <strong>${budget}</strong></p>` : ""}
    <hr style="border:0;border-top:1px solid rgba(11,8,7,.10);margin:18px 0">
    <p style="white-space:pre-wrap">${message.replace(/</g, "&lt;")}</p>
  </td></tr>
  <tr><td style="padding:18px 28px;background:#F4EAD7;color:#715A43;font-size:11px">
    Recibido en /b2b · responder en menos de 48h.
  </td></tr>
</table>
</body></html>`;

  // Notificación interna a Mario
  try {
    await sendEmail({
      to: "mario@startidea.es",
      subject: `[B2B SingluFest] ${pathLabel} · ${company}`,
      html,
      replyTo: email,
    });
  } catch (e) {
    console.error("[b2b] email send failed", e);
  }

  // Confirmación al solicitante
  const confirmHtml = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FBF6EB;padding:32px">
<table role="presentation" width="100%" style="max-width:560px;margin:auto;background:#FBF6EB;border:1px solid rgba(11,8,7,.10);border-radius:16px;overflow:hidden">
  <tr><td style="padding:28px 28px 0">
    <p style="margin:0;color:#715A43;font-size:11px;letter-spacing:.22em;text-transform:uppercase">SingluFest · ${pathLabel}</p>
    <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:26px;color:#0B0807">¡Recibido, ${name}!</h1>
  </td></tr>
  <tr><td style="padding:18px 28px;color:#0B0807;font-size:15px;line-height:1.6">
    <p>Tenemos tu solicitud para ser <strong>${pathLabel.toLowerCase()}</strong> de SingluFest 2026. Te respondemos personalmente en menos de 48 horas con propuesta concreta.</p>
    <p>Mientras tanto, échale un ojo al cartel y al protocolo de seguridad para hacerte una idea del nivel del festival.</p>
  </td></tr>
  <tr><td style="padding:0 28px 28px">
    <a href="https://singlufest.hubstartidea.es/cartel" style="display:inline-block;background:#0B0807;color:#FBF6EB;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">Ver el cartel</a>
  </td></tr>
  <tr><td style="padding:18px 28px;background:#F4EAD7;color:#715A43;font-size:11px">
    SingluFest · El paraíso existe y no tiene trazas
  </td></tr>
</table>
</body></html>`;

  try {
    await sendEmail({
      to: email,
      subject: `Hemos recibido tu solicitud · SingluFest 2026`,
      html: confirmHtml,
    });
  } catch (e) {
    console.error("[b2b] confirmation email failed", e);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
