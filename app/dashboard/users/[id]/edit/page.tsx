import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import UsersEdit from "@/components/users-edit";
import { PageHeader } from "@/components/page-header";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          title="Edit User"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: "/dashboard/users" },
            { label: "Edit User", href: `/dashboard/users/${id}/edit` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          <UsersEdit id={id} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
