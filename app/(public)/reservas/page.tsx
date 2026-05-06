import { Section } from "@/components/Section";
import { ReservationForm } from "@/components/ReservationForm";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Reservas",
  description: "Reserva tu plaza para showcookings, catas y talleres del Singlufest.",
};

async function load() {
  try {
    const [settings, edition] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.edition.findFirst({
        where: { isCurrent: true, isPublished: true },
        include: {
          events: {
            where: { isPublished: true },
            orderBy: { startsAt: "asc" },
          },
        },
      }),
    ]);
    return { settings, edition };
  } catch {
    return { settings: null, edition: null };
  }
}

export default async function ReservasPage() {
  const { settings, edition } = await load();
  const bookingsOpen = settings?.bookingsOpen ?? false;
  const events = edition?.events.map((e) => ({ id: e.id, title: e.title })) ?? [];

  return (
    <Section
      eyebrow="Reservas"
      title={bookingsOpen ? <>Asegura tu sitio</> : <>Avísame cuando abran</>}
      description={
        bookingsOpen
          ? "Aforo limitado en showcookings y catas. La entrada al mercado siempre es libre."
          : "Aún estamos confirmando aforos. Apúntate y te escribimos en cuanto se abran."
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ReservationForm events={events} bookingsOpen={bookingsOpen} />
        <aside className="card">
          <h3 className="text-xl font-display">Lo que pasa después</h3>
          <ol className="mt-5 space-y-4 text-sm text-ink-muted">
            <li><span className="font-semibold text-ink">1.</span> Confirmamos tu reserva por email en menos de 24h.</li>
            <li><span className="font-semibold text-ink">2.</span> Si la actividad cambia, te avisamos personalmente.</li>
            <li><span className="font-semibold text-ink">3.</span> Llegas, das tu nombre y disfrutas. Sin imprimir nada.</li>
          </ol>
          <hr className="hairline my-6" />
          <p className="text-sm text-ink-muted">
            ¿Eres restaurante o productor sin gluten y quieres expositor?{" "}
            <a className="underline" href="/patrocinadores#colaborar">Escríbenos</a>.
          </p>
        </aside>
      </div>
    </Section>
  );
}
