import Link from "next/link";
import { Play } from "lucide-react";
import { ThemedSection } from "./SectionTheme";

export function AftermovieV2({ videoUrl }: { videoUrl?: string }) {
  return (
    <ThemedSection theme="teatro" className="py-24 md:py-32 overflow-hidden">
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge !text-brand-orange !border-brand-orange/40 mb-4">Edición 2025</p>
            <h2 className="text-display-md text-balance">
              Si no estuviste,
              <span className="block h-script text-brand-orange mt-1">esto te dolerá.</span>
            </h2>
          </div>
          <Link href="/aftermovie" className="btn-outline !text-brand-bone !border-brand-bone/30">
            Ver galería completa →
          </Link>
        </div>

        <div className="aspect-video rounded-3xl border border-line bg-brand-ember overflow-hidden vignette grain relative group">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              title="Aftermovie SingluFest 2025"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="h-brutal text-3xl md:text-5xl text-brand-bone flex items-center gap-4 hover:text-brand-orange transition-colors"
                aria-label="Reproducir aftermovie"
                disabled
              >
                <span className="grid place-items-center w-20 h-20 rounded-full bg-brand-orange/20 border border-brand-orange/60 backdrop-blur">
                  <Play className="w-8 h-8 fill-brand-orange text-brand-orange" />
                </span>
                Aftermovie 2025
              </button>
              <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.22em] text-ink-muted">
                Pega la URL del aftermovie en /admin/settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </ThemedSection>
  );
}
