import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  
    return (
      <SidebarProvider>
        <AppSidebar />
      <SidebarInset>
        <PageHeader
          title="Dashboard"
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
