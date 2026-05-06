import { cn } from "@/lib/utils";

/**
 * Lettering tipográfico de fallback (Almendra SC con glow naranja).
 * Server-safe: sin client APIs ni file system.
 */
export function LogoTypo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1 font-display tracking-tight", className)}>
      <span className="text-3xl md:text-4xl leading-none text-brand-orange glow-orange">
        Singlu
      </span>
      <span className="text-3xl md:text-4xl leading-none text-brand-orange/90">
        Fest
      </span>
    </span>
  );
}
