import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { GiveawayForm } from "@/components/GiveawayForm";
import { loadGiveawayBySlug, isGiveawayOpen } from "@/lib/giveaways";
import { ArrowLeft, Gift, Clock, Trophy, Instagram } from "lucide-react";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const g = await loadGiveawayBySlug(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.shortPitch,
    openGraph: { title: g.title, description: g.shortPitch, images: g.imageUrl ? [g.imageUrl] : [] },
  };
}

export default async function GiveawayPage({ params }: { params: Params }) {
  const { slug } = await params;
  const g = await loadGiveawayBySlug(slug);
  if (!g || !g.isPublished) notFound();

  const open = isGiveawayOpen(g);
  const winning = g.status === "DRAWN";
  const daysLeft = Math.max(0, Math.ceil((g.endsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <>
      <ThemedSection className="pt-20 md:pt-24 pb-6">
        <div className="container">
          <Link href="/sorteos" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand-orange transition-colors">
            <ArrowLeft className="w-4 h-4" /> volver a sorteos
          </Link>
        </div>
      </ThemedSection>

      <ThemedSection className="pb-12 md:pb-16">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {open ? (
                <span className="badge !text-brand-orange !border-brand-orange/40 inline-flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange animate-flicker" /> Activo · cierra en {daysLeft}d
                </span>
              ) : winning ? (
                <span className="badge !text-brand-carbon !bg-brand-lemon !border-brand-lemon">
                  <Trophy className="w-3 h-3" /> Ganador anunciado
                </span>
              ) : (
                <span className="badge">Cerrado</span>
              )}
              <span className="badge inline-flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {g._count.entries} participantes
              </span>
            </div>

            <h1 className="h-brutal text-display-md md:text-display-lg text-ink">{g.title}</h1>
            <p className="mt-5 text-lg md:text-xl text-ink/85 text-pretty">{g.shortPitch}</p>

            <div className="mt-8 rounded-2xl bg-brand-carbon text-brand-bone p-6 md:p-8 grain">
              <p className="badge !text-brand-orange !border-brand-orange/40 mb-3">El premio</p>
              <p className="h-brutal text-2xl md:text-3xl">{g.prize}</p>
            </div>

            {g.description && (
              <article className="mt-10 prose prose-lg max-w-none text-ink/85 prose-strong:text-ink prose-a:text-brand-orange whitespace-pre-line">
                {g.description}
              </article>
            )}

            {g.rules && g.rules.length > 0 && (
              <div className="mt-10">
                <p className="badge mb-4">Reglas del sorteo</p>
                <ul className="space-y-2">
                  {g.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink/85">
                      <span className="text-brand-orange">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-32">
            {open ? (
              <GiveawayForm slug={g.slug} mentionTarget={g.mentionTarget} hashtag={g.hashtag} />
            ) : winning ? (
              <div className="rounded-3xl bg-brand-lemon text-brand-carbon p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3" />
                <p className="badge !bg-brand-carbon !text-brand-lemon !border-brand-carbon mb-3">Sorteado</p>
                <h3 className="h-brutal text-2xl">El ganador ya tiene email.</h3>
                <p className="mt-3 text-brand-carbon/85">
                  Próximo sorteo pronto. Sigue a{" "}
                  <a href="https://www.instagram.com/singlufest/" className="underline">@singlufest</a> para no perdértelo.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-ink/10 bg-bg-alt p-8 text-center">
                <Gift className="w-10 h-10 mx-auto mb-3 text-ink-muted" />
                <h3 className="h-brutal text-xl text-ink">Este sorteo está cerrado</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Estamos preparando el siguiente.
                </p>
                <Link href="/sorteos" className="btn-outline mt-5">Ver sorteos activos</Link>
              </div>
            )}
            <div className="mt-6 rounded-2xl border border-ink/10 bg-bg p-5 text-sm text-ink-muted text-center">
              <p className="flex items-center justify-center gap-2">
                <Instagram className="w-4 h-4 text-brand-orange" />
                Síguenos en{" "}
                <a href="https://www.instagram.com/singlufest/" target="_blank" rel="noreferrer" className="underline text-brand-orange font-semibold">
                  @{g.mentionTarget}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </ThemedSection>
    </>
  );
}
