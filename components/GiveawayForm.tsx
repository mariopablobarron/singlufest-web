"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Check } from "lucide-react";
import { giveawayEntrySchema, type GiveawayEntryInput } from "@/lib/validations-giveaway";

export function GiveawayForm({ slug, mentionTarget = "singlufest", hashtag }: { slug: string; mentionTarget?: string; hashtag?: string | null }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GiveawayEntryInput>({
    resolver: zodResolver(giveawayEntrySchema),
    defaultValues: { consent: false as unknown as true },
  });

  async function onSubmit(values: GiveawayEntryInput) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/giveaways/${slug}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo registrar la entrada");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-brand-orange text-brand-carbon p-8 md:p-10 text-center">
        <Check className="w-10 h-10 mx-auto mb-4" />
        <p className="badge !bg-brand-bone !text-brand-orange !border-brand-bone mb-4">¡Entrada registrada!</p>
        <h3 className="h-brutal text-2xl md:text-3xl">Estás dentro.</h3>
        <p className="mt-3 text-brand-carbon/85 max-w-lg mx-auto">
          Verificamos manualmente que has compartido el post (puede tardar 24-48h). Si todo cuadra,
          entras al sorteo. Si te seleccionamos como ganador, te avisamos por email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-bg border border-ink/10 p-6 md:p-8 grid gap-5 shadow-soft">
      <div className="rounded-xl bg-brand-orange/10 border border-brand-orange/30 p-4 text-sm text-ink">
        <p className="font-bold mb-1.5">Cómo participar:</p>
        <ol className="list-decimal list-inside space-y-1 text-ink/85">
          <li>Comparte cualquier post o reel del sorteo en tu Instagram (story o post).</li>
          <li>Menciona <strong>@{mentionTarget}</strong> {hashtag && <>y usa <strong>#{hashtag}</strong></>}.</li>
          <li>Rellena el formulario con tu @handle y la URL del post compartido.</li>
        </ol>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="igHandle">Tu @handle de Instagram</label>
          <input id="igHandle" {...register("igHandle")} className="field-input" placeholder="@tu_usuario" />
          {errors.igHandle && <p className="field-error">{errors.igHandle.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email (para avisarte si ganas)</label>
          <input id="email" {...register("email")} type="email" className="field-input" placeholder="tu@email.com" />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="sharedPostUrl">URL del post o reel que has compartido</label>
        <input
          id="sharedPostUrl"
          {...register("sharedPostUrl")}
          className="field-input"
          placeholder="https://www.instagram.com/p/..."
        />
        {errors.sharedPostUrl && <p className="field-error">{errors.sharedPostUrl.message}</p>}
        <p className="mt-1 text-xs text-ink-muted">
          Si has compartido en Story (que desaparece a las 24h), no hace falta URL — la verificamos por @handle.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="name">Nombre (opcional)</label>
        <input id="name" {...register("name")} className="field-input" placeholder="Cómo te llamamos si ganas" />
      </div>

      <label className="flex gap-3 items-start text-sm text-ink-muted cursor-pointer">
        <input type="checkbox" {...register("consent")} className="mt-1 rounded border-ink/30 text-brand-orange focus:ring-brand-orange" />
        <span>
          Acepto que SingluFest contacte conmigo si gano el sorteo y guarde estos datos durante 6 meses.
          Más en <a href="/privacidad" className="underline">Privacidad</a>.
        </span>
      </label>
      {errors.consent && <p className="field-error">{errors.consent.message as string}</p>}

      {/* honeypot */}
      <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" className="hidden" />

      {error && <p className="field-error">{error}</p>}

      <button disabled={submitting} className="btn-accent btn-lg justify-center">
        <Sparkles className="w-4 h-4" />
        {submitting ? "Enviando…" : "Quiero participar"}
      </button>
    </form>
  );
}
