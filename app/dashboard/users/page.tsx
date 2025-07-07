import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import UsersTable from "@/components/users-table";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {

  const pageHeaderActions = (
    <div className="flex gap-2 items-center">
        <Button asChild>
          <Link className="text-white" href="/dashboard/users/create">Create User</Link>
        </Button>
      <ThemeToggle />
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          title="Users"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: "/dashboard/users" },
          ]}
          actions={pageHeaderActions}
        />
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min px-2 p-4">
            <UsersTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
