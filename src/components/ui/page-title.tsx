import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export function PageTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h1 className={cn("text-2xl font-semibold sm:text-2xl", className)}>
      {children}
    </h1>
  );
}
