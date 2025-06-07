import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { cars, users } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { CarWithDriverName } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
import CarsTable from "@/components/cars-table";
import { PageHeader } from "@/components/page-header";

async function getCars(id: string): Promise<CarWithDriverName[]> {
  try {
    const results = await db
      .select({
        id: cars.id,
        brand: cars.brand,
        model: cars.model,
        year: cars.year,
        comfort: cars.comfort,
        registration: cars.registration,
        available_seats: cars.available_seats,
        driverId: cars.driverId,
        createdAt: cars.createdAt,
        updatedAt: cars.updatedAt,
        driver_name: users.name,
      })
      .from(cars)
      .leftJoin(users, eq(cars.driverId, users.id))
      .where(eq(cars.driverId, Number(id)))
      .orderBy(cars.createdAt);

    return results as CarWithDriverName[];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const cars = await getCars(id);

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
          title="User profile"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: "/dashboard/users" },
            { label: "User profile", href: `/dashboard/users/${id}` },
            { label: "Cars", href: `/dashboard/users/${id}/cars` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
            <CarsTable initialCars={cars} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
