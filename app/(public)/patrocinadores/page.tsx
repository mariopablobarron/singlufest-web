import Link from "next/link";
import { Section } from "@/components/Section";
import { SponsorGrid } from "@/components/SponsorGrid";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Patrocinadores",
  description: "Marcas que hacen posible el Singlufest. Cómo colaborar con el festival.",
};

async function load() {
  try {
    return await prisma.sponsor.findMany({
      where: { isPublished: true },
      orderBy: [{ tier: "asc" }, { order: "asc" }],
    });
  } catch {
    return [];
  }
}

const TIER_BENEFITS: { tier: string; price: string; perks: string[] }[] = [
  {
    tier: "Diamante",
    price: "consultar",
    perks: ["Logo en cabecera de toda la comunicación", "Espacio premium en el mercado", "1 showcooking dedicado", "Vídeo de marca en redes"],
  },
  {
    tier: "Oro",
    price: "1.500€",
    perks: ["Logo en home y programa", "Espacio destacado en el mercado", "Mención en cada showcooking"],
  },
  {
    tier: "Plata",
    price: "750€",
    perks: ["Logo en sponsors page", "Espacio estándar en el mercado", "Newsletter pre-festival"],
  },
  {
    tier: "Bronce",
    price: "300€",
    perks: ["Logo en sponsors page", "Cesta de producto en el mercado"],
  },
];

export default async function PatrocinadoresPage() {
  const sponsors = await load();
  return (
    <>
      <Section
        eyebrow="Patrocinadores"
        title="Marcas que apuestan por la cocina sin gluten"
        description="Sin patrocinadores no hay festival. Estos son los nombres que hacen posible que cada año Granada se vista de mantel sin gluten."
      >
        <SponsorGrid sponsors={sponsors} />
      </Section>

      <Section id="colaborar" alt eyebrow="Colaborar"
        title="¿Quieres patrocinar?"
        description="Te dejamos los packs estándar. Si tu marca encaja con el festival y no encuentras tu hueco, escríbenos y montamos algo a medida.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TIER_BENEFITS.map((t) => (
            <div key={t.tier} className="card-elevated">
              <p className="badge">{t.tier}</p>
              <p className="mt-3 text-3xl font-display">{t.price}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink-muted">
                {t.perks.map((p) => <li key={p}>· {p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="mailto:hola@singlufest.es?subject=Patrocinio%20Singlufest" className="btn-primary">
            Hablemos
          </Link>
          <Link href="/" className="btn-outline">Volver al inicio</Link>
        </div>
      </Section>
    </>
  );
}
