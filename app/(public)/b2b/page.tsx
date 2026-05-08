import Link from "next/link";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { PathTabs } from "@/components/b2b/PathTabs";
import { RoiCalculator } from "@/components/b2b/RoiCalculator";
import { B2BForm } from "@/components/b2b/B2BForm";
import { TrendingUp, Users, Newspaper, Heart, Camera, Zap, Target, Globe2 } from "lucide-react";

export const metadata = {
  title: "Dossier de partners",
  description: "Patrocinadores, colaboradores y embajadores: cómo unirte al SingluFest 2026 y qué te llevas a cambio.",
};

// Objetivos para la primera edición. Cuando pase, sustituimos por datos reales auditados.
const TARGETS_2026 = [
  { icon: Users, label: "asistentes objetivo", value: "3.000+" },
  { icon: TrendingUp, label: "tickets en venta", value: "5.000" },
  { icon: Camera, label: "alcance redes objetivo", value: "1M+" },
  { icon: Newspaper, label: "menciones prensa target", value: "15+" },
  { icon: Heart, label: "comunidad celíaca activa", value: "+50k" },
  { icon: Zap, label: "AOV con add-ons", value: "+24€" },
  { icon: Target, label: "stands en concurso", value: "10" },
  { icon: Globe2, label: "ciudades convocatoria", value: "8" },
];

const FAQS = [
  {
    q: "¿En qué se diferencia un patrocinador de un colaborador?",
    a: "El patrocinador aporta dinero y recibe presencia y métricas. El colaborador aporta servicio o producto y recibe posicionamiento, audiencia y descuentos cruzados. El embajador es una persona individual con audiencia que actúa como cara visible.",
  },
  {
    q: "¿Cuándo se cierra el cupo de patrocinadores?",
    a: "Cuando se cumple el aforo del recinto y la presencia visual del festival. Históricamente cerramos a 6 meses del evento. Este año (2026) prevemos cierre el 1 de septiembre.",
  },
  {
    q: "¿Hay packs a medida fuera de los tiers estándar?",
    a: "Sí, sobre todo para Diamond y para activaciones que aporten contenido propio (un proyecto de marca, un nuevo producto sin gluten…). Nos cuentas y montamos algo único.",
  },
  {
    q: "¿Cómo se mide el retorno?",
    a: "Reporte detallado post-festival con: leads generados, alcance en redes, CTR de tu logo en home, prensa generada, fotos profesionales y vídeos donde aparece tu marca, KPIs del stand. Lo entregamos en máximo 21 días tras el cierre.",
  },
  {
    q: "¿Sirve si soy un creator pequeño (<5k seguidores)?",
    a: "Para el tier Embajador estándar pedimos mínimo 5k. Por debajo, valoramos calidad de comunidad celíaca/foodie. Escríbenos sin problema y miramos caso a caso.",
  },
  {
    q: "¿Os interesan medios pequeños o blogs especializados?",
    a: "Sí. Hay un tier 'Media Partner' específico, sin coste, basado en intercambio de contenido. Acceso priority a chefs, dossier exclusivo y entradas Pro.",
  },
];

