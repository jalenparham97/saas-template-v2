"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconHome, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

export function NavMain() {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();

  function isActive(path: string, name: string) {
    return segment === name.toLowerCase() || pathname === path;
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Link href="/dashboard">
          <SidebarMenuItem>
            <SidebarMenuButton isActive={isActive("/dashboard", "dashboard")}>
              <IconHome size={18} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
        <Link href="/settings">
          <SidebarMenuItem>
            <SidebarMenuButton isActive={isActive("/settings", "settings")}>
              <IconSettings size={18} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}
