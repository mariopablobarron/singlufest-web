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
    <section className="relative py-32 md:py-40 overflow-hidden bg-brand-orange text-brand-bone">
      <div aria-hidden className="absolute inset-0 grain opacity-30" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-burn/40" />
      <div className="container max-w-4xl text-center relative">
        <p className="badge !text-brand-bone !border-brand-bone/40 mb-6 backdrop-blur">Reserva tu plaza</p>
        <h2 className="text-display-xl text-balance">
          <span className="block h-brutal text-brand-bone leading-[0.92]">El paraíso existe</span>
          <span className="block h-script text-brand-carbon mt-3">y no tiene trazas.</span>
        </h2>
        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-brand-bone/95 text-pretty">
          10 stands. 1 trofeo. 3 días en Granada.
          <span className="block mt-1 text-brand-bone">{ticketsLeft} personas ya tienen su sitio.</span>
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/entradas" className="btn-lg btn !bg-brand-carbon !text-brand-bone hover:!bg-brand-bone hover:!text-brand-carbon group">
            <Ticket className="w-5 h-5" />
            {bookingsOpen ? `Quiero mi entrada · ${generalPrice}€` : "Quiero recibir aviso"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/cartel" className="btn-lg btn !bg-transparent !text-brand-bone !border !border-brand-bone/40 hover:!bg-brand-bone hover:!text-brand-orange">
            ver los candidatos
          </Link>
        </div>
      </div>
    </section>
  );
}
