import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Marquee({
  items,
  separator = "❀",
  className,
}: {
  items: ReactNode[];
  separator?: ReactNode;
  className?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-12 px-8">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-display text-3xl md:text-5xl uppercase tracking-tight">{it}</span>
          <span className="text-2xl text-brand-orange/70" aria-hidden>{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("relative overflow-hidden mask-fade-x", className)}>
      <div className="flex animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
