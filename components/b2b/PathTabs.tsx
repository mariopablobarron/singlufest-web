"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Building2,
  HandshakeIcon,
  Star,
  Check,
  Crown,
  Sparkles,
  Trophy,
  Users,
  Megaphone,
  Camera,
  Mic2,
} from "lucide-react";

type Path = "patrocinador" | "colaborador" | "embajador";

const TIERS: Record<
  Path,
  {
    label: string;
    pitch: string;
    perfect: string;
    icon: typeof Building2;
    accent: string;
    plans: {
      name: string;
      price: string;
      tagline: string;
      bg: string;
      featured?: boolean;
      perks: string[];
    }[];
    cta: { primary: string; href: string; secondary?: string };
  }
> = {
  patrocinador: {
    label: "Patrocinador",
    pitch: "Tu marca con presencia premium en todos los soportes del festival y eco mediático nacional.",
    perfect: "Marcas que invierten en branding, lanzan producto sin gluten o quieren posicionarse en lifestyle premium.",
    icon: Building2,
    accent: "brand-orange",
    plans: [
      {
        name: "Diamante",
        price: "8.000€",
        tagline: "Naming partner",
        bg: "bg-brand-carbon text-brand-bone",
        perks: [
          "Logo en cabecera, vídeos oficiales y todo el merch",
          "Stand premium 6×6m en zona destacada",
          "1 showcooking dedicado con un headliner",
          "Vídeo de marca producido por nuestro equipo (1 reel + 1 aftermovie)",
          "Mención en cada nota de prensa",
          "20 entradas VIP + 5 Mesa del Chef",
          "Acceso a la base de datos opt-in del festival",
        ],
      },
      {
        name: "Oro",
        price: "3.500€",
        tagline: "El sweet spot",
        bg: "bg-brand-orange text-brand-carbon",
        featured: true,
        perks: [
          "Logo en home, programa y aftermovie",
          "Stand 4×4m en zona principal",
          "Mención en showcookings y catas",
          "1 reel co-creado en Instagram",
          "10 entradas VIP",
          "Reporte de impacto post-festival",
        ],
      },
      {
        name: "Plata",
        price: "1.500€",
        tagline: "Visibilidad consistente",
        bg: "bg-brand-bone text-brand-carbon",
        perks: [
          "Logo en sponsors page y newsletter pre-festival",
          "Stand 3×3m en zona secundaria",
          "Mención en redes (3 publicaciones)",
          "5 entradas General",
        ],
      },
    ],
    cta: { primary: "Hablar con ventas", href: "#form", secondary: "Descargar dossier (PDF)" },
  },
  colaborador: {
    label: "Colaborador",
    pitch: "Aportas servicio o producto, recibes posicionamiento, descuentos cruzados y comunidad.",
    perfect: "Restaurantes, productores, agencias, medios y proveedores que quieren entrar en el ecosistema sin pagar dinero por adelantado.",
    icon: HandshakeIcon,
    accent: "brand-orange",
    plans: [
      {
        name: "Premium Collab",
        price: "Aportación equivalente 1.500€+",
        tagline: "Logo + activación cruzada",
        bg: "bg-brand-bone text-brand-carbon",
        perks: [
          "Logo en colaboradores y dossier oficial",
          "Activación cruzada: descuento mutuo entre comunidades",
          "1 reel conjunto en redes",
          "5 entradas General",
        ],
      },
      {
        name: "Standard Collab",
        price: "Aportación 500-1.500€",
        tagline: "Logo + mención + 2 entradas",
        bg: "bg-brand-orange text-brand-carbon",
        featured: true,
        perks: [
          "Logo en colaboradores y newsletter",
          "Mención en post-festival",
          "Producto degustación en zonas premium si aplica",
          "2 entradas General",
        ],
      },
      {
        name: "Media Partner",
        price: "Cobertura editorial",
        tagline: "Tú nos cuentas, nosotros te abrimos puertas",
        bg: "bg-brand-carbon text-brand-bone",
        perks: [
          "Logo en sponsors y dossier de prensa",
          "Acceso priority a chefs cabezas de cartel",
          "Material gráfico exclusivo bajo embargo",
          "2 entradas Pro",
        ],
      },
    ],
    cta: { primary: "Proponer colaboración", href: "#form", secondary: "Ver kit del colaborador" },
  },
  embajador: {
    label: "Embajador",
    pitch: "Eres una voz con audiencia celíaca o foodie. Te damos código personal, comisión y experiencia VIP.",
    perfect: "Creadores de contenido (Reels/TikTok 5k+ followers), médicos, nutricionistas, asociaciones y celebrities celíacas.",
    icon: Star,
    accent: "brand-lemon",
    plans: [
      {
        name: "Embajador Festival",
        price: "Pase VIP + 15% comisión",
        tagline: "Eres la cara visible 2026",
        bg: "bg-brand-carbon text-brand-bone",
        perks: [
          "Pase Mesa del Chef gratis (149€) + acompañante",
          "Código personal con 15% de comisión por venta",
          "Foto + bio en home y sponsors page",
          "1 reel co-producido por nuestro equipo audiovisual",
          "Acceso a backstage con chefs",
        ],
      },
      {
        name: "Embajador Creator",
        price: "Pase VIP + 10% comisión",
        tagline: "Para creadores 5k-50k seguidores",
        bg: "bg-brand-orange text-brand-carbon",
        featured: true,
        perks: [
          "Pase VIP gratis (49€) + acompañante con 50% dto.",
          "Código personal con 10% de comisión",
          "Foto en sponsors page",
          "Briefing creativo + acceso a media kit",
          "Reposting de tu contenido en redes oficiales",
        ],
      },
      {
        name: "Embajador Profesional",
        price: "Pase VIP + presencia",
        tagline: "Médicos, nutricionistas, asociaciones",
        bg: "bg-brand-bone text-brand-carbon",
        perks: [
          "Pase VIP gratis + 1 acompañante",
          "Espacio en zona médica/asociaciones",
          "Mención en charlas oficiales",
          "Inclusión en directorio profesional",
        ],
      },
    ],
    cta: { primary: "Aplicar como embajador", href: "#form", secondary: "Ver media kit" },
  },
};

