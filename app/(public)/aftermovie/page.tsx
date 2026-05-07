import Link from "next/link";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { Calendar, Sparkles, Megaphone } from "lucide-react";

export const metadata = {
  title: "Aftermovie · próximamente",
  description: "El primer aftermovie del SingluFest llegará tras la edición de noviembre 2026 en Granada.",
};

export default function AftermoviePage() {
  return (
    <>
      <ThemedSection className="pt-24 md:pt-28 pb-16">
        <div className="container max-w-3xl text-center">
          <p className="badge mb-5">Primera edición · 14-16 noviembre 2026</p>
          <h1 className="h-brutal text-display-md md:text-display-lg text-ink text-balance">
            El primer aftermovie llega
            <span className="block h-script text-brand-orange mt-2">después del festival.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-ink-muted text-pretty">
            SingluFest 2026 es la edición piloto del concurso gastronómico 100% sin gluten.
            Cuando termine, aquí encontrarás el aftermovie, las fotos y la cobertura de prensa.
          </p>
        </div>
      </ThemedSection>

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-elevated">
              <Calendar className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">14-16 nov 2026</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Tres días en Granada con 12 chefs cocinando en directo.
              </p>
            </div>
            <div className="card-elevated">
              <Sparkles className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">Estaremos grabando</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Equipo audiovisual los 3 días: aftermovie, reels y galería.
              </p>
            </div>
            <div className="card-elevated">
              <Megaphone className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">Suscríbete</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Cuando publiquemos el aftermovie te avisamos por email.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/entradas" className="btn-accent btn-lg">
              Reservar mi entrada
            </Link>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-ink-muted">
              Aún quedan plazas para la primera edición
            </p>
          </div>
        </div>
      </ThemedSection>
    </>
  );
}
