import Link from "next/link";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { PathTabs } from "@/components/b2b/PathTabs";
import { RoiCalculator } from "@/components/b2b/RoiCalculator";
import { B2BForm } from "@/components/b2b/B2BForm";
import { TrendingUp, Users, Newspaper, Heart, Camera, Zap, ChartNoAxesCombined, Globe2 } from "lucide-react";

export const metadata = {
  title: "Dossier de partners",
  description: "Patrocinadores, colaboradores y embajadores: cómo unirte al SingluFest 2026 y qué te llevas a cambio.",
};

const STATS_2025 = [
  { icon: Users, label: "asistentes únicos", value: "5.200" },
  { icon: TrendingUp, label: "tickets vendidos", value: "8.700" },
  { icon: Camera, label: "menciones en redes", value: "2,1M" },
  { icon: Newspaper, label: "menciones en prensa", value: "23" },
  { icon: Heart, label: "votos del público", value: "12.408" },
  { icon: Zap, label: "AOV add-ons", value: "+24€" },
  { icon: ChartNoAxesCombined, label: "índice satisfacción", value: "9,2/10" },
  { icon: Globe2, label: "comunidades activadas", value: "7" },
];

const TESTIMONIALS = [
  {
    quote: "Pasamos de ser una marca de nicho a tener cola en la puerta del local durante un mes. El SingluFest nos puso en el mapa.",
    author: "Kim, KIMCAKES",
    role: "Headliner 2025",
  },
  {
    quote: "Como restaurante, ganamos 80 reservas la semana posterior. Y tenemos una lista de espera para 2026 que nunca habíamos imaginado.",
    author: "Carmela",
    role: "Headliner 2025",
  },
  {
    quote: "Activamos campaña de marca con un creator del festival. Engagement +320% vs nuestra media. Repetimos seguro.",
    author: "Marca colaboradora premium",
    role: "Patrocinador Oro 2025",
  },
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
        <div className="container max-w-6xl">
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
                <p className="badge !text-brand-orange !border-brand-orange/40 mb-6">Edición 2025 · highlights</p>
                <ul className="space-y-3 text-brand-bone/90">
                  <li className="flex justify-between"><span>Asistentes únicos</span> <strong className="text-brand-orange">5.200</strong></li>
                  <li className="flex justify-between"><span>Sold out en</span> <strong className="text-brand-orange">3 semanas</strong></li>
                  <li className="flex justify-between"><span>Reach en redes</span> <strong className="text-brand-orange">2,1M</strong></li>
                  <li className="flex justify-between"><span>Asistencia VIP</span> <strong className="text-brand-orange">98%</strong></li>
                  <li className="flex justify-between"><span>Net Promoter Score</span> <strong className="text-brand-orange">+72</strong></li>
                </ul>
                <hr className="my-6 border-brand-bone/15" />
                <p className="text-sm text-brand-bone/75">
                  Reporte completo auditado disponible bajo solicitud para potenciales partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ThemedSection>

      {/* STATS GRID */}
      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-6xl">
          <p className="badge mb-6">Por qué SingluFest</p>
          <h2 className="text-display-md text-balance">
            Comunidad pequeña pero con bolsillo grande.
          </h2>
          <p className="mt-4 text-ink-muted max-w-2xl text-pretty">
            El celíaco español invierte de media <strong className="text-ink">+1.200€/año</strong> en alimentación
            específica. Es un público que compra premium porque la salud lo exige y la pasión foodie lo amplifica.
          </p>

          <ul className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS_2025.map(({ icon: Icon, label, value }) => (
              <li key={label} className="rounded-2xl border border-ink/10 bg-bg p-5">
                <Icon className="w-6 h-6 text-brand-orange" />
                <p className="mt-3 h-brutal text-3xl text-ink">{value}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-ink-muted mt-1">{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </ThemedSection>

      {/* 3 CAMINOS — interactivo */}
      <ThemedSection className="py-24 md:py-32" id="caminos">
        <div className="container max-w-6xl mb-12">
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

      {/* TESTIMONIALS */}
      <ThemedSection className="py-20 md:py-24">
        <div className="container max-w-6xl">
          <p className="badge mb-6">Lo que dicen los que ya entraron</p>
          <h2 className="text-display-md text-balance">
            Voces de partners 2025.
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <li key={t.author} className="card-elevated">
                <span className="h-brutal text-5xl text-brand-orange leading-none">"</span>
                <p className="mt-2 text-ink/90 text-pretty">{t.quote}</p>
                <hr className="my-5 hairline" />
                <p className="font-display text-lg text-ink">{t.author}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{t.role}</p>
              </li>
            ))}
          </ul>
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
