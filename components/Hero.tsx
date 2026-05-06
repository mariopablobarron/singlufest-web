import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hasOfficialLogo } from "@/lib/brand";
import { HeroLogo } from "./HeroLogo";
import { LogoTypo } from "./Logo";
import { HeroOrnaments } from "./HeroOrnaments";
import { HeroBadge } from "./HeroBadge";

/**
 * Hero cinematográfico server-side. Las animaciones cliente viven en HeroLogo,
 * HeroBadge y HeroOrnaments para no tirar de "use client" en el componente padre.
 */
export function Hero({
  bookingsOpen = false,
  edition = "Próxima edición",
}: {
  bookingsOpen?: boolean;
  edition?: string;
}) {
  const showLogo = hasOfficialLogo();
  return (
    <section className="relative isolate overflow-hidden pt-20 md:pt-28 pb-28 md:pb-40">
      <HeroOrnaments />

      <div className="container max-w-7xl text-center relative">
        <HeroBadge edition={edition} />

        {showLogo ? (
          <HeroLogo />
        ) : (
          <div className="my-12">
            <LogoTypo className="!text-7xl md:!text-9xl scale-150" />
          </div>
        )}

        <p className="mt-6 font-script text-3xl md:text-5xl text-ink animate-fade-up">
          el festival sin gluten <span className="text-brand-orange">de Granada</span>
        </p>

        <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-ink-muted text-pretty animate-fade-up">
          Showcookings, charlas, catas y mercado.
          Tres días para que celíacos, sensibles y curiosos coman, aprendan y se diviertan
          —todo en el corazón de Granada, todo sin gluten.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-fade-up">
          {bookingsOpen ? (
            <Link href="/reservas" className="btn-accent btn-lg group">
              Reservar plaza
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link href="/programa" className="btn-accent btn-lg group">
              Ver el programa
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <Link href="#sobre" className="btn-outline btn-lg">
            ¿Qué es Singlufest?
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-4xl mx-auto">
          {[
            { kpi: "+70", label: "expositores" },
            { kpi: "20+", label: "showcookings" },
            { kpi: "3", label: "días" },
            { kpi: "100%", label: "sin gluten" },
          ].map((it) => (
            <div key={it.label} className="card text-center backdrop-blur-md">
              <p className="font-display text-4xl md:text-5xl text-brand-orange glow-orange">{it.kpi}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ink-muted">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
