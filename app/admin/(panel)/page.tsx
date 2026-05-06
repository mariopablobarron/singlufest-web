import Link from "next/link";
import { prisma } from "@/lib/db";
import { Reveal } from "@/components/Reveal";
import { Calendar, Newspaper, Users, Building2, Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel" };

async function loadStats() {
  const [totalReservations, pending, confirmed, posts, sponsors, events, recentRuns] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.reservation.count({ where: { status: "CONFIRMED" } }),
    prisma.post.count(),
    prisma.sponsor.count(),
    prisma.event.count(),
    prisma.agentRun.findMany({
      orderBy: { ranAt: "desc" },
      take: 5,
    }),
  ]);
  const lastReservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { event: { select: { title: true } } },
  });
  return { totalReservations, pending, confirmed, posts, sponsors, events, recentRuns, lastReservations };
}

export default async function AdminHome() {
  const s = await loadStats();
  return (
    <div className="space-y-10">
      <header>
        <p className="badge">Panel</p>
        <h1 className="mt-3 text-display-md">Bienvenido al control del festival</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Reservas totales", value: s.totalReservations, icon: Users, href: "/admin/reservas" },
          { label: "Pendientes", value: s.pending, icon: Users, href: "/admin/reservas?status=PENDING" },
          { label: "Eventos", value: s.events, icon: Calendar, href: "/admin/eventos" },
          { label: "Patrocinadores", value: s.sponsors, icon: Building2, href: "/admin/sponsors" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Reveal key={label}>
            <Link href={href} className="card-elevated block hover:bg-bg-alt transition">
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-accent" />
                <ArrowRight className="w-4 h-4 text-ink-muted" />
              </div>
              <p className="mt-4 text-3xl font-display">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-display flex items-center justify-between">
            Últimas reservas
            <Link href="/admin/reservas" className="text-xs text-accent">ver todas →</Link>
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {s.lastReservations.length === 0 && (
              <li className="py-4 text-sm text-ink-muted">Aún no hay reservas.</li>
            )}
            {s.lastReservations.map((r) => (
              <li key={r.id} className="py-3 text-sm flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.name}</p>
                  <p className="text-ink-muted text-xs truncate">
                    {r.event?.title ?? "Pase general"} · {r.partySize} pers.
                  </p>
                </div>
                <span className={`badge ${r.status === "CONFIRMED" ? "!text-brand-green" : ""}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-display flex items-center justify-between">
            Agentes IA
            <Link href="/admin/agentes" className="text-xs text-accent">gestionar →</Link>
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {s.recentRuns.length === 0 && (
              <li className="py-4 text-sm text-ink-muted">
                Aún no se ha ejecutado ningún agente. Ve a <Link className="underline" href="/admin/agentes">/admin/agentes</Link>.
              </li>
            )}
            {s.recentRuns.map((r) => (
              <li key={r.id} className="py-3 text-sm flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{r.agent}</p>
                  <p className="text-ink-muted text-xs">
                    {new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(r.ranAt)}
                  </p>
                </div>
                <span className={`badge ${r.status === "ok" ? "!text-brand-green" : "!text-coral"}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-elevated bg-bg-inverse text-ink-inverse">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="badge !border-bg/20 !text-bg/70">¿Cómo va?</p>
            <h3 className="mt-3 text-2xl font-display">Lanza un draft de blog ahora mismo</h3>
            <p className="mt-2 text-bg/80 max-w-xl">
              El agente Redactor genera un borrador SEO sobre cocina sin gluten en Granada y lo deja en /admin/posts en estado borrador.
              Tú revisas, retocas y publicas.
            </p>
          </div>
          <Link href="/admin/agentes" className="btn-accent">
            <Sparkles className="w-4 h-4" />
            Lanzar agente
          </Link>
        </div>
      </div>
    </div>
  );
}
