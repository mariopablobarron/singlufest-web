import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * Reveal con animación CSS pura. Renderiza siempre el contenido (sin whileInView)
 * para que el HTML inicial sea completo (mejor SEO + screenshots predictibles).
 */
type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
};

export function Reveal({ children, delay = 0, className, style, ...rest }: Props) {
  return (
    <div
      className={cn("animate-fade-up", className)}
      style={{ animationDelay: `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
