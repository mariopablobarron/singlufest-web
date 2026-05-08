import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { ThemedSection } from "./SectionTheme";
import { VoteButton } from "../VoteButton";
import { prisma } from "@/lib/db";
import { buildVoterToken, VOTE_COOKIE_NAME } from "@/lib/voting";
import { loadCandidates } from "@/lib/candidates";

async function loadVoteData(slugs: string[]) {
  try {
    const counts = await prisma.vote.groupBy({
      by: ["candidateSlug"],
      where: { candidateSlug: { in: slugs } },
      _count: true,
    });
    const map = new Map<string, number>(counts.map((c) => [c.candidateSlug, c._count]));

    const jar = await cookies();
    const cookieToken = jar.get(VOTE_COOKIE_NAME)?.value;
    let voted = new Set<string>();
    if (cookieToken) {
      const token = buildVoterToken({ ip: "rsc", cookieToken });
      const own = await prisma.vote.findMany({
        where: { voterToken: token, candidateSlug: { in: slugs } },
        select: { candidateSlug: true },
      });
      voted = new Set(own.map((o) => o.candidateSlug));
    }
    return { map, voted };
  } catch {
    return { map: new Map<string, number>(), voted: new Set<string>() };
  }
}

export async function CartelV2() {
  const candidates = await loadCandidates();

  // Si la BD está vacía, no renderizamos un cartel roto: mostramos un placeholder.
  if (candidates.length === 0) {
    return (
      <ThemedSection alt className="py-24 md:py-32" id="cartel">
        <div className="container max-w-3xl text-center">
          <p className="badge mb-6">Cartel 2026</p>
          <h2 className="text-display-md text-balance">Aún cerrando el cartel.</h2>
          <p className="mt-4 text-ink-muted">Configura los candidatos en /admin/cartel.</p>
        </div>
      </ThemedSection>
    );
  }

  const { map: voteCounts, voted } = await loadVoteData(candidates.map((c) => c.slug));

  return (
    <ThemedSection alt className="py-24 md:py-32" id="cartel">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="badge mb-4">Concurso 2026</p>
            <h2 className="text-display-lg text-balance">
              {candidates.length} candidatos.
              <span className="block h-script text-brand-orange mt-2">1 ganador.</span>
            </h2>
            <p className="mt-4 text-lg text-ink-muted max-w-2xl text-pretty">
              Cada chef presenta <strong className="text-ink">un solo plato</strong> al festival.
              Tú lo pruebas, tú lo votas. Quien gane se lleva el SingluTrofeo 2026 — y la mesa más
              difícil de reservar de Granada el resto del año.
            </p>
          </div>
          <Link href="/cartel" className="btn-primary group">
            Ver todos los candidatos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Top 3 — headliners más grandes */}
        <ul className="grid gap-6 md:grid-cols-3 mb-6">
          {candidates.slice(0, 3).map((c) => (
            <li key={c.id}>
              <Link href={`/partner/${c.slug}`} className="group block">
                <article className={`relative aspect-[4/5] rounded-3xl overflow-hidden grain bg-gradient-to-br ${c.bg} shadow-[0_24px_60px_-20px_rgba(194,68,18,0.45)] transition-transform group-hover:-translate-y-1`}>
                  <div className="absolute inset-0 p-7 flex flex-col">
                    <div className="flex items-start justify-between">
                      <span className="h-brutal text-2xl text-brand-bone/80">#{c.number}</span>
                      {c.badge && (
                        <span className="badge !text-brand-bone !border-brand-bone/40 backdrop-blur">{c.badge}</span>
                      )}
                    </div>
                    <div className="mt-auto">
                      <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/85 mb-2">{c.chef}</p>
                      <h3 className="h-brutal text-display-md text-brand-bone leading-[0.92]">{c.dish}</h3>
                      <p className="mt-4 text-brand-bone/85 text-sm max-w-sm">{c.description}</p>
                      <div className="mt-6 flex items-center justify-between gap-3">
                        <span className="h-brutal text-2xl text-brand-bone glow-orange">
                          {c.price > 0 ? `${c.price}€` : "?"}
                        </span>
                        {c.price > 0 && (
                          <VoteButton
                            slug={c.slug}
                            initialCount={voteCounts.get(c.slug) ?? 0}
                            initialVoted={voted.has(c.slug)}
                            variant="card"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>

        {/* Resto — grid responsive */}
        {candidates.length > 3 && (
          <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6">
            {candidates.slice(3).map((c) => (
              <li key={c.id}>
                <Link href={`/partner/${c.slug}`} className="group block">
                  <article className={`relative aspect-square rounded-2xl overflow-hidden grain bg-gradient-to-br ${c.bg} transition-transform group-hover:-translate-y-1`}>
                    <div className="absolute inset-0 p-5 flex flex-col">
                      <div className="flex items-start justify-between">
                        <span className="h-brutal text-lg text-brand-bone/80">#{c.number}</span>
                        <span className="badge !text-brand-carbon !bg-brand-bone !border-brand-bone backdrop-blur text-[9px] !px-2">
                          0 trazas
                        </span>
                      </div>
                      <div className="mt-auto">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-bone/85 mb-1">{c.chef}</p>
                        <h3 className="h-brutal text-2xl text-brand-bone leading-tight">{c.dish}</h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="h-brutal text-xl text-brand-bone glow-orange">{c.price}€</span>
                          {c.price > 0 && (
                            <VoteButton
                              slug={c.slug}
                              initialCount={voteCounts.get(c.slug) ?? 0}
                              initialVoted={voted.has(c.slug)}
                              variant="card"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Banda explicativa del concurso */}
        <div className="mt-16 rounded-3xl bg-brand-carbon text-brand-bone p-8 md:p-12 grid md:grid-cols-3 gap-8">
          <div>
            <p className="badge !text-brand-orange !border-brand-orange/40 mb-4">Mecánica</p>
            <h3 className="h-brutal text-3xl text-brand-bone">Pruebas. Votas. Decides.</h3>
          </div>
          <div className="space-y-3 text-brand-bone/85">
            <p><strong className="text-brand-orange">1.</strong> Compra tu entrada y recibe tus tickets de degustación.</p>
            <p><strong className="text-brand-orange">2.</strong> Pruebas los platos que quieras durante los 3 días.</p>
            <p><strong className="text-brand-orange">3.</strong> Votas por tu favorito desde la app del festival.</p>
          </div>
          <div className="md:text-right">
            <p className="h-brutal text-5xl text-brand-orange leading-none">5.000€</p>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/70 mt-2">premio al ganador</p>
            <p className="mt-3 text-sm text-brand-bone/85">+ trofeo + portada en SingluFest 2027.</p>
          </div>
        </div>
      </div>
    </ThemedSection>
  );
}
