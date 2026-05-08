import { CartelV2 } from "@/components/v2/Cartel";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { FinalCtaV2 } from "@/components/v2/FinalCta";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cartel 2026",
  description: "Los 10 stands del SingluFest. Cabezas de cartel: KIMCAKES, Carmela y un tercer headliner por anunciar.",
};

export default function CartelPage() {
  return (
    <>
      <ThemedSection className="pt-24 md:pt-28 pb-6">
        <div className="container max-w-3xl text-center">
          <p className="badge mb-5">Edición piloto · sin fechas, sin trigo</p>
          <h1 className="h-brutal text-display-md md:text-display-lg text-ink text-balance">
            El cartel
          </h1>
          <p className="mt-5 text-base md:text-lg text-ink-muted text-pretty">
            10 iconos gastronómicos. Cada uno con su mejor plato sin gluten. Tú pruebas, tú votas, tú decides quién se lleva el trofeo.
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
            Solo entran 10 stands al concurso por edición. Si crees que tu plato puede pelear el SingluTrofeo,
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
