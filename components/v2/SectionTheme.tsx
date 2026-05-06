import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Wrapper de sección. En SingluFest v2 todas las secciones viven en papel claro.
 * Mantengo la prop `theme` por compat pero ya no aplica oscuridad — el contraste
 * lo damos con cards de color (naranja/vino/lemon) sobre el fondo crema.
 */
type Props = HTMLAttributes<HTMLElement> & {
  theme?: "papel" | "teatro"; // teatro queda como variante puntual si la quieres
  alt?: boolean;
  as?: "section" | "header" | "footer" | "div";
};

export function ThemedSection({ theme = "papel", alt, as: Tag = "section", className, ...rest }: Props) {
  const isTeatro = theme === "teatro";
  return (
    <Tag
      className={cn(
        "relative",
        isTeatro
          ? "theme-teatro bg-brand-carbon text-brand-bone"
          : alt
            ? "bg-brand-parchment text-ink"
            : "bg-bg text-ink",
        className,
      )}
      {...rest}
    />
  );
}
