import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { settingsSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ajustes" };

async function saveSettings(formData: FormData) {
  "use server";
  const raw = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse({
    ...raw,
    bookingsOpen: raw.bookingsOpen === "on",
  });
  if (!parsed.success) return;

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await prisma.siteSettings.create({ data: parsed.data });
  }
  revalidatePath("/", "layout");
}

async function createEdition(formData: FormData) {
  "use server";
  const year = Number(formData.get("year"));
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || `${year}`;
  await prisma.edition.create({
    data: {
      year,
      title,
      slug,
      isCurrent: formData.get("isCurrent") === "on",
      isPublished: formData.get("isPublished") === "on",
      startsAt: formData.get("startsAt") ? new Date(formData.get("startsAt") as string) : null,
      endsAt: formData.get("endsAt") ? new Date(formData.get("endsAt") as string) : null,
      venue: (formData.get("venue") as string) || null,
      description: (formData.get("description") as string) || null,
    },
  });
  if (formData.get("isCurrent") === "on") {
    // marcar el resto como no-current
    await prisma.edition.updateMany({ where: { year: { not: year } }, data: { isCurrent: false } });
  }
  revalidatePath("/admin/settings");
}

export default async function SettingsAdmin() {
  const settings = await prisma.siteSettings.findFirst();
  const editions = await prisma.edition.findMany({ orderBy: { year: "desc" } });

  return (
    <div className="space-y-10">
      <header>
        <p className="badge">Ajustes</p>
        <h1 className="mt-3 text-display-md">Configuración del festival</h1>
      </header>

      <form action={saveSettings} className="card grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="text-xl font-display">Identidad</h2>
        </div>
        <div>
          <label className="field-label">Nombre</label>
          <input name="festivalName" defaultValue={settings?.festivalName ?? "Singlufest"} className="field-input" required />
        </div>
        <div>
          <label className="field-label">Tagline</label>
          <input name="tagline" defaultValue={settings?.tagline ?? "El festival sin gluten de Granada"} className="field-input" required />
        </div>
        <div>
          <label className="field-label">Email contacto</label>
          <input name="contactEmail" type="email" defaultValue={settings?.contactEmail ?? "hola@singlufest.es"} className="field-input" required />
        </div>
        <div>
          <label className="field-label">Instagram URL</label>
          <input name="instagramUrl" type="url" defaultValue={settings?.instagramUrl ?? "https://www.instagram.com/singlufest/"} className="field-input" required />
        </div>
        <div>
          <label className="field-label">YouTube URL</label>
          <input name="youtubeUrl" type="url" defaultValue={settings?.youtubeUrl ?? ""} className="field-input" />
        </div>
        <div>
          <label className="field-label">TikTok URL</label>
          <input name="tiktokUrl" type="url" defaultValue={settings?.tiktokUrl ?? ""} className="field-input" />
        </div>
        <div>
          <label className="field-label">Hero vídeo URL</label>
          <input name="heroVideoUrl" type="url" defaultValue={settings?.heroVideoUrl ?? ""} className="field-input" />
        </div>
        <div>
          <label className="field-label">Hero poster URL</label>
          <input name="heroPosterUrl" type="url" defaultValue={settings?.heroPosterUrl ?? ""} className="field-input" />
        </div>

        <div className="md:col-span-2"><h2 className="text-xl font-display mt-6">SEO</h2></div>
        <div>
          <label className="field-label">Meta title</label>
          <input name="metaTitle" defaultValue={settings?.metaTitle ?? "Singlufest — Festival Sin Gluten de Granada"} className="field-input" maxLength={70} required />
        </div>
        <div>
          <label className="field-label">OG image URL</label>
          <input name="ogImageUrl" type="url" defaultValue={settings?.ogImageUrl ?? ""} className="field-input" />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Meta description</label>
          <textarea name="metaDescription" rows={2} maxLength={180}
            defaultValue={settings?.metaDescription ?? "Showcookings, charlas, catas y mercado. Granada celebra la cocina sin gluten."}
            className="field-input" required />
        </div>

        <div className="md:col-span-2 flex items-center justify-between gap-4 border-t border-line pt-6">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="bookingsOpen" defaultChecked={settings?.bookingsOpen} className="rounded border-line text-accent" />
            Reservas abiertas (muestra el formulario de /reservas)
          </label>
          <button className="btn-primary">Guardar ajustes</button>
        </div>
      </form>

      <section className="card">
        <h2 className="text-xl font-display">Ediciones</h2>
        <p className="mt-1 text-sm text-ink-muted">Una edición por año. Marca como "actual" la que se muestra en la home.</p>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm">+ Crear edición</summary>
          <form action={createEdition} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Año</label>
              <input name="year" type="number" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Título</label>
              <input name="title" required className="field-input" placeholder="Singlufest 2026" />
            </div>
            <div>
              <label className="field-label">Slug</label>
              <input name="slug" className="field-input" placeholder="2026" />
            </div>
            <div>
              <label className="field-label">Lugar</label>
              <input name="venue" className="field-input" />
            </div>
            <div>
              <label className="field-label">Empieza</label>
              <input name="startsAt" type="datetime-local" className="field-input" />
            </div>
            <div>
              <label className="field-label">Termina</label>
              <input name="endsAt" type="datetime-local" className="field-input" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Descripción</label>
              <textarea name="description" rows={3} className="field-input" />
            </div>
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" name="isCurrent" className="rounded border-line text-accent" /> Edición actual
            </label>
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" name="isPublished" defaultChecked className="rounded border-line text-accent" /> Publicada
            </label>
            <div className="md:col-span-2"><button className="btn-primary">Crear edición</button></div>
          </form>
        </details>

        <ul className="mt-6 divide-y divide-line">
          {editions.map((e) => (
            <li key={e.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{e.title} <span className="text-ink-muted text-sm">({e.year})</span></p>
                <p className="text-xs text-ink-muted">{e.slug}</p>
              </div>
              <div className="flex gap-2">
                {e.isCurrent && <span className="badge !text-brand-green">Actual</span>}
                <span className="badge">{e.isPublished ? "Pública" : "Borrador"}</span>
              </div>
            </li>
          ))}
          {editions.length === 0 && <li className="py-4 text-sm text-ink-muted">Aún no hay ediciones.</li>}
        </ul>
      </section>
    </div>
  );
}
