import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Programa" };

async function createEvent(formData: FormData) {
  "use server";
  const editionId = formData.get("editionId") as string;
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const startsAt = new Date(formData.get("startsAt") as string);
  const kind = (formData.get("kind") as string) || "OTRO";
  const venue = (formData.get("venue") as string) || null;
  const priceCents = Number(formData.get("priceCents") ?? 0);
  await prisma.event.create({
    data: {
      editionId,
      title,
      slug,
      startsAt,
      kind: kind as "SHOWCOOKING" | "CHARLA" | "CATA" | "TALLER" | "CONCIERTO" | "MERCADO" | "OTRO",
      venue,
      priceCents,
      isPublished: true,
    },
  });
  revalidatePath("/admin/eventos");
  revalidatePath("/programa");
  revalidatePath("/");
}

async function deleteEvent(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/eventos");
  revalidatePath("/programa");
}

async function togglePublish(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return;
  await prisma.event.update({ where: { id }, data: { isPublished: !event.isPublished } });
  revalidatePath("/admin/eventos");
}

export default async function EventosAdmin() {
  const editions = await prisma.edition.findMany({ orderBy: { year: "desc" } });
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "asc" },
    include: { edition: { select: { title: true, year: true } } },
  });
  const currentEdition = editions.find((e) => e.isCurrent) ?? editions[0];

  return (
    <div className="space-y-10">
      <header>
        <p className="badge">Programa</p>
        <h1 className="mt-3 text-display-md">Eventos del festival</h1>
      </header>

      {currentEdition && (
        <details className="card">
          <summary className="cursor-pointer font-display text-lg">+ Nuevo evento</summary>
          <form action={createEvent} className="mt-6 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="editionId" value={currentEdition.id} />
            <div>
              <label className="field-label">Título</label>
              <input name="title" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Slug (opcional)</label>
              <input name="slug" className="field-input" />
            </div>
            <div>
              <label className="field-label">Tipo</label>
              <select name="kind" className="field-input">
                {["SHOWCOOKING", "CHARLA", "CATA", "TALLER", "CONCIERTO", "MERCADO", "OTRO"].map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Comienza</label>
              <input name="startsAt" type="datetime-local" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Lugar</label>
              <input name="venue" className="field-input" />
            </div>
            <div>
              <label className="field-label">Precio (céntimos, 0 = gratis)</label>
              <input name="priceCents" type="number" min={0} defaultValue={0} className="field-input" />
            </div>
            <div className="md:col-span-2">
              <button className="btn-primary">Crear evento</button>
            </div>
          </form>
        </details>
      )}

      {!currentEdition && (
        <div className="card">
          <p>Aún no has creado ninguna edición. Ve a <strong>Ajustes</strong> para crear una.</p>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr className="text-left">
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Título</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-ink-muted">Sin eventos. Crea el primero arriba.</td></tr>
            )}
            {events.map((e) => (
              <tr key={e.id}>
                <td className="px-3 py-3 text-xs text-ink-muted whitespace-nowrap">
                  {new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(e.startsAt)}
                </td>
                <td className="px-3 py-3 font-medium">{e.title}</td>
                <td className="px-3 py-3"><span className="badge">{e.kind}</span></td>
                <td className="px-3 py-3">
                  <form action={togglePublish}>
                    <input type="hidden" name="id" value={e.id} />
                    <button className={`badge ${e.isPublished ? "!text-brand-green" : "!text-coral"}`}>
                      {e.isPublished ? "Publicado" : "Borrador"}
                    </button>
                  </form>
                </td>
                <td className="px-3 py-3 text-right">
                  <form action={deleteEvent} className="inline">
                    <input type="hidden" name="id" value={e.id} />
                    <button className="btn-ghost text-coral text-xs px-2"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
