import { ThemedSection } from "./SectionTheme";

const FAQS = [
  {
    q: "¿Es 100% seguro para celíacos?",
    a: "Sí. 5 capas de protocolo (cocina dedicada, ELISA aleatorios, formación FACE, trazabilidad QR, cert. AOECS) auditadas por terceros. Si una marca falla, sale del cartel.",
  },
  {
    q: "¿Hay opciones para sensibles al gluten no celíacos?",
    a: "Todo el festival es 100% sin gluten. Si eres sensible no celíaco, te beneficias del mismo nivel de seguridad. Sin trazas para nadie.",
  },
  {
    q: "¿Puedo llevar a personas no celíacas?",
    a: "Por favor, hazlo. Que prueben lo que se están perdiendo y dejen de decir “es que sin gluten no sabe igual”.",
  },
  {
    q: "¿Hay opciones veganas / sin lactosa / sin frutos secos?",
    a: "Sí, casi todos los partners ofrecen variantes. Cada plato lleva ficha visible con alérgenos completos.",
  },
  {
    q: "¿Qué pasa si llueve? ¿Y si me pongo malo?",
    a: "Carpas climatizadas + cobertura sanitaria FACE en el recinto. Plan B integrado, no anecdótico.",
  },
  {
    q: "¿Puedo devolver mi entrada?",
    a: "Hasta 14 días antes del festival con reembolso completo. Después, transferible a otra persona sin coste.",
  },
];

export function FaqV2() {
  return (
    <ThemedSection theme="papel" className="py-24 md:py-32 border-t border-line">
      <div className="container max-w-3xl">
        <p className="badge mb-6">FAQ</p>
        <h2 className="text-display-md text-balance">
          Las preguntas que de verdad importan.
        </h2>

        <ul className="mt-12 divide-y divide-ink/10">
          {FAQS.map((f, i) => (
            <li key={f.q}>
              <details className="group py-6 cursor-pointer">
                <summary className="flex items-center justify-between gap-4 list-none">
                  <span className="text-lg md:text-xl text-ink font-display">
                    <span className="text-brand-orange mr-3">{String(i + 1).padStart(2, "0")}.</span>
                    {f.q}
                  </span>
                  <span className="shrink-0 text-2xl text-brand-orange transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-ink/80 text-pretty pl-10">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </ThemedSection>
  );
}
