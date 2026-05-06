import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Patrocinadores" };

const TIERS = ["DIAMOND", "GOLD", "SILVER", "BRONZE", "COLLAB"] as const;
type Tier = (typeof TIERS)[number];

async function createSponsor(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const slug = ((formData.get("slug") as string) || name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const tier = (formData.get("tier") as Tier) || "BRONZE";
  await prisma.sponsor.create({
    data: {
      name,
      slug,
      tier,
      logoUrl: (formData.get("logoUrl") as string) || null,
      websiteUrl: (formData.get("websiteUrl") as string) || null,
      order: Number(formData.get("order") ?? 0),
      isPublished: true,
    },
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/patrocinadores");
  revalidatePath("/");
}

async function deleteSponsor(formData: FormData) {
  "use server";
  await prisma.sponsor.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/sponsors");
}

async function toggleSponsor(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const sp = await prisma.sponsor.findUnique({ where: { id } });
  if (!sp) return;
  await prisma.sponsor.update({ where: { id }, data: { isPublished: !sp.isPublished } });
  revalidatePath("/admin/sponsors");
  revalidatePath("/patrocinadores");
  revalidatePath("/");
}

export default async function SponsorsAdmin() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ tier: "asc" }, { order: "asc" }],
  });

  return (
    <div className="space-y-10">
      <header>
        <p className="badge">Patrocinadores</p>
        <h1 className="mt-3 text-display-md">Logos y colaboradores</h1>
      </header>

      <details className="card">
        <summary className="cursor-pointer font-display text-lg">+ Nuevo patrocinador</summary>
        <form action={createSponsor} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">Nombre</label>
            <input name="name" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Slug (opcional)</label>
            <input name="slug" className="field-input" />
          </div>
          <div>
            <label className="field-label">Tier</label>
            <select name="tier" className="field-input">
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Orden</label>
            <input name="order" type="number" defaultValue={0} className="field-input" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Logo URL</label>
            <input name="logoUrl" type="url" placeholder="https://…" className="field-input" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Web URL</label>
            <input name="websiteUrl" type="url" placeholder="https://…" className="field-input" />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary">Crear patrocinador</button>
          </div>
        </form>
      </details>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((s) => (
          <div key={s.id} className="card flex items-center gap-4">
            {s.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={s.logoUrl} alt={s.name} className="w-16 h-16 object-contain rounded-lg bg-bg p-2" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-bg-alt flex items-center justify-center text-xs text-ink-muted">
                sin logo
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{s.name}</p>
              <p className="text-xs text-ink-muted">{s.tier}</p>
              {s.websiteUrl && (
                <a href={s.websiteUrl} target="_blank" rel="noreferrer" className="text-xs underline truncate block">
                  {s.websiteUrl}
                </a>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <form action={toggleSponsor}>
                <input type="hidden" name="id" value={s.id} />
                <button className={`badge ${s.isPublished ? "!text-brand-green" : "!text-coral"}`}>
                  {s.isPublished ? "On" : "Off"}
                </button>
              </form>
              <form action={deleteSponsor}>
                <input type="hidden" name="id" value={s.id} />
                <button className="btn-ghost text-coral text-xs px-2"><Trash2 className="w-4 h-4" /></button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
