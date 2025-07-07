import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageHeader } from "@/components/page-header";
import RidesTable from "@/components/rides-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const pageHeaderActions = (
    <div className="flex gap-2 items-center">
        <Button asChild>
          <Link className="text-white" href="/dashboard/rides/create">Create Ride</Link>
        </Button>
      <ThemeToggle />
    </div>
  );
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          title="Rides"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Rides", href: "/dashboard/rides" },
          ]}
          actions={pageHeaderActions}
        />
        <div className="flex-1 p-4 pt-0 space-y-4">
          <RidesTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
