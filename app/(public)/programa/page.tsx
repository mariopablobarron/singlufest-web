import Link from "next/link";
import { Section } from "@/components/Section";
import { EventCard } from "@/components/EventCard";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Programa",
  description: "Programa completo del Singlufest: showcookings, charlas, catas, talleres y mercado.",
};

async function load() {
  try {
    const editions = await prisma.edition.findMany({
      where: { isPublished: true },
      orderBy: [{ isCurrent: "desc" }, { year: "desc" }],
      include: {
        events: {
          where: { isPublished: true },
          orderBy: { startsAt: "asc" },
        },
      },
    });
    return editions;
  } catch {
    return [];
  }
}

export default async function ProgramaPage() {
  const editions = await load();
  const current = editions.find((e) => e.isCurrent) ?? editions[0];

  if (!current) {
    return (
      <Section
        eyebrow="Programa"
        title="Programa en construcción"
        description="Estamos cerrando la próxima edición. Suscríbete y te avisamos cuando esté."
      >
        <Link className="btn-primary" href="/reservas">Avisarme</Link>
      </Section>
    );
  }

  // group by day
  const days = new Map<string, typeof current.events>();
  current.events.forEach((ev) => {
    const key = ev.startsAt.toISOString().split("T")[0];
    if (!days.has(key)) days.set(key, []);
    days.get(key)!.push(ev);
  });

  return (
    <Section
      eyebrow={`${current.title} · ${current.year}`}
      title={current.subtitle ?? "Programa completo"}
      description={current.description ?? undefined}
    >
      {[...days.entries()].map(([day, events]) => {
        const date = new Date(day);
        return (
          <div key={day} className="mt-12 first:mt-0">
            <h2 className="text-display-md font-display capitalize mb-6">
              {new Intl.DateTimeFormat("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(date)}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.id} event={e} editionSlug={current.slug} />
              ))}
            </div>
          </div>
        );
      })}
    </Section>
  );
}
