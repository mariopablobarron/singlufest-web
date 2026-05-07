"use client";

import { useState, useTransition } from "react";
import { Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  initialCount: number;
  initialVoted?: boolean;
  variant?: "card" | "hero";
  className?: string;
};

export function VoteButton({
  slug,
  initialCount,
  initialVoted = false,
  variant = "card",
  className,
}: Props) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function vote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending || voted) return;

    // Optimistic UI
    setCount((c) => c + 1);
    setVoted(true);
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/vote/${encodeURIComponent(slug)}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error votando");
        setCount(data.count);
        setVoted(true);
      } catch (e) {
        // Revertir si falla
        setCount((c) => c - 1);
        setVoted(false);
        setError(e instanceof Error ? e.message : "Error inesperado");
      }
    });
  }

  if (variant === "hero") {
    return (
      <button
        onClick={vote}
        disabled={pending || voted}
        aria-label={voted ? "Ya has votado" : "Votar a este candidato"}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.18em] transition-all",
          voted
            ? "bg-brand-orange text-brand-bone cursor-default"
            : "bg-bg/85 backdrop-blur text-ink border border-ink/15 hover:border-brand-orange hover:text-brand-orange hover:scale-[1.02]",
          pending && "opacity-70 cursor-wait",
          className,
        )}
      >
        {voted ? (
          <Check className="w-4 h-4" />
        ) : (
          <Heart className={cn("w-4 h-4", voted && "fill-current")} />
        )}
        <span>
          {voted ? "Voto registrado" : "Votar"}
        </span>
        <strong className="text-base">
          · {count.toLocaleString("es-ES")}
        </strong>
        {error && <span className="sr-only">{error}</span>}
      </button>
    );
  }

  // variant card (compacto, sobre la card del candidato)
  return (
    <button
      onClick={vote}
      disabled={pending || voted}
      aria-label={voted ? "Ya has votado" : `Votar a ${slug}`}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all backdrop-blur",
        voted
          ? "bg-brand-bone text-brand-orange shadow-soft cursor-default"
          : "bg-brand-carbon/40 text-brand-bone hover:bg-brand-orange hover:text-brand-bone",
        pending && "opacity-70 cursor-wait",
        className,
      )}
    >
      <Heart
        className={cn("w-3.5 h-3.5 transition-all", voted ? "fill-brand-orange text-brand-orange scale-110" : "fill-brand-orange text-brand-orange")}
      />
      <span>{count.toLocaleString("es-ES")}</span>
    </button>
  );
}
