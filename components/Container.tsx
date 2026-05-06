import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { tight?: boolean; wide?: boolean };

export function Container({ tight, wide, className, ...rest }: Props) {
  return (
    <div
      className={cn(
        "container",
        tight && "max-w-5xl",
        wide && "max-w-7xl",
        !tight && !wide && "max-w-6xl",
        className,
      )}
      {...rest}
    />
  );
}
