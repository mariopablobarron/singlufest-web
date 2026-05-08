import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { giveawayAdminSchema } from "@/lib/validations-giveaway";
import { Plus, Gift } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sorteos" };

async function createGiveaway(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const rulesRaw = String(formData.get("rules") || "");
  const parsed = giveawayAdminSchema.safeParse({
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    shortPitch: String(formData.get("shortPitch") || ""),
    description: String(formData.get("description") || ""),
    prize: String(formData.get("prize") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    hashtag: String(formData.get("hashtag") || ""),
    mentionTarget: String(formData.get("mentionTarget") || "singlufest"),
    rules: rulesRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    startsAt: String(formData.get("startsAt") || new Date().toISOString()),
    endsAt: String(formData.get("endsAt") || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    status: String(formData.get("status") || "DRAFT"),
    isPublished: formData.get("isPublished") === "on",
    maxEntries: formData.get("maxEntries") ? Number(formData.get("maxEntries")) : null,
  });
  if (!parsed.success) {
    redirect("/admin/sorteos?error=invalid");
  } else {
    await prisma.giveaway.create({ data: parsed.data });
    revalidatePath("/admin/sorteos");
    revalidatePath("/sorteos");
    redirect("/admin/sorteos?ok=created");
  }
}

export default async function SorteosAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const sp = await searchParams;
  const giveaways = await prisma.giveaway.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entries: true } } },
  });

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="badge">Sorteos</p>
          <h1 className="mt-3 text-display-md">Sorteos online</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Crea sorteos que se promocionan compartiendo en Instagram. El sistema detecta participaciones
            automáticamente si tienes Graph API configurada, y permite verificación manual desde aquí.
          </p>
        </div>
      </header>

      {sp.ok === "created" && (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-4 py-3 text-sm text-ink">
          ✓ Sorteo creado.
        </div>
      )}
      {sp.error === "invalid" && (
        <div className="rounded-xl border border-brand-burn/40 bg-brand-burn/10 px-4 py-3 text-sm text-brand-burn">
          ✗ Datos no válidos. Revisa los campos obligatorios.
        </div>
      )}

      <details className="card">
        <summary className="cursor-pointer h-brutal text-xl text-ink flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-orange" /> Crear sorteo nuevo
        </summary>
        <form action={createGiveaway} className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="field-label">Título</label>
            <input name="title" required className="field-input" placeholder="2 entradas VIP a la primera edición" />
          </div>
          <div>
            <label className="field-label">Slug (URL)</label>
            <input name="slug" required className="field-input" placeholder="entradas-vip-1a-edicion" pattern="[a-z0-9-]+" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Pitch corto</label>
            <input name="shortPitch" required className="field-input" placeholder="Comparte el post del sorteo y entra al pase VIP." maxLength={280} />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Descripción</label>
            <textarea name="description" required className="field-input resize-none" rows={4} placeholder="Cuenta el sorteo en detalle. Saltos de línea respetados." />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Premio</label>
            <input name="prize" required className="field-input" placeholder="2 entradas VIP + acceso 1h antes" />
          </div>
          <div>
            <label className="field-label">Empieza</label>
            <input name="startsAt" type="datetime-local" required className="field-input" defaultValue={new Date().toISOString().slice(0, 16)} />
          </div>
          <div>
            <label className="field-label">Termina</label>
            <input name="endsAt" type="datetime-local" required className="field-input" defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)} />
          </div>
          <div>
            <label className="field-label">Mention target (sin @)</label>
            <input name="mentionTarget" className="field-input" defaultValue="singlufest" />
          </div>
          <div>
            <label className="field-label">Hashtag (sin #)</label>
            <input name="hashtag" className="field-input" placeholder="SingluFestSorteo" />
          </div>
          <div>
            <label className="field-label">Imagen URL (opcional)</label>
            <input name="imageUrl" type="url" className="field-input" />
          </div>
          <div>
            <label className="field-label">Aforo máximo (opcional)</label>
            <input name="maxEntries" type="number" min="1" className="field-input" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Reglas (una por línea)</label>
            <textarea name="rules" className="field-input resize-none" rows={3} placeholder={"Seguir @singlufest\nCompartir el post\nEtiquetar a 2 amigos celíacos"} />
          </div>
          <div>
            <label className="field-label">Estado</label>
            <select name="status" className="field-input" defaultValue="DRAFT">
              <option value="DRAFT">Borrador</option>
              <option value="ACTIVE">Activo</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isPublished" className="rounded" /> Publicado
            </label>
          </div>
          <div className="md:col-span-2">
            <button className="btn-accent">Crear sorteo</button>
          </div>
        </form>
      </details>

      <section>
        <h2 className="h-brutal text-2xl text-ink mb-4">Todos los sorteos</h2>
        {giveaways.length === 0 ? (
          <div className="card text-center py-12">
            <Gift className="w-10 h-10 mx-auto text-ink-muted mb-3" />
            <p className="text-ink-muted">Aún no has creado ningún sorteo.</p>
          </div>
        ) : (
          <ul className="grid gap-4">
            {giveaways.map((g) => (
              <li key={g.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Link href={`/admin/sorteos/${g.slug}`} className="h-brutal text-xl text-ink hover:text-brand-orange">
                    {g.title}
                  </Link>
                  <p className="text-xs text-ink-muted mt-1">
                    /{g.slug} · {g._count.entries} entradas · termina{" "}
                    {new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(g.endsAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    g.status === "ACTIVE" ? "!text-brand-orange !border-brand-orange/40" :
                    g.status === "DRAWN" ? "!text-brand-carbon !bg-brand-lemon !border-brand-lemon" :
                    ""
                  }`}>{g.status}</span>
                  <span className="badge">{g.isPublished ? "Público" : "Oculto"}</span>
                  <Link href={`/admin/sorteos/${g.slug}`} className="btn-outline btn">Gestionar →</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="h-brutal text-xl text-ink mb-3">Detección automática (webhook)</h2>
        <p className="text-sm text-ink-muted">
          Para que el sistema detecte automáticamente cuando alguien menciona <strong>@singlufest</strong> en una story
          o post, configura Graph API:
        </p>
        <ol className="mt-3 list-decimal list-inside text-sm text-ink-muted space-y-1">
          <li>Crea una App en <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer" className="underline">developers.facebook.com</a></li>
          <li>Añade producto Instagram Graph API + Webhooks</li>
          <li>Suscribe a fields: <code>mentions</code> y <code>comments</code></li>
          <li>Callback URL: <code>https://singlufest.hubstartidea.es/api/webhooks/instagram</code></li>
          <li>Mete <code>INSTAGRAM_VERIFY_TOKEN</code> e <code>INSTAGRAM_APP_SECRET</code> en el .env del VPS</li>
        </ol>
        <p className="mt-3 text-xs text-ink-muted">
          Mientras tanto, las entradas se registran como <strong>PENDING</strong> y las apruebas manualmente desde la página de cada sorteo.
        </p>
      </section>
    </div>
  );
}
