import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { db } from "@/db/db";
import { PageHeader } from "@/components/page-header";
import { rides, cities, users, cars } from "@/db/schema";
import { eq, sql, getTableColumns } from "drizzle-orm";
import RidesTable from "@/components/rides-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RideWithNames } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";

async function getRides(): Promise<RideWithNames[]> {
  try {
    const results = await db
      .select({
        ...getTableColumns(rides),
        departure_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_departure})`,
        arrival_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_arrival})`,
        car: cars.model,
      })
      .from(rides)
      .leftJoin(users, eq(rides.driverId, users.id))
      .leftJoin(cars, eq(rides.carId, cars.id))
      .orderBy(rides.createdAt);

    return results as RideWithNames[];
  } catch (error) {
    console.error("Error fetching rides:", error);
    return [];
  }
}

export default async function Page() {
  const initialRides = await getRides();
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
          title="Rides"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Rides", href: "/dashboard/rides" },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex-1 space-y-4 p-4 pt-0">
          <RidesTable initialRides={initialRides} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
