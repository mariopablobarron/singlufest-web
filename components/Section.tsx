import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { HTMLAttributes, ReactNode } from "react";

type Props = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  alt?: boolean;
  inverse?: boolean;
  containerClassName?: string;
};

export function Section({
  eyebrow,
  title,
  description,
  alt,
  inverse,
  className,
  containerClassName,
  children,
  ...rest
}: Props) {
  return (
    <section
      className={cn(
        "py-20 md:py-28",
        alt && "bg-bg-alt",
        inverse && "bg-bg-inverse text-ink-inverse",
        className,
      )}
      {...rest}
    >
      <Container className={containerClassName}>
        {(eyebrow || title || description) && (
          <header className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.18em] text-ink-muted mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-display-md text-balance">{title}</h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-ink-muted text-pretty">{description}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
