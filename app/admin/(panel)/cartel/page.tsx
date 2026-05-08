import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cartel · admin" };

const candidateSchema = z.object({
  number: z.string().min(1).max(4),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, "Solo a-z 0-9 y guión"),
  chef: z.string().min(1).max(80),
  dish: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  longBio: z.string().max(2000).optional().or(z.literal("")),
  price: z.coerce.number().int().min(0).max(999),
  bg: z.string().min(1),
  badge: z.string().max(40).optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().max(80).optional().or(z.literal("")),
  foundedYear: z.coerce.number().int().min(1800).max(2100).optional().or(z.nan()),
  order: z.coerce.number().int().default(99),
  isPublished: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
});

async function saveCandidate(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const raw = Object.fromEntries(formData.entries());
  const parsed = candidateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/cartel?err=${encodeURIComponent(parsed.error.issues[0]?.message ?? "validation")}`);
  }
  const data: Record<string, unknown> = { ...parsed.data };
  // Limpia opcionales vacíos
  for (const k of ["longBio", "badge", "websiteUrl", "instagramUrl", "imageUrl", "location"]) {
    if (data[k] === "") data[k] = null;
  }
  if (Number.isNaN(data.foundedYear)) data.foundedYear = null;

  if (id) {
    await prisma.candidate.update({ where: { id }, data: data as never });
  } else {
    await prisma.candidate.create({ data: data as never });
  }
  revalidatePath("/admin/cartel");
  revalidatePath("/", "layout");
  redirect("/admin/cartel?ok=saved");
}

async function deleteCandidate(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (id) {
    await prisma.candidate.delete({ where: { id } });
    revalidatePath("/admin/cartel");
    revalidatePath("/", "layout");
  }
  redirect("/admin/cartel?ok=deleted");
}

async function togglePublished(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const current = await prisma.candidate.findUnique({ where: { id } });
  if (!current) redirect("/admin/cartel");
  await prisma.candidate.update({ where: { id }, data: { isPublished: !current!.isPublished } });
  revalidatePath("/admin/cartel");
  revalidatePath("/", "layout");
  redirect("/admin/cartel?ok=toggled");
}

const BG_PRESETS = [
  { label: "Naranja brillante", value: "from-brand-orange via-brand-tangerine to-brand-burn" },
  { label: "Vino", value: "from-brand-wine via-[#9B2A41] to-brand-burn" },
  { label: "Carbón profundo", value: "from-brand-carbon via-brand-ember to-brand-ink" },
  { label: "Limón a brasa", value: "from-brand-lemon via-brand-orange to-brand-burn" },
  { label: "Coral", value: "from-[#E76F51] via-brand-orange to-[#C24412]" },
  { label: "Madera quemada", value: "from-[#CE7C2D] via-brand-orange to-brand-burn" },
  { label: "Granate", value: "from-[#A4243B] via-brand-wine to-brand-burn" },
  { label: "Mostaza", value: "from-[#F4A261] via-brand-orange to-[#C24412]" },
  { label: "Oro", value: "from-brand-gold via-brand-orange to-brand-burn" },
  { label: "Tierra Sacromonte", value: "from-[#6B3F2A] via-brand-burn to-brand-carbon" },
];

type SearchParams = Promise<{ edit?: string; ok?: string; err?: string }>;

export default async function CartelAdmin({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const candidates = await prisma.candidate.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const editing = sp.edit ? candidates.find((c) => c.id === sp.edit) ?? null : null;
  const isNew = sp.edit === "new";
  const formCandidate = isNew ? null : editing;

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="badge">Admin · Cartel</p>
          <h1 className="mt-3 text-display-md">Candidatos del concurso</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Gestiona los chefs, sus platos, precios, badges y orden. Lo que aquí publiques aparece en /cartel y en /partner/[slug].
          </p>
        </div>
        <Link href="/admin/cartel?edit=new" className="btn-accent">+ Nuevo candidato</Link>
      </header>

      {sp.ok && (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-4 py-3 text-sm">
          ✓ {sp.ok === "saved" ? "Candidato guardado" : sp.ok === "deleted" ? "Candidato eliminado" : "Estado actualizado"}.
        </div>
      )}
      {sp.err && (
        <div className="rounded-xl border border-brand-burn/40 bg-brand-burn/10 px-4 py-3 text-sm text-brand-burn">
          ✗ {sp.err}
        </div>
      )}

      {(isNew || editing) && (
        <section className="card-elevated">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display">
              {isNew ? "Nuevo candidato" : `Editando: ${editing?.dish} (#${editing?.number})`}
            </h2>
            <Link href="/admin/cartel" className="text-sm text-ink-muted hover:text-ink">Cerrar</Link>
          </header>

          <form action={saveCandidate} className="grid gap-4 md:grid-cols-2">
            {formCandidate?.id && <input type="hidden" name="id" defaultValue={formCandidate.id} />}

            <div>
              <label className="field-label">Número (#)</label>
              <input name="number" defaultValue={formCandidate?.number ?? ""} required maxLength={4} className="field-input" placeholder="01" />
            </div>
            <div>
              <label className="field-label">Slug (URL)</label>
              <input name="slug" defaultValue={formCandidate?.slug ?? ""} required pattern="[a-z0-9-]+" className="field-input" placeholder="kimcakes" />
            </div>
            <div>
              <label className="field-label">Chef / Marca</label>
              <input name="chef" defaultValue={formCandidate?.chef ?? ""} required className="field-input" placeholder="KIMCAKES" />
            </div>
            <div>
              <label className="field-label">Plato</label>
              <input name="dish" defaultValue={formCandidate?.dish ?? ""} required className="field-input" placeholder="La Reina" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Descripción corta (cards)</label>
              <textarea name="description" defaultValue={formCandidate?.description ?? ""} required rows={2} className="field-input resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Bio larga del chef (página individual, opcional)</label>
              <textarea name="longBio" defaultValue={formCandidate?.longBio ?? ""} rows={4} className="field-input resize-none" />
            </div>

            <div>
              <label className="field-label">Precio (€) — 0 = "por anunciar"</label>
              <input name="price" type="number" min={0} max={999} defaultValue={formCandidate?.price ?? 0} className="field-input" />
            </div>
            <div>
              <label className="field-label">Badge (opcional)</label>
              <input name="badge" defaultValue={formCandidate?.badge ?? ""} className="field-input" placeholder="Headliner" />
            </div>

            <div className="md:col-span-2">
              <label className="field-label">Color de fondo (preset)</label>
              <select name="bg" defaultValue={formCandidate?.bg ?? BG_PRESETS[0].value} className="field-input">
                {BG_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">URL web (opcional)</label>
              <input name="websiteUrl" type="url" defaultValue={formCandidate?.websiteUrl ?? ""} className="field-input" />
            </div>
            <div>
              <label className="field-label">URL Instagram (opcional)</label>
              <input name="instagramUrl" type="url" defaultValue={formCandidate?.instagramUrl ?? ""} className="field-input" />
            </div>
            <div>
              <label className="field-label">Imagen del plato URL (opcional)</label>
              <input name="imageUrl" type="url" defaultValue={formCandidate?.imageUrl ?? ""} className="field-input" />
            </div>
            <div>
              <label className="field-label">Ciudad (opcional)</label>
              <input name="location" defaultValue={formCandidate?.location ?? ""} className="field-input" placeholder="Granada" />
            </div>
            <div>
              <label className="field-label">Año de fundación (opcional)</label>
              <input name="foundedYear" type="number" min={1800} max={2100} defaultValue={formCandidate?.foundedYear ?? ""} className="field-input" />
            </div>
            <div>
              <label className="field-label">Orden (menor = antes)</label>
              <input name="order" type="number" defaultValue={formCandidate?.order ?? 99} className="field-input" />
            </div>

            <label className="md:col-span-2 flex items-center gap-3 text-sm">
              <input type="checkbox" name="isPublished" defaultChecked={formCandidate?.isPublished ?? true} className="rounded border-line text-accent" />
              Publicado en el cartel
            </label>

            <div className="md:col-span-2 flex items-center justify-between gap-4 border-t border-line pt-5">
              <p className="text-xs text-ink-muted">Cambios visibles inmediatamente en /cartel y /partner/[slug].</p>
              <button className="btn-primary">{isNew ? "Crear candidato" : "Guardar cambios"}</button>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <h2 className="text-xl font-display mb-4">Listado ({candidates.length})</h2>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr className="text-left border-b border-line">
              <th className="px-2 py-2 w-12">#</th>
              <th className="px-2 py-2">Chef · Plato</th>
              <th className="px-2 py-2 hidden md:table-cell">Precio</th>
              <th className="px-2 py-2 hidden lg:table-cell">Badge</th>
              <th className="px-2 py-2">Estado</th>
              <th className="px-2 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {candidates.map((c) => (
              <tr key={c.id}>
                <td className="px-2 py-3 font-display text-brand-orange">{c.number}</td>
                <td className="px-2 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{c.chef}</p>
                  <p className="font-display text-base">{c.dish}</p>
                </td>
                <td className="px-2 py-3 hidden md:table-cell">{c.price > 0 ? `${c.price}€` : "—"}</td>
                <td className="px-2 py-3 hidden lg:table-cell text-xs">{c.badge ?? "—"}</td>
                <td className="px-2 py-3">
                  <form action={togglePublished} className="inline">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider hover:text-brand-orange">
                      {c.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {c.isPublished ? "Público" : "Oculto"}
                    </button>
                  </form>
                </td>
                <td className="px-2 py-3 text-right">
                  <Link href={`/admin/cartel?edit=${c.id}`} className="inline-flex items-center gap-1 text-sm hover:text-brand-orange">
                    <Pencil className="w-4 h-4" /> Editar
                  </Link>
                  <form action={deleteCandidate} className="inline ml-3">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="inline-flex items-center gap-1 text-sm text-brand-burn hover:text-brand-wine">
                      <Trash2 className="w-4 h-4" /> Borrar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-ink-muted">
                Aún no hay candidatos. <Link className="underline" href="/admin/cartel?edit=new">Añade el primero →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
