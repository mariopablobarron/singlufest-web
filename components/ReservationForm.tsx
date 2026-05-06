"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { reservationSchema, type ReservationInput } from "@/lib/validations";

type Event = { id: string; title: string };

export function ReservationForm({ events, bookingsOpen }: { events: Event[]; bookingsOpen: boolean }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { id: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { partySize: 2, consent: false as unknown as true },
  });

  async function onSubmit(values: ReservationInput) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No hemos podido procesar tu reserva");
      setDone({ id: data.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card-elevated">
        <p className="badge">¡Recibido!</p>
        <h3 className="mt-4 text-3xl font-display tracking-tight">Gracias, lo tenemos.</h3>
        <p className="mt-3 text-ink-muted">
          Te hemos enviado un email de confirmación con la referencia <code className="px-1.5 py-0.5 bg-bg-alt rounded">{done.id}</code>.
          Revisa también la carpeta de spam, por si acaso.
        </p>
      </div>
    );
  }

  if (!bookingsOpen) {
    return (
      <div className="card-elevated">
        <p className="badge">Reservas cerradas</p>
        <h3 className="mt-4 text-3xl font-display tracking-tight">Avísame cuando abran</h3>
        <p className="mt-3 text-ink-muted">
          Apúntate y te escribimos en cuanto suelten aforo. Cero spam.
        </p>
        <form
          className="mt-6 flex flex-col sm:flex-row gap-3"
          action="/api/subscribe"
          method="post"
        >
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            required
            className="field-input flex-1"
          />
          <button className="btn-accent">Avisarme</button>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 card-elevated">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">Nombre</label>
          <input id="name" {...register("name")} className="field-input" placeholder="Cómo te llamamos" />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" {...register("email")} type="email" className="field-input" placeholder="tu@email.com" />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="phone">Teléfono (opcional)</label>
          <input id="phone" {...register("phone")} className="field-input" placeholder="+34 600 000 000" />
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="partySize">Personas</label>
          <input
            id="partySize"
            {...register("partySize", { valueAsNumber: true })}
            type="number"
            min={1}
            max={12}
            className="field-input"
          />
          {errors.partySize && <p className="field-error">{errors.partySize.message}</p>}
        </div>
      </div>

      {events.length > 0 && (
        <div>
          <label className="field-label" htmlFor="eventId">Actividad</label>
          <select id="eventId" {...register("eventId")} className="field-input">
            <option value="">Cualquier actividad / pase general</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="field-label" htmlFor="dietary">Otras alergias (opcional)</label>
        <input
          id="dietary"
          {...register("dietary")}
          className="field-input"
          placeholder="Ej. lactosa, frutos secos, vegetariano…"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="notes">Notas (opcional)</label>
        <textarea id="notes" {...register("notes")} rows={3} className="field-input resize-none" />
      </div>

      <label className="flex gap-3 items-start text-sm text-ink-muted cursor-pointer">
        <input type="checkbox" {...register("consent")} className="mt-1 rounded border-line text-accent focus:ring-accent" />
        <span>
          Acepto que Singlufest guarde estos datos para gestionar mi reserva y enviarme la confirmación.
          Más en <a href="/privacidad" className="underline">Privacidad</a>.
        </span>
      </label>
      {errors.consent && <p className="field-error">{errors.consent.message as string}</p>}

      {/* honeypot */}
      <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" className="hidden" />

      {error && <p className="field-error">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={submitting} className="btn-accent btn-lg">
          {submitting ? "Enviando…" : "Confirmar reserva"}
        </button>
        <p className="text-xs text-ink-muted">Te llegará un email en menos de un minuto.</p>
      </div>
    </form>
  );
}
