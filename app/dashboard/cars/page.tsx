import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageHeader } from "@/components/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CarsTable from "@/components/cars-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {

  const pageHeaderActions = (
      <div className="flex items-center gap-2">
          <Button asChild>
            <Link className="text-white" href="/dashboard/cars/create">Create Car</Link>
          </Button>
        <ThemeToggle />
      </div>
    );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          title="Cars"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Cars", href: "/dashboard/cars" },
          ]}
          actions={pageHeaderActions}
        />
        <div className="flex-1 space-y-4 p-4 pt-0">
          <CarsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
