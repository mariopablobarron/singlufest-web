import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemedSection } from "./SectionTheme";

type Headliner = { name: string; slug: string; tagline?: string };

const HEADLINERS: Headliner[] = [
  { name: "KIMCAKES", slug: "kimcakes", tagline: "Repostería sin trazas" },
  { name: "Carmela", slug: "carmela", tagline: "Obrador premium" },
  { name: "TBA", slug: "headliner-3", tagline: "Próximamente" },
];

const MID_TIER: Headliner[] = [
  { name: "Pan de Pueblo", slug: "pan-de-pueblo" },
  { name: "Brewmaster GF", slug: "brewmaster-gf" },
  { name: "Granada Fermenta", slug: "granada-fermenta" },
  { name: "Heladería Lunar", slug: "heladeria-lunar" },
  { name: "Café Colibrí", slug: "cafe-colibri" },
  { name: "Quesos del Reyna", slug: "quesos-reyna" },
];

const LOWER: string[] = [
  "Tahona Sur", "Brunch Sin Trazas", "Vermut & Co", "Dolce Vento",
  "Cervezas Pícara", "Galletera Granada", "Levadura Madre", "Pico de Veleta",
  "Frutos Sahara", "Aceitunas Pasión", "Harina Andalusí", "Café Bohío",
];

export function CartelV2() {
  return (
    <ThemedSection theme="teatro" className="py-28 md:py-36 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-festival opacity-50" />
      <div className="container max-w-6xl">
        <p className="badge !text-brand-orange !border-brand-orange/40 mb-6">Cartel 2026</p>
        <h2 className="text-display-lg text-balance">
          Cabezas de cartel.
          <span className="block h-script text-brand-orange mt-2">y los que pronto lo serán.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted text-pretty">
          No es una feria de stands. Es un line-up gastronómico curado obrador a obrador.
          Si KIMCAKES y Carmela son tus referencias, tienes una idea — pero esto es solo el principio.
        </p>

        {/* HEADLINERS — gigantes */}
        <ul className="mt-16 grid gap-8 md:grid-cols-3">
          {HEADLINERS.map((h, i) => (
            <li key={h.slug}>
              <Link href={`/partner/${h.slug}`} className="group block">
                <div className="aspect-[4/5] rounded-3xl border border-line bg-brand-ember overflow-hidden relative grain transition-all group-hover:border-brand-orange/60 group-hover:shadow-glow">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <span className="h-brutal text-display-md text-center text-brand-bone group-hover:text-brand-orange transition-colors">
                      {h.name}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="badge !text-brand-orange !border-brand-orange/40 bg-brand-carbon/60 backdrop-blur">
                      Headliner #{i + 1}
                    </span>
                  </div>
                </div>
                {h.tagline && (
                  <p className="mt-3 text-sm text-ink-muted uppercase tracking-[0.18em] text-center">{h.tagline}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* MID TIER */}
        <p className="badge mt-20 mb-6">Y también</p>
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {MID_TIER.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/partner/${m.slug}`}
                className="block aspect-square rounded-2xl border border-line bg-brand-ember/60 flex items-center justify-center p-4 text-center transition-all hover:border-brand-orange/50 hover:bg-brand-ember"
              >
                <span className="h-brutal text-lg text-ink group-hover:text-brand-orange">
                  {m.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* LOWER (estilo poster) */}
        <p className="badge mt-20 mb-6">El resto del cartel</p>
        <p className="text-base md:text-xl text-ink-muted leading-relaxed text-balance">
          {LOWER.map((n, i) => (
            <span key={n}>
              <span className="font-display tracking-tight hover:text-brand-orange transition-colors cursor-default">
                {n}
              </span>
              {i < LOWER.length - 1 && <span className="text-brand-orange/50 mx-2">·</span>}
            </span>
          ))}
        </p>

        <div className="mt-16">
          <Link href="/cartel" className="btn-accent btn-lg group">
            Ver el cartel completo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </ThemedSection>
  );
}
