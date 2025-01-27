"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

interface Props extends ButtonProps {
  href: string;
}

export function NavButton({ href, children, ...props }: Props) {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const isActive = pathname === href || (segment && href.includes(segment));

  return (
    <Link href={href}>
      <Button
        variant={"ghost"}
        className={cn("text-gray-500", isActive && "bg-secondary text-primary")}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
}
