import Link from "next/link";
import { Check, Ticket as TicketIcon, Crown, Sparkles } from "lucide-react";
import { ThemedSection } from "./SectionTheme";

type Tier = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stockLeft: number;
  badge?: string;
  highlight?: boolean;
  bg: string;
  perks: string[];
  cta: string;
};

const TIERS: Tier[] = [
  {
    id: "general",
    name: "GENERAL",
    price: 18,
    stockLeft: 312,
    bg: "bg-bg",
    perks: [
      "Acceso al festival los 3 días",
      "Acceso al mercado de candidatos",
      "5 tickets de degustación",
      "Voto al Premio del Público",
    ],
    cta: "Comprar General",
  },
  {
    id: "vip",
    name: "VIP",
    price: 49,
    oldPrice: 65,
    stockLeft: 84,
    badge: "Más popular",
    highlight: true,
    bg: "bg-brand-orange text-brand-bone",
    perks: [
      "Todo lo del General",
      "12 tickets de degustación (un voto por candidato)",
      "Cata privada con un headliner",
      "Mesa reservada con vista",
      "Pack merch (camiseta + tote)",
      "Acceso 1h antes del público",
    ],
    cta: "Comprar VIP",
  },
  {
    id: "mesa-chef",
    name: "MESA DEL CHEF",
    price: 149,
    stockLeft: 12,
    badge: "Solo 30 plazas",
    bg: "bg-brand-carbon text-brand-bone",
    perks: [
      "Todo lo del VIP",
      "Cena de 6 platos con un chef invitado",
      "Botella firmada y numerada",
      "Meet & greet con los headliners",
      "Voto premium (cuenta x3)",
    ],
    cta: "Reservar mesa",
  },
];

export function TicketsV2() {
  return (
    <ThemedSection className="py-28 md:py-36" id="entradas">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="badge mb-4">Entradas · Last release</p>
            <h2 className="text-display-lg text-balance">
              Quien tarda,
              <span className="block h-script text-brand-orange mt-2">paga doble.</span>
            </h2>
          </div>
          <p className="text-sm text-ink-muted max-w-xs text-pretty">
            El precio sube el viernes a las 23:59. Sin trampa, sin cartón.
            Cuando se acaben, se acaban.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((t) => {
            const onLight = !t.highlight && !t.bg.includes("carbon");
            return (
              <article
                key={t.id}
                className={[
                  "relative rounded-3xl border p-7 transition-all",
                  t.highlight
                    ? `${t.bg} border-brand-orange shadow-[0_24px_60px_-20px_rgba(232,93,31,0.55)] md:-translate-y-3 scale-[1.02]`
                    : t.bg.includes("carbon")
                      ? `${t.bg} border-brand-carbon shadow-[0_24px_60px_-20px_rgba(11,8,7,0.4)]`
                      : `${t.bg} border-ink/10 hover:border-brand-orange/40 hover:shadow-soft`,
                ].join(" ")}
              >
                {t.badge && (
                  <span className={`absolute -top-3 left-6 ${t.highlight ? "badge !text-brand-orange !bg-brand-bone !border-brand-bone" : "badge !text-brand-carbon !bg-brand-lemon !border-brand-lemon"}`}>
                    {t.badge}
                  </span>
                )}

                <header className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`h-brutal text-2xl md:text-3xl ${onLight ? "text-ink" : "text-brand-bone"}`}>{t.name}</p>
                    <p className={`mt-1 text-xs uppercase tracking-[0.22em] ${onLight ? "text-ink-muted" : "text-brand-bone/70"}`}>
                      Quedan <strong className={t.highlight ? "text-brand-bone" : t.bg.includes("carbon") ? "text-brand-orange" : "text-brand-orange"}>{t.stockLeft}</strong>
                    </p>
                  </div>
                  {t.id === "vip" ? (
                    <Sparkles className={`w-6 h-6 ${onLight ? "text-brand-orange" : "text-brand-bone"}`} />
                  ) : t.id === "mesa-chef" ? (
                    <Crown className="w-6 h-6 text-brand-orange" />
                  ) : (
                    <TicketIcon className="w-6 h-6 text-brand-orange" />
                  )}
                </header>

                <p className="mt-6 flex items-baseline gap-3">
                  <span className={`h-brutal text-display-md ${onLight ? "text-brand-orange glow-orange" : "text-brand-bone"}`}>
                    {t.price}€
                  </span>
                  {t.oldPrice && (
                    <span className={`text-base line-through ${onLight ? "text-ink-muted" : "text-brand-bone/60"}`}>{t.oldPrice}€</span>
                  )}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {t.perks.map((p) => (
                    <li key={p} className={`flex items-start gap-2 text-sm ${onLight ? "text-ink/85" : "text-brand-bone/90"}`}>
                      <Check className={`w-4 h-4 mt-1 shrink-0 ${onLight ? "text-brand-orange" : "text-brand-lemon"}`} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/entradas?tier=${t.id}`}
                  className={t.highlight
                    ? "btn-lg w-full mt-8 justify-center !bg-brand-bone !text-brand-orange hover:!bg-brand-carbon hover:!text-brand-bone btn"
                    : t.bg.includes("carbon")
                      ? "btn-accent btn-lg w-full mt-8 justify-center"
                      : "btn-primary btn-lg w-full mt-8 justify-center"}
                >
                  {t.cta}
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-ink/10 bg-bg-alt p-6 md:p-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="badge mb-2">Pase Pro · B2B</p>
            <p className="h-brutal text-2xl text-ink">
              ¿Eres restaurador o prensa? <span className="text-brand-orange">Pase Pro 89€</span>
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Acceso priority + dossier de candidatos + reuniones agendadas.
            </p>
          </div>
          <Link href="/entradas?tier=pro" className="btn-outline">Solicitar Pase Pro</Link>
        </div>
      </div>
    </ThemedSection>
  );
}
