import Link from "next/link";
import { ThemedSection } from "./SectionTheme";
import { prisma } from "@/lib/db";

type Partner = {
  id?: string;
  name: string;
  logoUrl: string | null;
  websiteUrl?: string | null;
};

const FALLBACK_PARTNERS: Partner[] = [
  { name: "Startidea", logoUrl: "/brand/partners/startidea-color.png", websiteUrl: "https://startidea.es" },
  { name: "Granada Social", logoUrl: "/brand/partners/granadasocial-azul.svg", websiteUrl: "https://granadasocial.org" },
];

async function loadPartners(): Promise<Partner[]> {
  try {
    const list = await prisma.sponsor.findMany({
      where: { isPublished: true, logoUrl: { not: null } },
      orderBy: [{ tier: "asc" }, { order: "asc" }],
      take: 30,
    });
    if (list.length === 0) return FALLBACK_PARTNERS;
    return list;
  } catch {
    return FALLBACK_PARTNERS;
  }
}

export async function PartnersMarqueeV2() {
  const partners = await loadPartners();

  // Marquee infinito necesita el mismo set duplicado para loop continuo.
  // Si hay pocos logos (<6), duplicamos varias veces para que el track sea largo y suave.
  const minSlots = 8;
  const seq: Partner[] = [];
  while (seq.length < minSlots) seq.push(...partners);

  const Tile = ({ p, i }: { p: Partner; i: number }) => {
    const Inner = (
      <div className="relative shrink-0 mx-3 md:mx-5 group">
        <div className="w-[200px] h-[120px] md:w-[240px] md:h-[140px] rounded-2xl border border-ink/10 bg-bg flex items-center justify-center px-6 transition-all duration-500 group-hover:border-brand-orange/60 group-hover:shadow-[0_12px_40px_-12px_rgba(232,93,31,0.45)] group-hover:-translate-y-1">
          {p.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={p.logoUrl}
              alt={p.name}
              className="object-contain max-h-16 md:max-h-20 max-w-full transition-all duration-500"
              loading="lazy"
            />
          ) : (
            <span className="font-display text-xl text-ink">{p.name}</span>
          )}
        </div>
      </div>
    );
    return p.websiteUrl ? (
      <a
        key={`${p.name}-${i}`}
        href={p.websiteUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={p.name}
      >
        {Inner}
      </a>
    ) : (
      <span key={`${p.name}-${i}`} aria-label={p.name}>{Inner}</span>
    );
  };

  return (
    <ThemedSection alt className="py-20 md:py-24 overflow-hidden">
      <div className="container max-w-7xl mb-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="badge mb-3">Partners & Colaboradores</p>
            <h2 className="h-brutal text-3xl md:text-5xl text-ink">
              Ellos hacen posible <span className="text-brand-orange">el festival</span>
            </h2>
          </div>
          <Link href="/b2b" className="btn-primary">
            ¿Quieres ser partner? →
          </Link>
        </div>
      </div>

      {/* Carrusel doble (en sentidos opuestos) — efecto cinta sin fin */}
      <div className="relative mask-fade-x">
        <div className="flex marquee-track py-2">
          {[...seq, ...seq].map((p, i) => <Tile p={p} i={i} key={`top-${i}`} />)}
        </div>
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.22em] text-ink-muted">
        {partners.length} colaboradores y subiendo
      </p>
    </ThemedSection>
  );
}
