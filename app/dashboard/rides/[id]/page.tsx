import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import RideDetails from "@/components/ride-details";
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
          title="Ride details"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Rides", href: "/dashboard/rides" },
            { label: "Ride details", href: `/dashboard/rides/${id}` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <RideDetails id={id} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
