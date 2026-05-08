import { ThemedSection } from "./SectionTheme";

const PHRASES = [
  "POR FIN",
  "SIN MIEDO",
  "SIN TRAZAS",
  "EL ESTATUS DE COMER",
  "PRUEBA. VOTA. DECIDE.",
  "EL PARAÍSO EXISTE",
  "100% SIN GLUTEN",
  "GRANADA",
];

export function MarqueeV2() {
  const row = (
    <div className="flex shrink-0 items-center gap-12 px-8">
      {PHRASES.map((p, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="h-brutal text-5xl md:text-7xl text-ink">{p}</span>
          <span className="text-3xl text-brand-orange" aria-hidden>❀</span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden mask-fade-x py-8 border-y border-ink/10 bg-bg-alt/40">
      <div className="flex marquee-track">
        {row}
        {row}
      </div>
    </section>
  );
}
