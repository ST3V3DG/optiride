"use client";

import * as React from "react";
import { Car, TrafficCone, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { NavMain } from "@/components/nav-main";
import NavUserClient from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { NavUserProps } from "@/lib/types";

function isActive({ url, pathname }: { url: string; pathname: string }) {
  return pathname.startsWith(url);
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: NavUserProps | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  // Determine if the user can view the "Users" link
  // This assumes authClient.organization.checkRolePermission can access the current user's
  // active organization role from its context/session.
  const canViewUsers = authClient.organization.checkRolePermission({ permissions: { userResource: ["read"] } });

  const navMainItems = [
    // Users item - conditional
    ...(canViewUsers ? [{
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      isActive: isActive({ url: "/dashboard/users", pathname }),
      items: [
        {
          title: "List of users",
          url: "/dashboard/users",
        },
        {
          title: "Add a user",
          url: "/dashboard/users/create",
        },
      ],
    }] : []),
    // Rides item - always visible for now
    {
      title: "Rides",
      url: "/dashboard/rides",
      icon: TrafficCone,
      isActive: isActive({ url: "/dashboard/rides", pathname }),
      items: [
        {
          title: "List of rides",
          url: "/dashboard/rides",
        },
        {
          title: "Add a ride",
          url: "/dashboard/rides/create",
        },
      ],
    },
    // Cars item - always visible for now
    {
      title: "Cars",
      url: "/dashboard/cars",
      icon: Car,
      isActive: isActive({ url: "/dashboard/cars", pathname }),
      items: [
        {
          title: "List of cars",
          url: "/dashboard/cars",
        },
        {
          title: "Add a car",
          url: "/dashboard/cars/create",
        },
      ],
    },
  ];

  const data = {
    navMain: navMainItems,
  };
        icon: TrafficCone,
        isActive: isActive({ url: "/dashboard/rides", pathname }),
        items: [
          {
            title: "List of rides",
            url: "/dashboard/rides",
          },
          {
            title: "Add a ride",
            url: "/dashboard/rides/create",
          },
        ],
      },
      {
        title: "Cars",
        url: "/dashboard/cars",
        icon: Car,
        isActive: isActive({ url: "/dashboard/cars", pathname }),
        items: [
          {
            title: "List of cars",
            url: "/dashboard/cars",
          },
          {
            title: "Add a car",
            url: "/dashboard/cars/create",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      {/* <SidebarHeader>
        <div className="flex place-content-center">
          <p className="text-4xl font-bold text-muted-foreground">
            Optiride
          </p>
        </div>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUserClient user={user} isMobile={isMobile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
