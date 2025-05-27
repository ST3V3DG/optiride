import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { db } from "@/db/db";
import { PageHeader } from "@/components/page-header";
import { cars, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CarWithDriverName } from "@/lib/types";
import CarsTable from "@/components/cars-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";

async function getCars(): Promise<CarWithDriverName[]> {
  try {
    const results = await db
      .select({
        id: cars.id,
        brand: cars.brand,
        model: cars.model,
        year: cars.year,
        comfort: cars.comfort,
        registration: cars.registration,
        number_of_seats: cars.number_of_seats,
        driverId: cars.driverId,
        createdAt: cars.createdAt,
        updatedAt: cars.updatedAt,
        driver_name: users.name,
      })
      .from(cars)
      .leftJoin(users, eq(cars.driverId, users.id))
      .orderBy(cars.createdAt);

    return results as CarWithDriverName[];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export default async function Page() {
  const initialCars = await getCars();
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
          title="Cars"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Cars", href: "/dashboard/cars" },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex-1 space-y-4 p-4 pt-0">
          <CarsTable initialCars={initialCars} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
