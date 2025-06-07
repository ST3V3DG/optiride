import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import CarsCreate from "@/components/cars-create";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
import { redirect } from "next/navigation";

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
  // const canCreateCar = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { car: ["create"] } } });
  // if (!canCreateCar?.success) {
  //   redirect('/dashboard/cars'); // Or to a more general access-denied page
  // }

  return (
    <SidebarProvider>
      <AppSidebar user={userProps} />
      <SidebarInset>
        <PageHeader
          title="New Car"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Cars", href: "/dashboard/cars" },
            { label: "New Car", href: "/dashboard/cars/create" },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CarsCreate />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
