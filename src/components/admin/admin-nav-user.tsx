"use client";

import { IconLogout, IconSelector, IconUserCircle } from "@tabler/icons-react";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { APP_ROUTES } from "@/lib/contants";
import { useUser } from "@/queries/user.queries";
import { getInitials } from "@/utils/get-initials";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminNavUser() {
  const router = useRouter();
  const user = useUser();

  if (!user?.data) {
    return <Skeleton className="h-12 w-full bg-sidebar-accent" />;
  }

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(APP_ROUTES.LOGIN);
        },
      },
    });
  };

  const isAdmin = user.data.role === "admin" || user.data.role === "superadmin";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.data.image ?? ""} alt={user.data.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.data.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.data.name}</span>
                <span className="truncate text-xs">{user.data.email}</span>
              </div>
              <IconSelector className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.data.image ?? ""}
                    alt={user.data.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.data.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.data.name}
                  </span>
                  <span className="truncate text-xs">{user.data.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/settings">
                <DropdownMenuItem>
                  <IconSettings />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            {isAdmin && (
              <DropdownMenuGroup>
                <Link href="/admin">
                  <DropdownMenuItem>
                    <IconUserCircle />
                    Admin
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
