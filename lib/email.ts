import nodemailer from "nodemailer";
import { Resend } from "resend";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const from = process.env.EMAIL_FROM || "Singlufest <hola@singlufest.hubstartidea.es>";
  const reply = replyTo || process.env.EMAIL_REPLY_TO;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: reply,
    });
    if (error) throw new Error(`Resend: ${error.message}`);
    return { provider: "resend", id: data?.id };
  }

  if (!process.env.SMTP_HOST) {
    console.warn("[email] sin proveedor configurado — solo log");
    console.log({ to, subject });
    return { provider: "log", id: null };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  const info = await transport.sendMail({ from, to, subject, html, replyTo: reply });
  return { provider: "smtp", id: info.messageId };
}

export function reservationEmailHtml({
  name,
  partySize,
  eventTitle,
  editionTitle,
  reservationId,
}: {
  name: string;
  partySize: number;
  eventTitle?: string | null;
  editionTitle: string;
  reservationId: string;
}) {
  const target = eventTitle ? `<strong>${eventTitle}</strong>` : `el festival`;
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, Helvetica, Arial, sans-serif; background:#FBF8F1; margin:0; padding:32px;">
  <table role="presentation" width="100%" style="max-width:560px;margin:auto;background:#FBF8F1;border:1px solid rgba(15,27,23,.10);border-radius:16px;overflow:hidden">
    <tr><td style="padding:28px 28px 0">
      <p style="margin:0;color:#4B5752;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Singlufest · ${editionTitle}</p>
      <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;color:#0F1B17;line-height:1.1">¡Gracias, ${name}!</h1>
    </td></tr>
    <tr><td style="padding:18px 28px;color:#0F1B17;font-size:16px;line-height:1.55">
      <p>Hemos recibido tu solicitud para ${target} para <strong>${partySize}</strong> persona${partySize === 1 ? "" : "s"}.</p>
      <p>Te confirmamos por email cuando revisemos los aforos. Si necesitas cambiar algo, responde a este correo con tu referencia <code>${reservationId}</code>.</p>
    </td></tr>
    <tr><td style="padding:0 28px 28px">
      <a href="https://singlufest.hubstartidea.es/programa" style="display:inline-block;background:#0F1B17;color:#FBF8F1;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">Ver programa</a>
    </td></tr>
    <tr><td style="padding:18px 28px;background:#F5EFE2;color:#4B5752;font-size:12px">
      Singlufest · El festival sin gluten de Granada · @singlufest
    </td></tr>
  </table>
</body></html>`;
}
