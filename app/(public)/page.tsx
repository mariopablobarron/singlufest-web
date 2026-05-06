import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { SponsorGrid } from "@/components/SponsorGrid";
import { EventCard } from "@/components/EventCard";
import { VideoWall } from "@/components/VideoWall";
import { prisma } from "@/lib/db";
import { ArrowRight, ChefHat, Coffee, Mic2, Sparkles, Users, Wheat } from "lucide-react";

async function loadHomeData() {
  try {
    const [settings, edition, sponsors, posts] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.edition.findFirst({
        where: { isCurrent: true, isPublished: true },
        include: {
          events: {
            where: { isPublished: true },
            orderBy: { startsAt: "asc" },
            take: 6,
          },
        },
      }),
      prisma.sponsor.findMany({
        where: { isPublished: true },
        orderBy: [{ tier: "asc" }, { order: "asc" }],
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);
    return { settings, edition, sponsors, posts };
  } catch {
    return { settings: null, edition: null, sponsors: [], posts: [] };
  }
}

const PLACEHOLDER_REELS = [
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Showcooking", caption: "Receta sin gluten en directo." },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "El mercado", caption: "+70 expositores en Granada." },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Catas", caption: "Cervezas y pan sin gluten." },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Aftermovie", caption: "Lo que vivimos en la edición pasada." },
];

export default async function HomePage() {
  const { settings, edition, sponsors, posts } = await loadHomeData();
  const bookingsOpen = settings?.bookingsOpen ?? false;
  const editionLabel = edition
    ? edition.startsAt
      ? `${edition.title} · ${new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(edition.startsAt)}`
      : edition.title
    : "Próxima edición";

  return (
    <>
      <Hero bookingsOpen={bookingsOpen} edition={editionLabel} />

      <Marquee
        items={["sin gluten", "showcookings", "catas", "charlas", "talleres", "mercado", "Granada"]}
        className="py-10 border-y border-line bg-bg-alt/30 text-brand-orange"
      />

      <Section
        eyebrow="Sobre el festival"
        id="sobre"
        title={<>Tres días para comer bien <span className="font-script text-brand-orange">sin miedo</span>.</>}
        description="Singlufest reúne en Granada a productores, restauradores, chefs, médicos y miles de personas con celiaquía o sensibilidad al gluten. Es un punto de encuentro, sí, pero sobre todo es una fiesta."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { Icon: ChefHat, title: "Showcookings", body: "Chefs cocinando en directo recetas 100% sin gluten que después puedes hacer en casa." },
            { Icon: Mic2, title: "Charlas", body: "Médicos, nutricionistas y celíacos veteranos contestan dudas sin tecnicismos." },
            { Icon: Coffee, title: "Catas", body: "Cervezas artesanas, pan, repostería y vino: descubre productos que no sabías que existían." },
            { Icon: Wheat, title: "Mercado", body: "+70 expositores con producto que puedes comprar y llevarte a casa." },
            { Icon: Users, title: "Comunidad", body: "Conoce a otros celíacos, intercambia direcciones de confianza y restaurantes." },
            { Icon: Sparkles, title: "Talleres familiares", body: "Actividades para niños celíacos y sus familias. Pan, masas, magdalenas." },
          ].map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="card-elevated h-full transition-all hover:border-brand-orange/40 hover:shadow-glow">
                <Icon className="w-8 h-8 text-brand-orange" aria-hidden />
                <h3 className="mt-5 text-2xl md:text-3xl font-display tracking-tight text-brand-cream">{title}</h3>
                <p className="mt-2 text-ink-muted text-pretty">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {edition && edition.events.length > 0 && (
        <Section
          eyebrow="Programa"
          title={<>Lo que pasará en <span className="font-script text-brand-orange">{edition.title}</span></>}
          description="Una pincelada del programa. La agenda completa y las reservas se abren cuando confirmemos aforos."
          className="border-t border-line"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {edition.events.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.05}>
                <EventCard event={e} editionSlug={edition.slug} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/programa" className="btn-primary group">
              Ver programa completo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Section>
      )}

      <Section
        eyebrow="Vídeos"
        title={<>Lo mejor de <span className="font-script text-brand-orange">@singlufest</span>, en bucle.</>}
        description="Cuando metas las URLs reales en /admin/videos, esta galería se rellena sola. Por ahora son placeholders."
      >
        <VideoWall items={PLACEHOLDER_REELS} />
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/videos" className="btn-primary">Ver todos los vídeos</Link>
          <a
            href="https://www.instagram.com/singlufest/"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Abrir @singlufest
          </a>
        </div>
      </Section>

      <Section
        eyebrow="Patrocinadores"
        title="Hacen posible Singlufest"
        description="Marcas que apuestan por la cocina sin gluten y por Granada como capital del producto local."
        className="border-t border-line"
      >
        <SponsorGrid sponsors={sponsors} />
        <div className="mt-12">
          <Link href="/patrocinadores" className="btn-outline">¿Quieres patrocinar?</Link>
        </div>
      </Section>

      {posts.length > 0 && (
        <Section eyebrow="Blog" title="Lo último que hemos contado">
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <Link href={`/blog/${p.slug}`} className="card-elevated h-full block group transition-all hover:border-brand-orange/40">
                  <p className="badge">
                    {p.publishedAt
                      ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(p.publishedAt)
                      : "Borrador"}
                  </p>
                  <h3 className="mt-4 text-2xl md:text-3xl font-display tracking-tight text-brand-cream group-hover:text-brand-orange transition-colors">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 text-ink-muted line-clamp-3">{p.excerpt}</p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <section className="relative py-24 md:py-32 overflow-hidden border-t border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-ember opacity-80" />
        <div className="container max-w-4xl text-center relative">
          <p className="badge !text-brand-orange !border-brand-orange/40">Reserva tu plaza</p>
          <h2 className="mt-6 text-display-md text-balance">
            Aforo limitado. <span className="font-script text-brand-orange">No te quedes sin sitio.</span>
          </h2>
          <p className="mt-5 text-ink-muted text-pretty max-w-2xl mx-auto">
            Cuando abramos reservas para showcookings y catas, los avisos llegan primero por aquí.
            Apúntate y te escribimos en cuanto suene la campana.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/reservas" className="btn-accent btn-lg">
              {bookingsOpen ? "Reservar ahora" : "Quiero recibir aviso"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/programa" className="btn-outline btn-lg">
              Ver programa
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
