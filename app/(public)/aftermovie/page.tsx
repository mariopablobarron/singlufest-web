import Link from "next/link";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { AftermovieV2 } from "@/components/v2/Aftermovie";
import { Play } from "lucide-react";

export const metadata = {
  title: "Aftermovie & Galería",
  description: "Vídeos, fotos y prensa de la edición SingluFest 2025.",
};

const PHOTOS = Array.from({ length: 9 }).map((_, i) => ({
  id: `p${i + 1}`,
  bg: [
    "from-brand-orange to-brand-burn",
    "from-brand-wine to-brand-burn",
    "from-brand-lemon to-brand-orange",
    "from-brand-tangerine to-brand-burn",
    "from-brand-carbon via-brand-ember to-brand-orange",
    "from-brand-orange via-brand-burn to-brand-wine",
    "from-brand-wine via-brand-burn to-brand-lemon",
    "from-brand-tangerine to-brand-orange",
    "from-brand-burn to-brand-carbon",
  ][i],
  caption: [
    "Showcooking del cabeza de cartel",
    "Cola de la apertura",
    "Mesa del Chef sábado",
    "Brewmaster en la cata",
    "Aplausos al ganador",
    "Mercado en horario peak",
    "Foto de prensa",
    "Detalle del plato ganador",
    "Cierre del domingo",
  ][i],
}));

export default function AftermoviePage() {
  return (
    <>
      <ThemedSection className="pt-28 md:pt-36 pb-12">
        <div className="container max-w-5xl text-center">
          <p className="badge mb-6">Edición 2025 · Aftermovie</p>
          <h1 className="text-display-xl text-balance">
            <span className="block h-brutal text-ink">Si no estuviste,</span>
            <span className="block h-script text-brand-orange mt-3">esto te dolerá.</span>
          </h1>
        </div>
      </ThemedSection>

      <AftermovieV2 />

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="badge mb-4">Galería</p>
              <h2 className="h-brutal text-3xl md:text-5xl text-ink">
                9 momentos de <span className="text-brand-orange">2025</span>
              </h2>
            </div>
            <p className="text-sm text-ink-muted max-w-xs">
              Cuando subáis las fotos reales a /admin, se rellenan automáticamente.
            </p>
          </div>

          <ul className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {PHOTOS.map((p) => (
              <li
                key={p.id}
                className={`aspect-[4/5] rounded-2xl bg-gradient-to-br ${p.bg} grain relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1`}
              >
                <div className="absolute inset-0 flex items-end p-5">
                  <p className="text-brand-bone text-sm font-display opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.caption}
                  </p>
                </div>
                <span className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-brand-bone/10 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 fill-brand-bone text-brand-bone ml-0.5" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ThemedSection>

      <ThemedSection className="py-20 md:py-24">
        <div className="container max-w-4xl text-center">
          <p className="badge mb-6">Prensa & menciones</p>
          <h2 className="text-display-md text-balance">
            Nos visitaron, escribieron y filmaron.
          </h2>
          <ul className="mt-12 grid gap-3 grid-cols-2 md:grid-cols-4">
            {["El País", "Ideal", "Granada Hoy", "GastroActitud", "FACE", "Onda Cero", "RTVE", "ABC Gastro"].map((p) => (
              <li
                key={p}
                className="rounded-2xl border border-ink/10 bg-bg-alt/40 px-5 py-4 text-center font-display tracking-tight text-ink/80 hover:text-brand-orange transition-colors"
              >
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/b2b" className="btn-accent btn-lg">Dossier de partners</Link>
            <a
              href="mailto:prensa@singlufest.es?subject=Solicitud%20de%20dossier%20de%20prensa"
              className="btn-outline"
            >
              Solicitar dossier de prensa
            </a>
          </div>
        </div>
      </ThemedSection>
    </>
  );
}