export default function B2BPage() {
  return (
    <>
      {/* HERO */}
      <ThemedSection className="pt-24 md:pt-32 pb-12 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-festival" />
        <div className="container">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div>
              <p className="badge mb-6">Dossier · Partners 2026</p>
              <h1 className="text-display-xl text-balance">
                <span className="block h-brutal text-ink">No es feria.</span>
                <span className="block h-script text-brand-orange mt-3">es un escenario.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-ink/85 text-pretty max-w-xl">
                SingluFest pone en contacto a tu marca con la <strong className="text-ink">comunidad celíaca foodie
                premium</strong> de España: gente que sí compra, recomienda y graba lo que come. Aquí están los caminos
                para entrar.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#caminos" className="btn-accent btn-lg">Ver los 3 caminos</a>
                <a href="#form" className="btn-outline btn-lg">Saltar al formulario</a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-brand-carbon text-brand-bone p-8 md:p-10 grain relative overflow-hidden shadow-[0_30px_60px_-20px_rgba(11,8,7,0.4)]">
                <p className="badge !text-brand-orange !border-brand-orange/40 mb-6">Edición piloto 2026 · objetivos</p>
                <ul className="space-y-3 text-brand-bone/90">
                  <li className="flex justify-between"><span>Fechas</span> <strong className="text-brand-orange">por anunciar</strong></li>
                  <li className="flex justify-between"><span>Stands en concurso</span> <strong className="text-brand-orange">10</strong></li>
                  <li className="flex justify-between"><span>Aforo objetivo</span> <strong className="text-brand-orange">3.000+</strong></li>
                  <li className="flex justify-between"><span>Cabezas de cartel ya cerrados</span> <strong className="text-brand-orange">2</strong></li>
                  <li className="flex justify-between"><span>Ubicación</span> <strong className="text-brand-orange">Granada</strong></li>
                </ul>
                <hr className="my-6 border-brand-bone/15" />
                <p className="text-sm text-brand-bone/75">
                  Es la primera edición. Si entras como partner, eres uno de los pioneros que define el ADN del festival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ThemedSection>

      {/* TARGETS GRID */}
      <ThemedSection alt className="py-20 md:py-24">
        <div className="container">
          <p className="badge mb-6">Por qué SingluFest</p>
          <h2 className="text-display-md text-balance">
            Comunidad pequeña pero con bolsillo grande.
          </h2>
          <p className="mt-4 text-ink-muted max-w-2xl text-pretty">
            El celíaco español invierte de media <strong className="text-ink">+1.200€/año</strong> en alimentación
            específica. Es un público que compra premium porque la salud lo exige y la pasión foodie lo amplifica.
          </p>

          <ul className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {TARGETS_2026.map(({ icon: Icon, label, value }) => (
              <li key={label} className="rounded-2xl border border-ink/10 bg-bg p-5">
                <Icon className="w-6 h-6 text-brand-orange" />
                <p className="mt-3 h-brutal text-3xl text-ink">{value}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-ink-muted mt-1">{label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ink-muted italic">
            Objetivos de la primera edición. Tras el evento, sustituimos por datos reales auditados.
          </p>
        </div>
      </ThemedSection>

      {/* 3 CAMINOS — interactivo */}
      <ThemedSection className="py-24 md:py-32" id="caminos">
        <div className="container mb-12">
          <p className="badge mb-6">Tres caminos</p>
          <h2 className="text-display-lg text-balance">
            Escoge cómo quieres
            <span className="block h-script text-brand-orange mt-2">entrar al festival.</span>
          </h2>
          <p className="mt-6 text-lg text-ink-muted max-w-3xl text-pretty">
            Patrocinador, colaborador o embajador. No tienen el mismo modelo, pero sí el mismo objetivo: ponerte
            delante de una comunidad cualificada y agradecida. Pulsa cada pestaña para ver tiers, beneficios y precios.
          </p>
        </div>
        <PathTabs />
      </ThemedSection>

      {/* ROI CALCULATOR */}
      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <RoiCalculator />
        </div>
      </ThemedSection>

      {/* PORQUE PIONERO */}
      <ThemedSection className="py-20 md:py-24">
        <div className="container max-w-4xl">
          <p className="badge mb-6">Eres pionero</p>
          <h2 className="text-display-md text-balance">
            Esto es la primera edición.
            <span className="block h-script text-brand-orange mt-2">y los que entren ahora se quedan en la historia.</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="card-elevated">
              <p className="h-brutal text-3xl text-brand-orange">+50k</p>
              <p className="mt-2 text-sm text-ink-muted">celíacos activos en redes en España. Comunidad hambrienta de comida buena de verdad.</p>
            </div>
            <div className="card-elevated">
              <p className="h-brutal text-3xl text-brand-orange">0</p>
              <p className="mt-2 text-sm text-ink-muted">ferias premium 100% sin gluten en España. Llegáis al hueco con tu marca antes que nadie.</p>
            </div>
            <div className="card-elevated">
              <p className="h-brutal text-3xl text-brand-orange">3 días</p>
              <p className="mt-2 text-sm text-ink-muted">de evento + 60 días de comunicación pre y post. Más exposición de la que parece.</p>
            </div>
          </div>
        </div>
      </ThemedSection>

      {/* FAQ B2B */}
      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-3xl">
          <p className="badge mb-6">Preguntas habituales</p>
          <h2 className="text-display-md text-balance">FAQ B2B</h2>
          <ul className="mt-10 divide-y divide-ink/10">
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

      {/* FORM */}
      <ThemedSection className="py-24 md:py-32" id="form">
        <div className="container max-w-3xl">
          <p className="badge mb-6">Vamos a hablar</p>
          <h2 className="text-display-md text-balance">
            Cuéntanos qué te encaja.
            <span className="block h-script text-brand-orange mt-2">respondemos en 48h.</span>
          </h2>
          <p className="mt-4 text-ink-muted text-pretty">
            Nada automático. Lee Mario el correo, te llama si hace falta y te manda propuesta concreta a medida.
          </p>
          <div className="mt-10">
            <B2BForm />
          </div>
        </div>
      </ThemedSection>

      {/* CTA FINAL */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-brand-orange text-brand-bone">
        <div aria-hidden className="absolute inset-0 grain opacity-30" />
        <div className="container max-w-4xl text-center relative">
          <p className="badge !text-brand-bone !border-brand-bone/40 mb-6 backdrop-blur">Ediciones próximas</p>
          <h2 className="text-display-lg text-balance h-brutal">
            2026 está abierta. <span className="block h-script text-brand-carbon mt-2">2027 también.</span>
          </h2>
          <p className="mt-8 max-w-2xl mx-auto text-lg text-brand-bone/95">
            Si quieres entrar 2027 con presencia premium, ahora es buen momento. La edición pasada cerramos cupo
            Diamond a 8 meses del festival.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#form" className="btn-lg btn !bg-brand-carbon !text-brand-bone hover:!bg-brand-bone hover:!text-brand-carbon">
              Reservar conversación
            </a>
            <Link href="/cartel" className="btn-lg btn !bg-transparent !text-brand-bone !border !border-brand-bone/40 hover:!bg-brand-bone hover:!text-brand-orange">
              Ver el cartel 2026
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
