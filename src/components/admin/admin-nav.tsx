"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconBrandStripe, IconHome, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

export function AdminNav() {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();

  function isActive({ path, name }: { path: string; name: string }) {
    return segment === name.toLowerCase() || pathname === path;
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Link href="/admin">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive({
                path: "/admin",
                name: "dashboard",
              })}
            >
              <IconHome size={18} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
        <Link href="/admin/users">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive({ path: "/admin/users", name: "users" })}
            >
              <IconUsers size={18} />
              <span>Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
        <Link href="/admin/subscriptions">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive({
                path: "/admin/subscriptions",
                name: "subscriptions",
              })}
            >
              <IconBrandStripe size={18} />
              <span>Subscriptions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}
