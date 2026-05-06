import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Sponsor, SponsorTier } from "@prisma/client";

const TIER_LABEL: Record<SponsorTier, string> = {
  DIAMOND: "Diamante",
  GOLD: "Oro",
  SILVER: "Plata",
  BRONZE: "Bronce",
  COLLAB: "Colaboran",
};

const TIER_ORDER: SponsorTier[] = ["DIAMOND", "GOLD", "SILVER", "BRONZE", "COLLAB"];

const TIER_SIZE: Record<SponsorTier, string> = {
  DIAMOND: "h-24 md:h-28",
  GOLD: "h-20 md:h-24",
  SILVER: "h-16 md:h-20",
  BRONZE: "h-14 md:h-16",
  COLLAB: "h-12 md:h-14",
};

export function SponsorGrid({ sponsors }: { sponsors: Sponsor[] }) {
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    list: sponsors.filter((s) => s.tier === tier && s.isPublished),
  })).filter((g) => g.list.length > 0);

  if (grouped.length === 0) {
    return (
      <p className="text-ink-muted">
        Estamos abriendo el cuadro de patrocinadores. ¿Quieres formar parte?{" "}
        <Link className="underline" href="/patrocinadores#colaborar">Escríbenos</Link>.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {grouped.map(({ tier, list }) => (
        <div key={tier}>
          <p className="badge mb-6">{TIER_LABEL[tier]}</p>
          <ul
            className={cn(
              "grid gap-6 items-center",
              tier === "DIAMOND" && "grid-cols-1 md:grid-cols-2",
              tier === "GOLD" && "grid-cols-2 md:grid-cols-3",
              tier === "SILVER" && "grid-cols-2 md:grid-cols-4",
              (tier === "BRONZE" || tier === "COLLAB") && "grid-cols-3 md:grid-cols-5",
            )}
          >
            {list.map((s) => (
              <li key={s.id}>
                <a
                  href={s.websiteUrl ?? "#"}
                  target={s.websiteUrl ? "_blank" : undefined}
                  rel={s.websiteUrl ? "noreferrer" : undefined}
                  className="group flex items-center justify-center rounded-2xl border border-ink/10 bg-bg p-6 transition hover:bg-bg-alt hover:shadow-soft hover:border-brand-orange/40"
                >
                  {s.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className={cn(
                        "object-contain max-w-full opacity-80 transition group-hover:opacity-100",
                        TIER_SIZE[tier],
                      )}
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-display text-xl text-ink">{s.name}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
