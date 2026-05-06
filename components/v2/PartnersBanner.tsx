import Link from "next/link";
import { ThemedSection } from "./SectionTheme";
import { prisma } from "@/lib/db";

async function loadCollabs() {
  try {
    return await prisma.sponsor.findMany({
      where: { isPublished: true, tier: { in: ["DIAMOND", "GOLD", "SILVER", "BRONZE", "COLLAB"] } },
      orderBy: [{ tier: "asc" }, { order: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function PartnersBannerV2() {
  const sponsors = await loadCollabs();

  return (
    <ThemedSection theme="papel" className="py-20 md:py-24 border-t border-line">
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge mb-3">Ellos hacen posible el festival</p>
            <h2 className="h-brutal text-3xl md:text-4xl text-ink">
              Partners <span className="text-brand-orange">premium</span>
            </h2>
          </div>
          <Link href="/b2b" className="btn-primary">
            ¿Quieres ser partner? Hablemos →
          </Link>
        </div>

        {sponsors.length === 0 ? (
          <p className="text-ink-muted">
            Estamos cerrando colaboraciones. Si tu marca encaja con SingluFest,{" "}
            <Link href="/b2b" className="underline">escríbenos</Link>.
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {sponsors.map((s) => (
              <li key={s.id}>
                <a
                  href={s.websiteUrl ?? "#"}
                  target={s.websiteUrl ? "_blank" : undefined}
                  rel={s.websiteUrl ? "noreferrer" : undefined}
                  className="group flex items-center justify-center rounded-2xl border border-ink/10 bg-bg p-5 transition hover:border-brand-orange/40 hover:bg-bg-alt"
                >
                  {s.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="object-contain h-12 md:h-14 max-w-full opacity-80 transition group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-display text-lg text-ink">{s.name}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ThemedSection>
  );
}
