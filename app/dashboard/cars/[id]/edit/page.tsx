import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import CarsEdit from "@/components/cars-edit";
import { db } from "@/db/db";
import { cars, users } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { CarWithDriverName } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";

async function getCar(id: string): Promise<CarWithDriverName | null> {
  try {
    const results = await db
      .select({
        ...getTableColumns(cars),
        driver_name: users.name,
      })
      .from(cars)
      .where(eq(cars.id, Number(id)))
      .leftJoin(users, eq(cars.driverId, users.id))
      .limit(1);

    if (results.length === 0) return null;

    return results[0] as CarWithDriverName;
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCar(id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userProps: NavUserProps = {
    id: session?.user?.id || null,
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    image: session?.user?.image || null,
  };

  // It's important to check if car exists before trying to access its properties for auth checks
  if (!car) {
    // Render the existing not found UI; no redirect needed here as session is valid
    // but the specific resource is not found.
    return (
      // Copied from existing !car block below, but ensuring session data is passed to sidebar
      <SidebarProvider>
        <AppSidebar user={userProps} />
        <SidebarInset>
          <PageHeader
            title="Car Not Found"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Cars", href: "/dashboard/cars" },
              { label: "Error", href: `/dashboard/cars/${id}/edit` },
            ]}
            actions={<ThemeToggle />}
          />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
            <p>The car with ID {id} could not be found.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // const canUpdateCar = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { car: ["update"] } } });

  // if (canUpdateCar?.success) {
  //   // Admin with permission can edit any car.
  //   // If user is a driver, they must own the car.
  //   if (session.user?.role === 'driver' && String(car.driverId) !== session.user.id) {
  //     redirect('/dashboard/cars'); // Forbidden, not their car
  //   }
  //   // If user is 'user' (client), they cannot edit cars based on current permissions.
  //   else if (session.user?.role === 'user') {
  //      redirect('/dashboard/cars'); // Forbidden
  //   }
  // } else {
  //   // No general 'update' permission
  //   redirect('/dashboard/cars'); // Forbidden
  // }

  return (
    <SidebarProvider>
      <AppSidebar user={userProps} />
      <SidebarInset>
        <PageHeader
          title={`Edit Car`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Cars", href: "/dashboard/cars" },
            { label: `Edit Car #${car.id}`, href: `/dashboard/cars/${car.id}` },
            { label: "Edit", href: `/dashboard/cars/${id}/edit` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CarsEdit car={car} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
