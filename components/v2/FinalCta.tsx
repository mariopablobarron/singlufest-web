import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import { ThemedSection } from "./SectionTheme";

export function FinalCtaV2({
  bookingsOpen = true,
  ticketsLeft = 312,
  generalPrice = 18,
}: {
  bookingsOpen?: boolean;
  ticketsLeft?: number;
  generalPrice?: number;
}) {
  return (
    <ThemedSection theme="teatro" className="py-32 md:py-40 overflow-hidden border-t border-line">
      <div aria-hidden className="absolute inset-0 -z-10 bg-festival opacity-80" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-spotlight" />
      <div className="container max-w-4xl text-center relative">
        <p className="badge !text-brand-orange !border-brand-orange/40 mb-6">Reserva tu plaza</p>
        <h2 className="text-display-xl text-balance">
          <span className="block h-brutal text-brand-bone">El paraíso existe</span>
          <span className="block h-script text-brand-orange glow-orange mt-3">y no tiene trazas.</span>
        </h2>
        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-brand-bone/80 text-pretty">
          Tres días. Granada. Aforo limitado.
          <span className="block mt-1 text-brand-orange">{ticketsLeft} personas ya tienen la suya.</span>
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/entradas" className="btn-accent btn-xl group">
            <Ticket className="w-5 h-5" />
            {bookingsOpen ? `Quiero mi entrada · ${generalPrice}€` : "Quiero recibir aviso"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/cartel" className="btn-outline btn-lg !text-brand-bone !border-brand-bone/30">
            ver el cartel
          </Link>
        </div>
      </div>
    </ThemedSection>
  );
}
