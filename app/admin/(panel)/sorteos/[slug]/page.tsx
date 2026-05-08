import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { pickWinner } from "@/lib/giveaways";
import { ArrowLeft, Trophy, Check, X, Trash2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Detalle de sorteo" };

type Params = Promise<{ slug: string }>;

async function setEntryStatus(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as "VERIFIED" | "REJECTED" | "PENDING";
  await prisma.giveawayEntry.update({
    where: { id },
    data: { status, verifiedAt: status === "VERIFIED" ? new Date() : null, verifiedBy: status === "VERIFIED" ? session.user.id : null },
  });
  revalidatePath(`/admin/sorteos/${formData.get("backSlug")}`);
}

async function deleteEntry(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  await prisma.giveawayEntry.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath(`/admin/sorteos/${formData.get("backSlug")}`);
}

async function drawWinner(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const giveawayId = String(formData.get("giveawayId"));
  const slug = String(formData.get("slug"));

  const verified = await prisma.giveawayEntry.findMany({
    where: { giveawayId, status: "VERIFIED" },
  });
  if (verified.length === 0) redirect(`/admin/sorteos/${slug}?error=novalid`);

  const winner = pickWinner(verified);
  if (!winner) redirect(`/admin/sorteos/${slug}?error=novalid`);

  const giveaway = await prisma.giveaway.update({
    where: { id: giveawayId },
    data: { status: "DRAWN", drawnAt: new Date(), winnerEntryId: winner.id },
  });
  await prisma.giveawayEntry.update({
    where: { id: winner.id },
    data: { status: "WINNER" },
  });

  // notificar ganador (si email es válido, no placeholder)
  if (!winner.email.includes("@instagram.placeholder")) {
    try {
      await sendEmail({
        to: winner.email,
        subject: `¡Has ganado! · ${giveaway.title}`,
        html: `<!doctype html><body style="font-family:sans-serif;background:#FBF6EB;padding:32px">
          <table role="presentation" width="100%" style="max-width:560px;margin:auto;background:#FBF6EB;border:1px solid rgba(11,8,7,.10);border-radius:16px;overflow:hidden">
            <tr><td style="padding:28px 28px 0">
              <p style="margin:0;color:#715A43;font-size:11px;letter-spacing:.22em;text-transform:uppercase">SingluFest · Sorteos</p>
              <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;color:#0B0807">¡Has ganado!</h1>
            </td></tr>
            <tr><td style="padding:18px 28px;color:#0B0807;font-size:15px;line-height:1.6">
              <p>Hola${winner.name ? " " + winner.name : ""}, has sido seleccionado como ganador del sorteo <strong>${giveaway.title}</strong>.</p>
              <p><strong>Premio:</strong> ${giveaway.prize}</p>
              <p>Te contactamos en las próximas 24h para gestionar la entrega.</p>
            </td></tr>
            <tr><td style="padding:18px 28px;background:#F4EAD7;color:#715A43;font-size:11px">
              SingluFest · El paraíso existe y no tiene trazas
            </td></tr>
          </table>
        </body>`,
      });
      await prisma.giveawayEntry.update({
        where: { id: winner.id },
        data: { notifiedAt: new Date() },
      });
    } catch (err) {
      console.error("[giveaway] email ganador failed", err);
    }
  }

  revalidatePath(`/admin/sorteos/${slug}`);
  revalidatePath(`/sorteos/${slug}`);
  redirect(`/admin/sorteos/${slug}?ok=drawn`);
}

async function togglePublish(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const g = await prisma.giveaway.findUnique({ where: { id } });
  if (!g) return;
  await prisma.giveaway.update({ where: { id }, data: { isPublished: !g.isPublished } });
  revalidatePath(`/admin/sorteos/${slug}`);
  revalidatePath("/sorteos");
}

export default async function GiveawayAdminDetail({ params, searchParams }: { params: Params; searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const giveaway = await prisma.giveaway.findUnique({
    where: { slug },
    include: {
      entries: { orderBy: [{ status: "asc" }, { createdAt: "desc" }] },
      _count: { select: { entries: true } },
    },
  });
  if (!giveaway) notFound();

  const counts = giveaway.entries.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] ?? 0) + 1;
      return acc;
    },
    { PENDING: 0, VERIFIED: 0, REJECTED: 0, WINNER: 0 } as Record<string, number>,
  );

  return (
    <div className="space-y-8">
      <Link href="/admin/sorteos" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand-orange">
        <ArrowLeft className="w-4 h-4" /> volver
      </Link>

      <header>
        <p className="badge">{giveaway.status}</p>
        <h1 className="mt-3 text-display-md text-ink">{giveaway.title}</h1>
        <p className="mt-2 text-ink-muted">{giveaway.shortPitch}</p>
      </header>

      {sp.ok === "drawn" && (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-4 py-3 text-sm text-ink">
          ✓ Sorteado. Ganador notificado por email.
        </div>
      )}
      {sp.error === "novalid" && (
        <div className="rounded-xl border border-brand-burn/40 bg-brand-burn/10 px-4 py-3 text-sm text-brand-burn">
          ✗ No hay entradas verificadas para sortear. Verifica al menos 1.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total" value={giveaway._count.entries} />
        <Stat label="Pendientes" value={counts.PENDING} hot={counts.PENDING > 0} />
        <Stat label="Verificadas" value={counts.VERIFIED} />
        <Stat label="Rechazadas" value={counts.REJECTED} />
      </div>

      <div className="flex flex-wrap gap-3">
        {giveaway.status !== "DRAWN" && (
          <form action={drawWinner}>
            <input type="hidden" name="giveawayId" value={giveaway.id} />
            <input type="hidden" name="slug" value={giveaway.slug} />
            <button className="btn-accent" disabled={counts.VERIFIED === 0}>
              <Trophy className="w-4 h-4" /> Sortear ganador ahora
            </button>
          </form>
        )}
        <form action={togglePublish}>
          <input type="hidden" name="id" value={giveaway.id} />
          <input type="hidden" name="slug" value={giveaway.slug} />
          <button className="btn-outline">{giveaway.isPublished ? "Despublicar" : "Publicar"}</button>
        </form>
        <Link href={`/sorteos/${giveaway.slug}`} target="_blank" className="btn-outline">
          <ExternalLink className="w-4 h-4" /> Ver en público
        </Link>
      </div>

      <section className="card overflow-x-auto">
        <h2 className="h-brutal text-xl text-ink mb-4">Entradas</h2>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr className="text-left">
              <th className="px-2 py-2">Estado</th>
              <th className="px-2 py-2">@handle</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">URL post</th>
              <th className="px-2 py-2">Origen</th>
              <th className="px-2 py-2">Fecha</th>
              <th className="px-2 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {giveaway.entries.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-ink-muted">Aún no hay entradas.</td></tr>
            )}
            {giveaway.entries.map((e) => (
              <tr key={e.id}>
                <td className="px-2 py-2"><span className={`badge ${
                  e.status === "VERIFIED" ? "!text-brand-orange !border-brand-orange/40" :
                  e.status === "REJECTED" ? "!text-brand-burn !border-brand-burn/40" :
                  e.status === "WINNER" ? "!text-brand-carbon !bg-brand-lemon !border-brand-lemon" :
                  ""
                }`}>{e.status}</span></td>
                <td className="px-2 py-2"><a className="text-brand-orange underline" href={`https://www.instagram.com/${e.igHandle}/`} target="_blank" rel="noreferrer">@{e.igHandle}</a></td>
                <td className="px-2 py-2 text-xs text-ink-muted">{e.email.replace(/@instagram\.placeholder$/, " (sin email)")}</td>
                <td className="px-2 py-2">
                  {e.sharedPostUrl ? (
                    <a href={e.sharedPostUrl} target="_blank" rel="noreferrer" className="text-xs underline text-brand-orange">ver post ↗</a>
                  ) : <span className="text-xs text-ink-muted">—</span>}
                </td>
                <td className="px-2 py-2 text-xs text-ink-muted">{e.source}</td>
                <td className="px-2 py-2 text-xs text-ink-muted whitespace-nowrap">{new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(e.createdAt)}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1 justify-end">
                    {e.status !== "VERIFIED" && (
                      <form action={setEntryStatus}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="status" value="VERIFIED" />
                        <input type="hidden" name="backSlug" value={giveaway.slug} />
                        <button title="Verificar" className="p-1.5 rounded hover:bg-brand-orange/10 text-brand-orange"><Check className="w-4 h-4" /></button>
                      </form>
                    )}
                    {e.status !== "REJECTED" && (
                      <form action={setEntryStatus}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <input type="hidden" name="backSlug" value={giveaway.slug} />
                        <button title="Rechazar" className="p-1.5 rounded hover:bg-brand-burn/10 text-brand-burn"><X className="w-4 h-4" /></button>
                      </form>
                    )}
                    <form action={deleteEntry}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="backSlug" value={giveaway.slug} />
                      <button title="Eliminar" className="p-1.5 rounded hover:bg-brand-burn/10 text-brand-burn"><Trash2 className="w-4 h-4" /></button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({ label, value, hot = false }: { label: string; value: number; hot?: boolean }) {
  return (
    <div className={`card text-center ${hot ? "border-brand-orange/40" : ""}`}>
      <p className={`h-brutal text-3xl ${hot ? "text-brand-orange" : "text-ink"}`}>{value}</p>
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted mt-1">{label}</p>
    </div>
  );
}
