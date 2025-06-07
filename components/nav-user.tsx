"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
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
import LogoutButton from "./logout-button";
import { NavUserProps } from "@/lib/types";
import Link from "next/link";

type NavUserClientProps = {
  user: NavUserProps | null;
  isMobile: boolean;
}

export default function NavUserClient({ user, isMobile }: NavUserClientProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.image ?? ""}
                  alt={user?.name ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg uppercase">
                  {user?.name?.slice(0, 2) ?? "US"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.name ?? "User"}
                </span>
                <span className="truncate text-xs">
                  {user?.email ?? "email@example.com"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.image ?? ""}
                    alt={user?.name ?? ""}
                  />
                  <AvatarFallback className="rounded-lg uppercase">
                    {user?.name?.slice(0, 1) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name ?? "User"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email ?? "email@example.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="*:hover:bg-accent-foreground/30 *:cursor-pointer">
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="*:hover:bg-accent-foreground/30 *:cursor-pointer">
              <DropdownMenuItem asChild>
                <Link href={'/dashboard/users/' + user?.id}>
                <BadgeCheck />
                Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="*:cursor-pointer *:text-white has-hover:bg-red-500/90 bg-red-500 group dark:bg-red-500/50 dark:has-hover:bg-red-500/70 justify-start">
              <LogOut className="group-hover:text-white" />
              <LogoutButton className="bg-transparent hover:bg-transparent text-white flex-grow pl-0" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
