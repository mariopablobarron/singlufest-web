import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ticket } from "lucide-react";
import { ThemedSection } from "./SectionTheme";
import { hasOfficialLogo } from "@/lib/brand";
import { LogoTypo } from "../LogoTypo";
import { SITE } from "@/lib/site";

/**
 * Hero v2 — Champions-Burger style.
 * Fondo crema cálido con gran foto de plato en columna derecha, headline
 * brutal + "no tiene trazas" en script, CTA naranja vibrante con scarcity.
 */
export function HeroV2({
  bookingsOpen = false,
  edition = SITE.edition.label,
  ticketsLeft = 312,
  generalPrice = 18,
}: {
  bookingsOpen?: boolean;
  edition?: string;
  ticketsLeft?: number;
  generalPrice?: number;
}) {
  const showLogo = hasOfficialLogo();
  return (
    <ThemedSection className="relative isolate overflow-hidden pt-24 md:pt-32 pb-20 md:pb-28">
      {/* Halos cálidos */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-festival" />
      <div aria-hidden className="absolute top-20 -right-32 w-[60rem] h-[60rem] rounded-full bg-brand-orange/10 blur-3xl -z-10" />

      <div className="container grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Columna izquierda — texto */}
        <div className="relative">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="badge-hot">⚡ {edition}</span>
            <span className="badge !text-brand-orange !border-brand-orange/40">Primera edición</span>
          </div>

          {showLogo ? (
            <Image
              src="/brand/logo.png"
              alt="SingluFest"
              width={520}
              height={240}
              priority
              className="mb-8 md:mb-10 object-contain w-56 sm:w-64 md:w-80 lg:w-[22rem] xl:w-[26rem] 3xl:w-[32rem] h-auto drop-shadow-[0_0_30px_rgba(232,93,31,0.35)]"
            />
          ) : (
            <LogoTypo className="mb-8 !text-4xl md:!text-5xl 3xl:!text-6xl" />
          )}

          <h1 className="text-display-xl text-balance">
            <span className="block h-brutal text-ink">El paraíso existe.</span>
            <span className="block h-script text-brand-orange mt-2 md:mt-4">y no tiene trazas.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg md:text-2xl text-ink/80 text-pretty">
            10 stands. 10 iconos gastronómicos. <strong className="text-ink">1 ganador.</strong>
            <br />
            El primer concurso gastronómico 100% sin gluten de España.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/entradas" className="btn-accent btn-xl group">
              <Ticket className="w-5 h-5" />
              Quiero mi entrada
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#cartel" className="btn-outline btn-lg">
              ver los candidatos
            </Link>
          </div>

          <p className="mt-6 text-sm text-ink-muted flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-orange animate-flicker" />
            Last release · quedan <strong className="text-brand-orange">{ticketsLeft}</strong> entradas · desde {generalPrice}€
          </p>
        </div>

        {/* Columna derecha — "plato estrella" placeholder */}
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-orange via-brand-tangerine to-brand-burn relative overflow-hidden grain shadow-[0_30px_60px_-20px_rgba(194,68,18,0.5)]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
              <p className="badge !text-brand-bone !border-brand-bone/40 mb-6 backdrop-blur">El plato del año</p>
              <p className="h-brutal text-display-md text-brand-bone leading-none">LA REINA</p>
              <p className="mt-3 text-brand-bone/85">por KIMCAKES</p>
              <p className="mt-6 text-sm text-brand-bone/75 max-w-xs">
                Tarta volcánica de queso, base de almendra tostada y caramelo de cerveza sin gluten.
              </p>
              <p className="mt-6 h-brutal text-4xl text-brand-bone glow-orange">7€</p>
            </div>
            {/* Etiqueta de seguridad */}
            <span className="absolute top-5 right-5 badge !text-brand-carbon !bg-brand-bone !border-brand-bone backdrop-blur">
              0 trazas
            </span>
            {/* Numeración */}
            <span className="absolute bottom-5 left-5 h-brutal text-2xl text-brand-bone/80">#01</span>
          </div>

          {/* Cartelillo flotante */}
          <div className="hidden md:block absolute -bottom-6 -left-6 rotate-[-4deg] bg-brand-carbon text-brand-bone p-4 rounded-xl shadow-soft">
            <p className="h-brutal text-sm leading-none text-brand-orange">Vota tu favorita</p>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-bone/70 mt-1">Premio del público 2026</p>
          </div>
        </div>
      </div>

      {/* Tira inferior con KPIs */}
      <div className="container mt-20 md:mt-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[
            { kpi: "10", label: "stands en concurso" },
            { kpi: "20+", label: "showcookings en directo" },
            { kpi: "3", label: "días en granada" },
            { kpi: "0%", label: "trazas, sin excusas" },
          ].map((it) => (
            <div key={it.label} className="card text-center">
              <p className="h-brutal text-display-md text-brand-orange glow-orange">{it.kpi}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ink-muted">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </ThemedSection>
  );
}
