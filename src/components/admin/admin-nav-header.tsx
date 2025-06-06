import { SidebarMenuButton } from "@/components/ui/sidebar";
import { APP_NAME } from "@/lib/contants";
import { Command } from "lucide-react";
import Link from "next/link";

export function AdminNavHeader() {
  return (
    <SidebarMenuButton size="lg" asChild>
      <Link href="/admin">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Command className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{APP_NAME}</span>
          <span className="truncate text-xs">Admin Dashboard</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
}
