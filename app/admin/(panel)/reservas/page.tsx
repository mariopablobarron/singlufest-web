import Link from "next/link";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reservas" };

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "WAITLIST"] as const;
type Status = (typeof STATUSES)[number];

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;
  if (!STATUSES.includes(status)) return;
  await prisma.reservation.update({
    where: { id },
    data: {
      status,
      cancelledAt: status === "CANCELLED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/reservas");
}

export default async function ReservasAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: Status }>;
}) {
  const { status } = await searchParams;
  const reservations = await prisma.reservation.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { event: { select: { title: true } }, edition: { select: { title: true } } },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="badge">Reservas</p>
          <h1 className="mt-3 text-display-md">{status ?? "Todas"}</h1>
        </div>
        <a href="/admin/reservas/export" className="btn-outline">
          <Download className="w-4 h-4" /> Exportar CSV
        </a>
      </header>

      <nav className="flex gap-2 flex-wrap">
        <Link href="/admin/reservas" className={`badge ${!status ? "!border-accent !text-accent" : ""}`}>Todas</Link>
        {STATUSES.map((st) => (
          <Link
            key={st}
            href={`/admin/reservas?status=${st}`}
            className={`badge ${status === st ? "!border-accent !text-accent" : ""}`}
          >
            {st}
          </Link>
        ))}
      </nav>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr className="text-left">
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Nombre</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Pers.</th>
              <th className="px-3 py-3">Actividad</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {reservations.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-ink-muted">No hay reservas que mostrar.</td></tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-bg-alt/40">
                <td className="px-3 py-3 text-xs text-ink-muted whitespace-nowrap">
                  {new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(r.createdAt)}
                </td>
                <td className="px-3 py-3 font-medium">{r.name}</td>
                <td className="px-3 py-3 text-ink-muted">
                  <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                </td>
                <td className="px-3 py-3">{r.partySize}</td>
                <td className="px-3 py-3 text-ink-muted">{r.event?.title ?? "Pase general"}</td>
                <td className="px-3 py-3"><span className="badge">{r.status}</span></td>
                <td className="px-3 py-3 text-right">
                  <form action={updateStatus} className="inline-flex gap-1">
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} className="text-xs rounded-lg border-line bg-bg px-2 py-1">
                      {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <button className="btn-outline px-3 py-1 text-xs">Guardar</button>
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
