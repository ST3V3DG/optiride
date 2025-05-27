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

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
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

  if (!car) {
    return (
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
          />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
            <p>The car with ID {id} could not be found.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CarsEdit car={car} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
