"use client";

import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { AdminNavHeader } from "@/components/admin/admin-nav-header";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminNavHeader />
      </SidebarHeader>
      <SidebarContent>
        <AdminNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
