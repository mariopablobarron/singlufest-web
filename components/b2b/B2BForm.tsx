"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Nombre obligatorio"),
  company: z.string().min(2, "Empresa o proyecto obligatorio"),
  email: z.string().email("Email no válido"),
  phone: z.string().optional(),
  path: z.enum(["patrocinador", "colaborador", "embajador"]),
  budget: z.string().optional(),
  message: z.string().min(20, "Cuéntanos un poco más (mínimo 20 chars)"),
  consent: z.literal(true, { errorMap: () => ({ message: "Necesitamos tu consentimiento" }) }),
  website: z.string().max(0).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export function B2BForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { path: "patrocinador", consent: false as unknown as true },
  });

  async function onSubmit(values: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar el formulario");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-brand-orange text-brand-carbon p-10 md:p-14 text-center">
        <p className="badge !bg-brand-bone !text-brand-orange !border-brand-bone mb-6">Recibido</p>
        <h3 className="h-brutal text-display-md">Hablamos en menos de 48h.</h3>
        <p className="mt-4 text-brand-carbon/85">
          Vamos a leer tu mensaje en detalle y te enviamos propuesta personalizada al email que indicaste.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-bg border border-ink/10 p-7 md:p-10 grid gap-6 shadow-soft">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">Tu nombre</label>
          <input id="name" {...register("name")} className="field-input" placeholder="Cómo te llamamos" />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="company">Empresa o proyecto</label>
          <input id="company" {...register("company")} className="field-input" placeholder="Tu marca / proyecto" />
          {errors.company && <p className="field-error">{errors.company.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" {...register("email")} type="email" className="field-input" placeholder="tu@email.com" />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="phone">Teléfono (opcional)</label>
          <input id="phone" {...register("phone")} className="field-input" placeholder="+34 600 000 000" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="path">¿Qué buscas?</label>
          <select id="path" {...register("path")} className="field-input">
            <option value="patrocinador">Patrocinar el festival (€)</option>
            <option value="colaborador">Colaborar (intercambio)</option>
            <option value="embajador">Ser embajador (creator/profesional)</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="budget">Presupuesto orientativo (opcional)</label>
          <select id="budget" {...register("budget")} className="field-input">
            <option value="">Aún no lo sé</option>
            <option value="500-1500">500€ - 1.500€</option>
            <option value="1500-3500">1.500€ - 3.500€</option>
            <option value="3500-8000">3.500€ - 8.000€</option>
            <option value="8000+">8.000€+</option>
            <option value="intercambio">Intercambio / sin €</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="message">Cuéntanos qué te encajaría</label>
        <textarea
          id="message"
          {...register("message")}
          rows={5}
          className="field-input resize-none"
          placeholder="Tu marca, lo que aportarías, qué tipo de activación te ilusiona…"
        />
        {errors.message && <p className="field-error">{errors.message.message}</p>}
      </div>

      <label className="flex gap-3 items-start text-sm text-ink-muted cursor-pointer">
        <input type="checkbox" {...register("consent")} className="mt-1 rounded border-ink/30 text-brand-orange focus:ring-brand-orange" />
        <span>
          Acepto que SingluFest guarde estos datos para responderme. Más en{" "}
          <a href="/privacidad" className="underline">Privacidad</a>.
        </span>
      </label>
      {errors.consent && <p className="field-error">{errors.consent.message as string}</p>}

      {/* honeypot */}
      <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" className="hidden" />

      {error && <p className="field-error">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={submitting} className="btn-accent btn-lg">
          {submitting ? "Enviando…" : "Quiero hablar"}
        </button>
        <p className="text-xs text-ink-muted">Respondemos en menos de 48h. Sin envíos automáticos.</p>
      </div>
    </form>
  );
}
