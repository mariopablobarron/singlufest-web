import Link from "next/link";
import { Play } from "lucide-react";
import { ThemedSection } from "./SectionTheme";

export function AftermovieV2({ videoUrl }: { videoUrl?: string }) {
  return (
    <ThemedSection alt className="py-24 md:py-32 overflow-hidden">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge mb-4">Edición 2025</p>
            <h2 className="text-display-md text-balance">
              Si no estuviste,
              <span className="block h-script text-brand-orange mt-1">esto te dolerá.</span>
            </h2>
          </div>
          <Link href="/aftermovie" className="btn-primary">
            Ver galería completa →
          </Link>
        </div>

        <div className="aspect-video rounded-3xl border-4 border-brand-orange bg-brand-carbon overflow-hidden vignette grain relative group shadow-[0_24px_60px_-20px_rgba(232,93,31,0.4)]">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              title="Aftermovie SingluFest 2025"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-carbon via-brand-burn/40 to-brand-orange/30">
              <div className="text-center">
                <span className="grid place-items-center w-24 h-24 mx-auto rounded-full bg-brand-orange shadow-[0_0_60px_rgba(232,93,31,0.6)] hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-10 h-10 fill-brand-bone text-brand-bone ml-1" />
                </span>
                <p className="mt-6 h-brutal text-3xl md:text-5xl text-brand-bone">Aftermovie 2025</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-brand-bone/60">
                  Pega la URL en /admin/settings
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemedSection>
  );
}
