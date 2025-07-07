import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import RidesCreate from "@/components/rides-create";

export default async function Page() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          title="New Ride"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Rides", href: "/dashboard/rides" },
            { label: "New Ride", href: "/dashboard/rides/create" },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <RidesCreate />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
