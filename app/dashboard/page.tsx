import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
import React from "react";

export default async function Page() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    const userProps: NavUserProps = {
      id: session?.user?.id || null,
      name: session?.user?.name || null,
      email: session?.user?.email || null,
      image: session?.user?.image || null,
    };
  
    return (
      <SidebarProvider>
        <AppSidebar user={userProps} />
      <SidebarInset>
        <PageHeader
          title="Dashboard"
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