const PATH_ICONS: Record<Path, typeof Building2> = {
  patrocinador: Building2,
  colaborador: HandshakeIcon,
  embajador: Star,
};

export function PathTabs() {
  const [active, setActive] = useState<Path>("patrocinador");
  const data = TIERS[active];

  return (
    <div className="container">
      {/* Tabs */}
      <div className="grid gap-3 md:grid-cols-3 mb-12">
        {(Object.keys(TIERS) as Path[]).map((p) => {
          const t = TIERS[p];
          const Icon = PATH_ICONS[p];
          const isActive = p === active;
          return (
            <button
              key={p}
              onClick={() => setActive(p)}
              className={cn(
                "rounded-2xl border p-6 text-left transition-all",
                isActive
                  ? "bg-brand-orange text-brand-carbon border-brand-orange shadow-[0_24px_60px_-20px_rgba(232,93,31,0.55)] -translate-y-1"
                  : "bg-bg/70 border-ink/10 text-ink hover:border-brand-orange/40 hover:-translate-y-0.5",
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6" />
                <p className="text-[10px] uppercase tracking-[0.22em]">Camino</p>
              </div>
              <p className="h-brutal text-2xl md:text-3xl">{t.label}</p>
              <p className={cn("mt-2 text-sm", isActive ? "text-brand-carbon/85" : "text-ink-muted")}>
                {t.pitch}
              </p>
            </button>
          );
        })}
      </div>

      {/* Perfecto para */}
      <div className="rounded-3xl bg-bg-alt p-6 md:p-8 mb-12 border border-ink/10">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-2">Perfecto para</p>
        <p className="text-lg text-ink">{data.perfect}</p>
      </div>

      {/* Plans */}
      <ul className="grid gap-5 md:grid-cols-3">
        {data.plans.map((plan) => {
          const Icon = plan.featured ? Sparkles : plan.name.includes("amante") || plan.name.includes("amante") ? Crown : Trophy;
          return (
            <article
              key={plan.name}
              className={cn(
                "relative rounded-3xl p-7 transition-all",
                plan.bg,
                plan.featured ? "shadow-[0_24px_60px_-20px_rgba(232,93,31,0.55)] -translate-y-2" : "shadow-soft",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-6 badge !bg-brand-bone !text-brand-orange !border-brand-bone">
                  Más popular
                </span>
              )}
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="h-brutal text-2xl md:text-3xl">{plan.name}</p>
                  <p className="text-xs uppercase tracking-[0.22em] mt-1 opacity-75">
                    {plan.tagline}
                  </p>
                </div>
                <Icon className="w-6 h-6 opacity-90" />
              </header>

              <p className="mt-6 h-brutal text-display-md leading-none">
                {plan.price}
              </p>

              <ul className="mt-6 space-y-2.5">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-1 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <a
                href={data.cta.href}
                className={cn(
                  "btn-lg w-full mt-8 justify-center btn",
                  plan.featured
                    ? "!bg-brand-carbon !text-brand-bone hover:!bg-brand-bone hover:!text-brand-carbon"
                    : plan.bg.includes("carbon")
                      ? "!bg-brand-orange !text-brand-carbon hover:!bg-brand-tangerine"
                      : "!bg-brand-carbon !text-brand-bone hover:!bg-brand-orange",
                )}
              >
                {data.cta.primary}
              </a>
            </article>
          );
        })}
      </ul>

      {/* Tools rápidos */}
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {[
          { icon: Users, label: "Audiencia esperada", value: "8.000+ asistentes únicos" },
          { icon: Megaphone, label: "Impresiones en redes", value: "2,4M proyectadas" },
          { icon: Camera, label: "Cobertura prensa", value: "20+ medios" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-3xl border border-ink/10 bg-bg p-6 flex items-center gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-orange text-brand-bone">
              <Icon className="w-6 h-6" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">{label}</p>
              <p className="h-brutal text-xl text-ink">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
