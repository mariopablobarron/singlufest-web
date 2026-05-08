import Link from "next/link";
import { Play, Calendar } from "lucide-react";
import { ThemedSection } from "./SectionTheme";

/**
 * Si recibes videoUrl real, muestra el aftermovie.
 * Mientras no exista, muestra la promesa de "primera edición" con countdown a noviembre.
 */
export function AftermovieV2({ videoUrl }: { videoUrl?: string }) {
  return (
    <ThemedSection alt className="py-24 md:py-32 overflow-hidden">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge mb-4">Primera edición · Noviembre 2026</p>
            <h2 className="text-display-md text-balance">
              {videoUrl ? (
                <>
                  Si no estuviste,
                  <span className="block h-script text-brand-orange mt-1">esto te dolerá.</span>
                </>
              ) : (
                <>
                  Estamos haciendo
                  <span className="block h-script text-brand-orange mt-1">la primera historia.</span>
                </>
              )}
            </h2>
          </div>
          {videoUrl && (
            <Link href="/aftermovie" className="btn-primary">
              Ver galería completa →
            </Link>
          )}
        </div>

        <div className="aspect-video rounded-3xl border-4 border-brand-orange bg-brand-carbon overflow-hidden vignette grain relative group shadow-[0_24px_60px_-20px_rgba(232,93,31,0.4)]">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              title="Aftermovie SingluFest"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-carbon via-brand-burn/40 to-brand-orange/30 px-8">
              <div className="text-center max-w-2xl">
                <span className="grid place-items-center w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-brand-orange/20 border border-brand-orange/60 backdrop-blur">
                  <Calendar className="w-9 h-9 md:w-10 md:h-10 text-brand-orange" />
                </span>
                <p className="mt-6 h-brutal text-3xl md:text-5xl text-brand-bone">
                  El primer aftermovie
                </p>
                <p className="mt-3 text-brand-bone/85 text-base md:text-lg">
                  Llegará tras la primera edición. <strong className="text-brand-orange">Granada. Sin fechas, sin trigo.</strong>
                </p>
                <Link
                  href="/entradas"
                  className="btn-accent mt-8 inline-flex"
                >
                  <Play className="w-4 h-4" /> Quiero estar ahí
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemedSection>
  );
}
