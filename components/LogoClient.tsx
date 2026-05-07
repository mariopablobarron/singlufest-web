"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoTypo } from "./LogoTypo";

/**
 * Versión cliente del logo. Si la imagen falla (no existe el archivo o es vacío),
 * cae al lettering tipográfico. Use en componentes con "use client" como NavBar.
 */
export function LogoClient({ className, size = 48 }: { className?: string; size?: number }) {
  const [errored, setErrored] = useState(false);
  if (errored) return <LogoTypo className={className} />;
  return (
    <span className={cn("inline-flex items-center", className)} aria-label="Singlufest">
      <Image
        src="/brand/logo.png"
        alt="Singlufest"
        width={size * 2.2}
        height={size}
        priority
        onError={() => setErrored(true)}
        className="object-contain h-12 sm:h-14 md:h-16 lg:h-[4.5rem] xl:h-20 3xl:h-24 w-auto drop-shadow-[0_0_24px_rgba(232,93,31,0.35)]"
      />
    </span>
  );
}
