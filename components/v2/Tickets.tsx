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
  perks: string[];
  cta: string;
};

const TIERS: Tier[] = [
  {
    id: "general",
    name: "GENERAL",
    price: 18,
    stockLeft: 312,
    perks: [
      "Acceso al festival los 3 días",
      "Acceso al mercado +70 expositores",
      "1 showcooking incluido",
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
    perks: [
      "Todo lo del General",
      "Cata privada de cervezas o repostería",
      "Mesa reservada con vista",
      "Pack merch (camiseta + tote)",
      "Acceso 1h antes que el público",
    ],
    cta: "Comprar VIP",
  },
  {
    id: "mesa-chef",
    name: "MESA DEL CHEF",
    price: 149,
    stockLeft: 12,
    badge: "Solo 30 plazas",
    perks: [
      "Todo lo del VIP",
      "Cena de 6 platos con chef invitado",
      "Botella firmada y numerada",
      "Meet & greet con headliners",
    ],
    cta: "Reservar mesa",
  },
];

export function TicketsV2() {
  return (
    <ThemedSection theme="teatro" className="py-28 md:py-36 border-t border-line">
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="badge !text-brand-orange !border-brand-orange/40 mb-4">Entradas · Last release</p>
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
          {TIERS.map((t) => (
            <article
              key={t.id}
              className={[
                "relative rounded-3xl border p-7 transition-all",
                t.highlight
                  ? "border-brand-orange bg-brand-wine/40 shadow-glow scale-[1.02] md:-translate-y-2"
                  : "border-line bg-brand-ember/50 hover:border-brand-orange/40",
              ].join(" ")}
            >
              {t.badge && (
                <span className={`absolute -top-3 left-6 ${t.highlight ? "badge-hot" : "badge !text-brand-lemon !border-brand-lemon/40"} bg-brand-carbon`}>
                  {t.badge}
                </span>
              )}

              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="h-brutal text-2xl md:text-3xl text-ink">{t.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-muted">
                    Quedan <strong className="text-brand-orange">{t.stockLeft}</strong>
                  </p>
                </div>
                {t.id === "vip" ? (
                  <Sparkles className="w-6 h-6 text-brand-orange" />
                ) : t.id === "mesa-chef" ? (
                  <Crown className="w-6 h-6 text-brand-orange" />
                ) : (
                  <TicketIcon className="w-6 h-6 text-brand-orange" />
                )}
              </header>

              <p className="mt-6 flex items-baseline gap-3">
                <span className="h-brutal text-display-md text-brand-orange glow-orange">
                  {t.price}€
                </span>
                {t.oldPrice && (
                  <span className="text-base text-ink-muted line-through">{t.oldPrice}€</span>
                )}
              </p>

              <ul className="mt-6 space-y-2.5">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-ink/85">
                    <Check className="w-4 h-4 mt-1 shrink-0 text-brand-orange" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/entradas?tier=${t.id}`}
                className={t.highlight ? "btn-accent btn-lg w-full mt-8 justify-center" : "btn-primary btn-lg w-full mt-8 justify-center !text-brand-bone !bg-brand-ember hover:!bg-brand-burn"}
              >
                {t.cta}
              </Link>
            </article>
          ))}
        </div>

        {/* Pase Pro como banda fina */}
        <div className="mt-10 rounded-3xl border border-line bg-brand-ember/30 p-6 md:p-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="badge mb-2">Pase Pro · B2B</p>
            <p className="h-brutal text-2xl text-ink">
              ¿Eres restaurador o prensa? <span className="text-brand-orange">Pase Pro 89€</span>
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Acceso priority + dossier de partners + reuniones agendadas.
            </p>
          </div>
          <Link href="/entradas?tier=pro" className="btn-outline !text-brand-bone !border-brand-bone/30">
            Solicitar Pase Pro
          </Link>
        </div>
      </div>
    </ThemedSection>
  );
}
