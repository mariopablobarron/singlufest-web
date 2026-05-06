import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event, EventKind } from "@prisma/client";
import { eur } from "@/lib/utils";

const KIND_LABEL: Record<EventKind, string> = {
  SHOWCOOKING: "Showcooking",
  CHARLA: "Charla",
  CATA: "Cata",
  TALLER: "Taller",
  CONCIERTO: "Concierto",
  MERCADO: "Mercado",
  OTRO: "Actividad",
};

export function EventCard({ event, editionSlug }: { event: Event; editionSlug: string }) {
  const date = new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(event.startsAt);
  const hour = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(event.startsAt);

  return (
    <Link
      href={`/programa/${editionSlug}/${event.slug}`}
      className="card group block transition hover:shadow-soft hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="badge">{KIND_LABEL[event.kind]}</span>
        <span className="text-sm font-medium text-accent">
          {event.priceCents === 0 ? "Gratis" : eur(event.priceCents)}
        </span>
      </div>
      <h3 className="mt-4 text-2xl font-display tracking-tight group-hover:text-accent transition-colors">
        {event.title}
      </h3>
      {event.speaker && (
        <p className="mt-1 text-sm text-ink-muted">con {event.speaker}</p>
      )}
      <dl className="mt-5 space-y-2 text-sm text-ink-muted">
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</div>
        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {hour}</div>
        {event.venue && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.venue}</div>}
      </dl>
    </Link>
  );
}
