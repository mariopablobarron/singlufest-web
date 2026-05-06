import Link from "next/link";
import { ThemedSection } from "./SectionTheme";
import { ShieldCheck, FileSearch, GraduationCap, Workflow, BadgeCheck } from "lucide-react";

const SEALS = [
  {
    Icon: ShieldCheck,
    title: "Cocina dedicada",
    body: "Todos los candidatos cocinan en líneas exclusivas sin gluten. Cero cocinas compartidas.",
  },
  {
    Icon: FileSearch,
    title: "Auditoría externa",
    body: "Análisis ELISA aleatorios durante el evento. Si un plato falla, el chef sale del concurso.",
  },
  {
    Icon: GraduationCap,
    title: "Formación obligatoria",
    body: "El 100% del personal pasa el curso FACE antes de pisar el recinto.",
  },
  {
    Icon: Workflow,
    title: "Trazabilidad total",
    body: "Cada plato lleva un QR con el lote y el responsable. Reclamación con un escaneo.",
  },
  {
    Icon: BadgeCheck,
    title: "Certificación AOECS",
    body: "Candidatos verificados por la asociación europea de celiaquía. Sello visible en el stand.",
  },
];

export function ProtocolV2() {
  return (
    <ThemedSection alt className="py-28 md:py-36">
      <div className="container max-w-6xl">
        <p className="badge mb-6">Seguridad</p>
        <h2 className="text-display-lg text-balance">
          Cero trazas.
          <span className="block h-script text-brand-orange mt-2">no es un eslogan, es un protocolo auditado.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted text-pretty">
          Vienes a comer tranquilo. Para eso hay 5 capas de seguridad que firmamos por escrito
          con cada candidato antes de que entre al festival.
        </p>

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SEALS.map(({ Icon, title, body }, i) => (
            <li key={title} className="rounded-3xl bg-bg p-7 border border-ink/10">
              <div className="flex items-start gap-4">
                <span className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl bg-brand-orange text-brand-bone">
                  <Icon className="w-6 h-6" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">0{i + 1}</p>
                  <h3 className="mt-1 h-brutal text-2xl text-ink">{title}</h3>
                </div>
              </div>
              <p className="mt-4 text-ink/80 text-pretty">{body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/protocolo" className="btn-primary">Lee el protocolo completo</Link>
          <a href="/protocolo.pdf" className="btn-outline">Descargar PDF</a>
        </div>
      </div>
    </ThemedSection>
  );
}
