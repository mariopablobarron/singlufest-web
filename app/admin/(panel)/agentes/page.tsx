import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Sparkles, Newspaper, BarChart3, Video } from "lucide-react";
import { runRedactor } from "@/agents/redactor/run";
import { runAnalista } from "@/agents/analista/run";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agentes IA" };

async function lanzarRedactor() {
  "use server";
  await runRedactor({ trigger: "manual" });
  revalidatePath("/admin/agentes");
  revalidatePath("/admin/posts");
}

async function lanzarAnalista() {
  "use server";
  await runAnalista({ trigger: "manual" });
  revalidatePath("/admin/agentes");
}

const AGENTES = [
  {
    id: "redactor",
    name: "Redactor de blog",
    icon: Newspaper,
    description: "Genera un borrador SEO sobre un tema sin gluten + Granada y lo deja en /admin/posts. Tú revisas y publicas.",
    cron: "Lunes 09:00 (Europa/Madrid)",
    action: lanzarRedactor,
    status: "Disponible",
  },
  {
    id: "analista",
    name: "Analista semanal",
    icon: BarChart3,
    description: "Resumen semanal: tráfico, reservas nuevas, conversiones por landing. Te lo manda a Telegram.",
    cron: "Lunes 07:00 (Europa/Madrid)",
    action: lanzarAnalista,
    status: "Disponible",
  },
  {
    id: "video-builder",
    name: "Generador de Reels (HyperFrames)",
    icon: Video,
    description: "Cada lunes monta un Reel 9:16 con el último post del blog: locución TTS en español + animación + export MP4.",
    cron: "Lunes 11:00 — pendiente de habilitar HyperFrames CLI",
    action: undefined,
    status: "Próximamente",
  },
];

export default async function AgentesAdmin() {
  const runs = await prisma.agentRun.findMany({ orderBy: { ranAt: "desc" }, take: 30 });

  return (
    <div className="space-y-10">
      <header>
        <p className="badge">Agentes IA</p>
        <h1 className="mt-3 text-display-md">Tu equipo invisible</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Pequeños agentes que escriben, analizan y producen contenido por ti. Lánzalos cuando quieras —
          o déjalos en automático con un cron en el VPS.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AGENTES.map((a) => (
          <div key={a.id} className="card-elevated flex flex-col">
            <a.icon className="w-6 h-6 text-accent" />
            <h3 className="mt-4 text-xl font-display">{a.name}</h3>
            <p className="mt-2 text-sm text-ink-muted flex-1">{a.description}</p>
            <p className="mt-4 text-xs text-ink-muted"><strong>Cron:</strong> {a.cron}</p>
            <div className="mt-5">
              {a.action ? (
                <form action={a.action}>
                  <button className="btn-accent w-full">
                    <Sparkles className="w-4 h-4" /> Lanzar ahora
                  </button>
                </form>
              ) : (
                <button className="btn-outline w-full" disabled>{a.status}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="card">
        <h2 className="text-xl font-display">Historial de ejecuciones</h2>
        <table className="w-full text-sm mt-4">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr className="text-left">
              <th className="px-3 py-2">Cuándo</th>
              <th className="px-3 py-2">Agente</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Coste</th>
              <th className="px-3 py-2">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {runs.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-ink-muted">Aún no hay ejecuciones.</td></tr>
            )}
            {runs.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 text-xs text-ink-muted">
                  {new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(r.ranAt)}
                </td>
                <td className="px-3 py-2 font-medium">{r.agent}</td>
                <td className="px-3 py-2">
                  <span className={`badge ${r.status === "ok" ? "!text-brand-green" : "!text-coral"}`}>{r.status}</span>
                </td>
                <td className="px-3 py-2 text-xs">{r.costUsd ? `$${r.costUsd.toFixed(4)}` : "—"}</td>
                <td className="px-3 py-2 text-xs text-ink-muted">
                  {r.tokensIn ? `${r.tokensIn} in / ${r.tokensOut ?? 0} out` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
