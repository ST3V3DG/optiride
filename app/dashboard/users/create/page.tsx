import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import React from "react";
import UsersCreate from "@/components/users-create";
import { PageHeader } from "@/components/page-header";

export default function Page() {

    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
         <PageHeader
           title={`Create user`}
           breadcrumbs={[
             { label: "Dashboard", href: "/dashboard" },
             { label: "users", href: "/dashboard/users" },
             { label: "Create", href: `/dashboard/users/create` },
           ]}
           actions={<ThemeToggle />}
         />
          <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
            <UsersCreate />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
}
