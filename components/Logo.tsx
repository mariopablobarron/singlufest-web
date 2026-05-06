import Image from "next/image";
import { cn } from "@/lib/utils";
import { hasOfficialLogo } from "@/lib/brand";
import { LogoTypo } from "./LogoTypo";

/**
 * Server-only Logo. Decide en server si renderizar la imagen oficial o el lettering tipográfico.
 * Para Client Components usa LogoClient (con onError fallback).
 */
export function Logo({ className, size = 48, forceFallback = false }: { className?: string; size?: number; forceFallback?: boolean }) {
  if (forceFallback || !hasOfficialLogo()) {
    return <LogoTypo className={className} />;
  }
  return (
    <span className={cn("inline-flex items-center", className)} aria-label="Singlufest">
      <Image
        src="/brand/logo.png"
        alt="Singlufest"
        width={size * 2.2}
        height={size}
        priority
        className="object-contain h-10 md:h-12 w-auto drop-shadow-[0_0_24px_rgba(232,93,31,0.35)]"
      />
    </span>
  );
}

export { LogoTypo };
