import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ticket } from "lucide-react";
import { ThemedSection } from "./SectionTheme";
import { hasOfficialLogo } from "@/lib/brand";
import { LogoTypo } from "../LogoTypo";
import { SITE } from "@/lib/site";

/**
 * Hero v2 — modo teatro full-bleed con vídeo placeholder, frase puñetazo y CTA agresivo.
 * Cuando llegue un vídeo de cabecera real, se sustituye el src del <video>.
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
    <ThemedSection theme="teatro" className="relative isolate overflow-hidden min-h-[92vh] flex items-center">
      {/* Vídeo / fondo cinematográfico */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-spotlight" />
        <div className="absolute inset-0 bg-ember opacity-70" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="container max-w-6xl py-20 md:py-28 relative">
        {/* Badge edición + scarcity */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="badge !text-brand-orange !border-brand-orange/40 backdrop-blur">
            ⚡ {edition}
          </span>
          <span className="badge !text-brand-bone !border-brand-bone/30 backdrop-blur">
            Sold out 2025
          </span>
        </div>

        {/* Logo pequeño arriba si existe */}
        {showLogo && (
          <div className="mb-6 opacity-90">
            <Image
              src="/brand/logo.png"
              alt="SingluFest"
              width={220}
              height={100}
              priority
              className="object-contain w-32 md:w-44 h-auto drop-shadow-[0_0_30px_rgba(232,93,31,0.45)]"
            />
          </div>
        )}
        {!showLogo && <LogoTypo className="mb-6 !text-3xl" />}

        {/* H1 brutal con script emocional */}
        <h1 className="text-display-xl text-balance">
          <span className="block h-brutal text-brand-bone">El paraíso existe.</span>
          <span className="block h-script text-brand-orange glow-orange mt-2 md:mt-4">
            y no tiene trazas.
          </span>
        </h1>

        {/* Sub */}
        <p className="mt-8 max-w-2xl text-lg md:text-2xl text-brand-bone/85 text-pretty">
          El primer festival foodie 100% sin gluten.
          <span className="text-brand-bone"> 70+ obradores premium</span>,
          <span className="text-brand-bone"> 20+ chefs en directo</span>,
          <span className="text-brand-orange"> 0 excusas</span>.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/entradas" className="btn-accent btn-xl group">
            <Ticket className="w-5 h-5" />
            Quiero mi entrada
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="#cartel" className="btn-outline btn-lg !text-brand-bone !border-brand-bone/30 hover:!border-brand-orange hover:!text-brand-orange">
            ver el cartel completo
          </Link>
        </div>

        {/* Scarcity microcopy */}
        <p className="mt-6 text-sm text-brand-bone/70 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-orange animate-flicker" />
          Last release · quedan <strong className="text-brand-orange">{ticketsLeft}</strong> entradas · desde {generalPrice}€
        </p>
      </div>

      {/* Esquina inferior con KPIs ligeros */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 border-t border-line bg-bg/40 backdrop-blur-md">
        <div className="container max-w-6xl py-4 flex flex-wrap gap-x-10 gap-y-2 items-center justify-center md:justify-between text-xs uppercase tracking-[0.22em] text-ink-muted">
          <span>3 días · {SITE.edition.city}</span>
          <span>+70 obradores premium</span>
          <span>20+ showcookings</span>
          <span className="text-brand-orange">100% sin gluten</span>
        </div>
      </div>
    </ThemedSection>
  );
}
