import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { ThemedSection } from "./SectionTheme";
import { VoteButton } from "../VoteButton";
import { prisma } from "@/lib/db";
import { buildVoterToken, VOTE_COOKIE_NAME } from "@/lib/voting";

type Candidate = {
  number: string;
  chef: string;
  slug: string;
  dish: string;
  description: string;
  price: number;
  bg: string;             // tailwind classes for card bg gradient
  votes?: number;
  badge?: string;
};

const CANDIDATES: Candidate[] = [
  {
    number: "01",
    chef: "KIMCAKES",
    slug: "kimcakes",
    dish: "La Reina",
    description: "Cheesecake volcánico, almendra tostada y caramelo de cerveza sin gluten.",
    price: 7,
    bg: "from-brand-orange via-brand-tangerine to-brand-burn",
    votes: 0,
    badge: "Headliner",
  },
  {
    number: "02",
    chef: "Carmela",
    slug: "carmela",
    dish: "El Bocadillo Imposible",
    description: "Pan brioche sin gluten relleno de chuletón madurado 60 días y mantequilla ahumada.",
    price: 9,
    bg: "from-brand-wine via-[#9B2A41] to-brand-burn",
    votes: 0,
    badge: "Headliner",
  },
  {
    number: "03",
    chef: "TBA",
    slug: "headliner-3",
    dish: "Próximamente",
    description: "El tercer cabeza de cartel se anuncia el 1 de septiembre.",
    price: 0,
    bg: "from-brand-carbon via-brand-ember to-brand-ink",
    badge: "Headliner",
  },
  {
    number: "04",
    chef: "Tahona Sur",
    slug: "tahona-sur",
    dish: "Croissant 36h",
    description: "Croissant de fermentación lenta, hojaldrado a mano. Crujiente real.",
    price: 4,
    bg: "from-brand-lemon via-brand-orange to-brand-burn",
    votes: 0,
  },
  {
    number: "05",
    chef: "Brewmaster GF",
    slug: "brewmaster-gf",
    dish: "IPA Tres Lúpulos",
    description: "Cerveza artesana 100% sin cebada. Tropical, amarga, peligrosa.",
    price: 5,
    bg: "from-[#F5C56B] via-brand-orange to-brand-burn",
    votes: 0,
  },
  {
    number: "06",
    chef: "Heladería Lunar",
    slug: "heladeria-lunar",
    dish: "Sorbete de Granada",
    description: "Granada del Albaicín, romero del Sacromonte y ralladura de yuzu.",
    price: 4,
    bg: "from-[#E76F51] via-brand-orange to-[#C24412]",
    votes: 0,
  },
  {
    number: "07",
    chef: "Pan de Pueblo",
    slug: "pan-de-pueblo",
    dish: "Hogaza Madre",
    description: "Pan de masa madre 100% sin gluten. Corteza dura, miga aireada. Imposible distinguirlo.",
    price: 6,
    bg: "from-[#CE7C2D] via-brand-orange to-brand-burn",
    votes: 0,
  },
  {
    number: "08",
    chef: "Granada Fermenta",
    slug: "granada-fermenta",
    dish: "Kimchi del Albaicín",
    description: "Fermentado andaluz, picante medio, con tostada de teff. Para los valientes.",
    price: 5,
    bg: "from-[#A4243B] via-brand-wine to-brand-burn",
    votes: 0,
  },
  {
    number: "09",
    chef: "Café Colibrí",
    slug: "cafe-colibri",
    dish: "Brunch Plato",
    description: "Huevos rotos sobre teff con bacon ibérico y pan de molde sin gluten.",
    price: 8,
    bg: "from-[#F4A261] via-brand-orange to-[#C24412]",
    votes: 0,
  },
  {
    number: "10",
    chef: "Quesos del Reyna",
    slug: "quesos-reyna",
    dish: "Tabla del Sur",
    description: "5 quesos curados de pastor + miel de azahar + crackers de garbanzo.",
    price: 9,
    bg: "from-brand-gold via-brand-orange to-brand-burn",
    votes: 0,
  },
  {
    number: "11",
    chef: "Vermut & Co",
    slug: "vermut-co",
    dish: "Vermut Rojo Granadino",
    description: "Vermut de la casa con aceitunas premium y boquerón en vinagre. Sin trampa.",
    price: 4,
    bg: "from-brand-wine via-[#A4243B] to-brand-burn",
    votes: 0,
  },
  {
    number: "12",
    chef: "Dolce Vento",
    slug: "dolce-vento",
    dish: "Tiramisú del Sacromonte",
    description: "Bizcocho de almendra, mascarpone batido, café Colombia. La mejor versión.",
    price: 6,
    bg: "from-[#6B3F2A] via-brand-burn to-brand-carbon",
    votes: 0,
  },
];

async function loadVoteData(slugs: string[]) {
  try {
    const counts = await prisma.vote.groupBy({
      by: ["candidateSlug"],
      where: { candidateSlug: { in: slugs } },
      _count: true,
    });
    const map = new Map<string, number>(counts.map((c) => [c.candidateSlug, c._count]));

    // Cookie del visitante para resaltar sus votos previos.
    const jar = await cookies();
    const cookieToken = jar.get(VOTE_COOKIE_NAME)?.value;
    let voted = new Set<string>();
    if (cookieToken) {
      // No tenemos IP en RSC server-only sin headers; usamos sólo cookie hash. Adecuado para hint UI.
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
  const { map: voteCounts, voted } = await loadVoteData(CANDIDATES.map((c) => c.slug));

  return (
    <ThemedSection alt className="py-24 md:py-32" id="cartel">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="badge mb-4">Concurso 2026</p>
            <h2 className="text-display-lg text-balance">
              12 candidatos.
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
          {CANDIDATES.slice(0, 3).map((c) => (
            <li key={c.number}>
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
                      <h3 className="h-brutal text-display-md text-brand-bone leading-[0.92]">
                        {c.dish}
                      </h3>
                      <p className="mt-4 text-brand-bone/85 text-sm max-w-sm">{c.description}</p>
                      <div className="mt-6 flex items-center justify-between gap-3">
                        <span className="h-brutal text-2xl text-brand-bone glow-orange">
                          {c.price > 0 ? `${c.price}€` : "?"}
                        </span>
                        {c.price > 0 && (
                          <VoteButton
                            slug={c.slug}
                            initialCount={(voteCounts.get(c.slug) ?? 0) + (c.votes ?? 0)}
                            initialVoted={voted.has(c.slug)}
                            variant="card"
                          />
                        )}
                      </div>
                    </div>

                    <span className="absolute top-5 right-5 badge !text-brand-carbon !bg-brand-bone !border-brand-bone backdrop-blur">
                      0 trazas
                    </span>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>

        {/* Resto — grid 4 columnas, más compacto */}
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6">
          {CANDIDATES.slice(3).map((c) => (
            <li key={c.number}>
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
                        <VoteButton
                          slug={c.slug}
                          initialCount={(voteCounts.get(c.slug) ?? 0) + (c.votes ?? 0)}
                          initialVoted={voted.has(c.slug)}
                          variant="card"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>

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
