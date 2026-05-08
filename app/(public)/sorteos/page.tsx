import Link from "next/link";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { loadActiveGiveaways, isGiveawayOpen } from "@/lib/giveaways";
import { Gift, Clock, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sorteos",
  description: "Sorteos del SingluFest. Comparte en Instagram, menciona @singlufest y participa en los premios.",
};

export default async function SorteosIndex() {
  const giveaways = await loadActiveGiveaways();

  return (
    <>
      <ThemedSection className="pt-24 md:pt-28 pb-12">
        <div className="container max-w-3xl text-center">
          <p className="badge mb-5">Sorteos · @singlufest</p>
          <h1 className="h-brutal text-display-md md:text-display-lg text-ink text-balance">
            Comparte. Menciona.
            <span className="block h-script text-brand-orange mt-2">gana.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-ink-muted text-pretty">
            Comparte un post del SingluFest en tu Instagram, menciona <strong className="text-ink">@singlufest</strong> y entras al sorteo.
            Cuando se cierra, sorteamos en directo y te avisamos por email si ganas.
          </p>
        </div>
      </ThemedSection>

      <ThemedSection alt className="py-16 md:py-20">
        <div className="container max-w-6xl">
          {giveaways.length === 0 ? (
            <div className="rounded-3xl border border-ink/10 bg-bg p-10 md:p-14 text-center">
              <Gift className="w-12 h-12 mx-auto text-brand-orange mb-4" />
              <h2 className="h-brutal text-2xl md:text-3xl text-ink">Sin sorteos activos ahora mismo</h2>
              <p className="mt-3 text-ink-muted max-w-lg mx-auto">
                Sigue a <a href="https://www.instagram.com/singlufest/" target="_blank" rel="noreferrer" className="underline text-brand-orange">@singlufest</a> en Instagram
                para enterarte cuando publiquemos el siguiente.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {giveaways.map((g) => {
                const open = isGiveawayOpen(g);
                const winning = g.status === "DRAWN";
                return (
                  <li key={g.id}>
                    <Link href={`/sorteos/${g.slug}`} className="card-elevated h-full block group transition-transform hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        {open ? (
                          <span className="badge !text-brand-orange !border-brand-orange/40 inline-flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange animate-flicker" />
                            Activo
                          </span>
                        ) : winning ? (
                          <span className="badge !text-brand-carbon !bg-brand-lemon !border-brand-lemon">
                            <Trophy className="w-3 h-3" /> Ganador anunciado
                          </span>
                        ) : (
                          <span className="badge">Cerrado</span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                          <Clock className="w-3 h-3" />
                          {Math.max(0, Math.ceil((g.endsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d
                        </span>
                      </div>
                      {g.imageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={g.imageUrl} alt={g.title} className="aspect-[4/3] w-full rounded-xl object-cover mb-4" />
                      )}
                      <h3 className="h-brutal text-2xl text-ink group-hover:text-brand-orange transition-colors">{g.title}</h3>
                      <p className="mt-2 text-sm text-ink-muted text-pretty">{g.shortPitch}</p>
                      <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
                        <span>{g._count.entries} participantes</span>
                        <span className="font-semibold text-brand-orange">Ver sorteo →</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ThemedSection>

      <ThemedSection className="py-16 md:py-20">
        <div className="container max-w-3xl">
          <p className="badge mb-5">Cómo funciona</p>
          <ol className="space-y-6">
            {[
              { n: "1", t: "Elige un sorteo activo", d: "Cada uno tiene su propio premio y reglas concretas." },
              { n: "2", t: "Comparte en Instagram", d: "Story o post con mención a @singlufest y/o el hashtag del sorteo." },
              { n: "3", t: "Rellena el formulario", d: "Pasa tu @handle y la URL del post para que podamos verificarlo." },
              { n: "4", t: "Espera al sorteo", d: "Cuando se cierre, sorteamos entre las entradas verificadas y avisamos al ganador por email." },
            ].map((s) => (
              <li key={s.n} className="grid grid-cols-[48px_1fr] gap-5 items-start">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-orange text-bg h-brutal text-xl">{s.n}</span>
                <div>
                  <h3 className="h-brutal text-xl text-ink">{s.t}</h3>
                  <p className="mt-1 text-ink-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </ThemedSection>
    </>
  );
}
