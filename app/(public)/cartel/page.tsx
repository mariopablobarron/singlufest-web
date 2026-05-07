import { CartelV2 } from "@/components/v2/Cartel";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { FinalCtaV2 } from "@/components/v2/FinalCta";
import Link from "next/link";

export const metadata = {
  title: "Cartel 2026",
  description: "Los 12 candidatos del SingluFest. Cabezas de cartel: KIMCAKES, Carmela y un tercer headliner por anunciar.",
};

export default function CartelPage() {
  return (
    <>
      <ThemedSection className="pt-24 md:pt-32 pb-12">
        <div className="container max-w-5xl text-center">
          <p className="badge mb-6">Cartel 2026</p>
          <h1 className="text-display-xl text-balance">
            <span className="block h-brutal text-ink">12 candidatos.</span>
            <span className="block h-script text-brand-orange mt-3">1 ganador.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-ink-muted text-pretty max-w-2xl mx-auto">
            Cada chef trae <strong className="text-ink">un solo plato</strong> al festival.
            Tú lo pruebas, tú lo votas. El ganador se lleva el SingluTrofeo y 5.000€.
          </p>
        </div>
      </ThemedSection>

      <CartelV2 />

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-4xl">
          <p className="badge mb-6">¿Eres chef o tienes un proyecto sin gluten?</p>
          <h2 className="text-display-md text-balance">
            Las plazas para 2027 ya se están abriendo.
          </h2>
          <p className="mt-6 text-lg text-ink-muted text-pretty">
            Solo entran 12 candidatos al concurso por edición. Si crees que tu plato puede pelear el SingluTrofeo,
            escríbenos antes del 1 de mayo de 2027 con tu propuesta. Recibirás respuesta en 7 días.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/b2b" className="btn-accent btn-lg">Quiero presentar mi candidatura</Link>
            <Link href="/manifiesto" className="btn-outline">Lee el manifiesto</Link>
          </div>
        </div>
      </ThemedSection>

      <FinalCtaV2 ticketsLeft={312} generalPrice={18} />
    </>
  );
}
