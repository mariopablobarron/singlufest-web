import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { FinalCtaV2 } from "@/components/v2/FinalCta";
import { VoteButton } from "@/components/VoteButton";
import { prisma } from "@/lib/db";
import { buildVoterToken, VOTE_COOKIE_NAME } from "@/lib/voting";

export const metadata = {
  title: "Candidato",
};

// Datos por slug — más adelante se mueven a la BD vía /admin/sponsors o /admin/cartel
const PARTNERS: Record<
  string,
  {
    chef: string;
    dish: string;
    description: string;
    longBio: string;
    price: number;
    bg: string;
    votes?: number;
    badge?: string;
    websiteUrl?: string;
    instagramUrl?: string;
    location?: string;
    foundedYear?: number;
  }
> = {
  kimcakes: {
    chef: "KIMCAKES",
    dish: "La Reina",
    description: "Cheesecake volcánico, almendra tostada y caramelo de cerveza sin gluten.",
    longBio:
      "KIMCAKES es el obrador de repostería sin gluten más premiado de España. Empezó como un proyecto familiar en 2018 y hoy distribuye en 30 restaurantes premium. Su 'Reina' fue elegida mejor cheesecake sin gluten de Europa por Pastry Awards 2025.",
    price: 7,
    bg: "from-brand-orange via-brand-tangerine to-brand-burn",
    votes: 0,
    badge: "Headliner",
    websiteUrl: "https://kimcakes.es",
    instagramUrl: "https://www.instagram.com/kimcakes/",
    location: "Granada",
    foundedYear: 2018,
  },
  carmela: {
    chef: "Carmela",
    dish: "El Bocadillo Imposible",
    description: "Pan brioche sin gluten relleno de chuletón madurado 60 días y mantequilla ahumada.",
    longBio:
      "Carmela es un obrador artesano que lleva 12 años perfeccionando masas sin gluten que no tienen nada que envidiar a las tradicionales. Su 'Bocadillo Imposible' es lo que pasa cuando combinas técnica de panadería francesa con producto cárnico premium español.",
    price: 9,
    bg: "from-brand-wine via-[#9B2A41] to-brand-burn",
    votes: 0,
    badge: "Headliner",
    location: "Madrid",
    foundedYear: 2014,
  },
  "headliner-3": {
    chef: "TBA",
    dish: "Próximamente",
    description: "El tercer cabeza de cartel se anuncia el 1 de septiembre.",
    longBio: "Aún bajo embargo. Pista: viene del País Vasco y trabajó con dos chefs Michelin antes de abrir su proyecto.",
    price: 0,
    bg: "from-brand-carbon via-brand-ember to-brand-ink",
    badge: "Headliner",
  },
};

type Params = Promise<{ slug: string }>;

async function loadVoteContext(slug: string, basePriorVotes: number) {
  try {
    const count = await prisma.vote.count({ where: { candidateSlug: slug } });
    const jar = await cookies();
    const cookieToken = jar.get(VOTE_COOKIE_NAME)?.value;
    let voted = false;
    if (cookieToken) {
      const token = buildVoterToken({ ip: "rsc", cookieToken });
      const own = await prisma.vote.findFirst({
        where: { candidateSlug: slug, voterToken: token },
        select: { id: true },
      });
      voted = !!own;
    }
    return { count: count + basePriorVotes, voted };
  } catch {
    return { count: basePriorVotes, voted: false };
  }
}

export default async function PartnerPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = PARTNERS[slug];
  if (!p) notFound();
  const { count: voteCount, voted } = await loadVoteContext(slug, p.votes ?? 0);

  return (
    <>
      <ThemedSection className="pt-24 md:pt-28 pb-10">
        <div className="container">
          <Link href="/cartel" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand-orange transition-colors">
            <ArrowLeft className="w-4 h-4" />
            volver al cartel
          </Link>
        </div>
      </ThemedSection>

      <ThemedSection className="pb-16 md:pb-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-ink-muted mb-3">{p.chef}</p>
            <h1 className="text-display-xl h-brutal text-ink">{p.dish}</h1>
            <p className="mt-6 text-lg md:text-xl text-ink/85 max-w-xl text-pretty">{p.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {p.price > 0 ? (
                <span className="h-brutal text-display-md text-brand-orange glow-orange">{p.price}€</span>
              ) : (
                <span className="badge !text-brand-orange !border-brand-orange/40">Por anunciar</span>
              )}
              {p.price > 0 && (
                <VoteButton
                  slug={slug}
                  initialCount={voteCount}
                  initialVoted={voted}
                  variant="hero"
                />
              )}
              <span className="badge !text-brand-carbon !bg-brand-bone !border-brand-bone">0 trazas</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/entradas" className="btn-accent btn-lg">Quiero probarlo</Link>
              {p.websiteUrl && (
                <a href={p.websiteUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  Ver web
                </a>
              )}
              {p.instagramUrl && (
                <a href={p.instagramUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  Instagram
                </a>
              )}
            </div>
          </div>

          <div className={`relative aspect-[4/5] rounded-3xl bg-gradient-to-br ${p.bg} grain overflow-hidden shadow-[0_30px_60px_-20px_rgba(194,68,18,0.5)]`}>
            <div className="absolute inset-0 p-10 flex flex-col items-center justify-center text-center">
              <p className="badge !text-brand-bone !border-brand-bone/40 backdrop-blur mb-6">
                Plato del año
              </p>
              <p className="h-brutal text-display-md text-brand-bone leading-none">{p.dish}</p>
              <p className="mt-3 text-brand-bone/85">por {p.chef}</p>
            </div>
            <span className="absolute top-5 right-5 badge !text-brand-carbon !bg-brand-bone !border-brand-bone backdrop-blur">
              0 trazas
            </span>
            {p.badge && (
              <span className="absolute bottom-5 left-5 badge !text-brand-bone !border-brand-bone/40 bg-brand-carbon/40 backdrop-blur">
                {p.badge}
              </span>
            )}
          </div>
        </div>
      </ThemedSection>

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-4xl">
          <p className="badge mb-6">Sobre el chef</p>
          <h2 className="text-display-md text-balance">{p.chef}</h2>
          <p className="mt-6 text-lg md:text-xl text-ink/85 text-pretty">{p.longBio}</p>

          <dl className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6">
            {p.location && (
              <div>
                <dt className="text-xs uppercase tracking-[0.22em] text-ink-muted">Ciudad</dt>
                <dd className="mt-1 h-brutal text-2xl text-ink">{p.location}</dd>
              </div>
            )}
            {p.foundedYear && (
              <div>
                <dt className="text-xs uppercase tracking-[0.22em] text-ink-muted">Año fundación</dt>
                <dd className="mt-1 h-brutal text-2xl text-ink">{p.foundedYear}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs uppercase tracking-[0.22em] text-ink-muted">Sello SingluFest</dt>
              <dd className="mt-1 inline-flex items-center gap-2 h-brutal text-xl text-brand-orange">
                <Sparkles className="w-5 h-5" /> Verificado
              </dd>
            </div>
          </dl>
        </div>
      </ThemedSection>

      <FinalCtaV2 ticketsLeft={312} generalPrice={18} />
    </>
  );
}
