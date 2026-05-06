import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Wrapper que aplica el tema (teatro oscuro / papel claro) cambiando las CSS vars.
 * Cualquier hijo que use `bg-bg`, `text-ink`, `text-ink-muted`, `bg-bg-alt`, etc.
 * heredará automáticamente el tema correcto.
 */
type Props = HTMLAttributes<HTMLElement> & {
  theme: "teatro" | "papel";
  as?: "section" | "header" | "footer" | "div";
};

export function ThemedSection({ theme, as: Tag = "section", className, ...rest }: Props) {
  return (
    <Tag
      className={cn(
        theme === "teatro" ? "theme-teatro bg-bg text-ink" : "theme-papel bg-bg text-ink",
        "relative",
        className,
      )}
      {...rest}
    />
  );
}
