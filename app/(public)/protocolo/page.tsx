import Link from "next/link";
import { ProtocolV2 } from "@/components/v2/Protocol";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { FinalCtaV2 } from "@/components/v2/FinalCta";
import { ShieldCheck, FileSearch, GraduationCap, Workflow, BadgeCheck, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Protocolo de seguridad",
  description: "5 capas de seguridad para garantizar que SingluFest sea 100% sin trazas. Auditoría externa, formación FACE y trazabilidad QR.",
};

export default function ProtocoloPage() {
  return (
    <>
      <ThemedSection className="pt-24 md:pt-28 pb-6">
        <div className="container max-w-3xl text-center">
          <p className="badge mb-5">Seguridad alimentaria</p>
          <h1 className="h-brutal text-display-md md:text-display-lg text-ink text-balance">
            Protocolo SingluFest
          </h1>
          <p className="mt-5 text-base md:text-lg text-ink-muted text-pretty">
            5 capas de seguridad firmadas con cada candidato. Auditadas por terceros. Verificadas en directo durante el festival.
          </p>
        </div>
      </ThemedSection>

      <ProtocolV2 />

      <ThemedSection className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <p className="badge mb-6">¿Qué pasa si algo falla?</p>
          <h2 className="text-display-md text-balance">
            Plan de contingencia.
            <span className="block h-script text-brand-orange mt-2">honesto, escrito, público.</span>
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="card-elevated">
              <AlertTriangle className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">Si un análisis ELISA da positivo</h3>
              <p className="mt-3 text-ink/80 text-pretty">
                El stand del candidato cierra inmediatamente. Se notifica a todos los que hayan probado el plato vía
                push (con el QR del ticket). El candidato sale del concurso y pierde su plaza para 2027.
              </p>
            </div>

            <div className="card-elevated">
              <AlertTriangle className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">Si te encuentras mal en el festival</h3>
              <p className="mt-3 text-ink/80 text-pretty">
                Hay personal sanitario de FACE en cada zona del recinto. Atención inmediata sin coste. Si requieres
                hospital, transporte cubierto por nuestro seguro de evento.
              </p>
            </div>

            <div className="card-elevated">
              <AlertTriangle className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">Si el evento se cancela</h3>
              <p className="mt-3 text-ink/80 text-pretty">
                Reembolso íntegro automático en 5 días laborables. Sin papeleo, sin email, sin esperar.
                Lo gestiona Stripe.
              </p>
            </div>

            <div className="card-elevated">
              <AlertTriangle className="w-8 h-8 text-brand-orange" />
              <h3 className="mt-4 h-brutal text-xl text-ink">Si tienes una queja sobre un plato</h3>
              <p className="mt-3 text-ink/80 text-pretty">
                Escanea el QR del plato y envía la queja desde la app. Llega en directo al equipo de calidad.
                Respuesta en menos de 30 minutos durante el festival.
              </p>
            </div>
          </div>
        </div>
      </ThemedSection>

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-4xl text-center">
          <p className="badge mb-6">Auditorías y certificaciones</p>
          <h2 className="text-display-md text-balance">Nadie nos cree de palabra.</h2>
          <p className="mt-4 text-lg text-ink-muted text-pretty max-w-2xl mx-auto">
            Porque no hace falta. Aquí están los documentos firmados por las entidades que sí tienen autoridad para
            decirlo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/protocolo.pdf" className="btn-primary">Descargar protocolo (PDF)</a>
            <Link href="/b2b" className="btn-outline">Ver dossier de partners</Link>
          </div>
          <p className="mt-6 text-xs text-ink-muted">FACE · AOECS · Junta de Andalucía · Granada Gastronómica</p>
        </div>
      </ThemedSection>

      <FinalCtaV2 ticketsLeft={312} generalPrice={18} />
    </>
  );
}
