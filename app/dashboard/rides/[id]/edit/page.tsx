import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import RidesEdit from "@/components/rides-edit";
import { db } from "@/db/db";
import { rides, users, cities, Ride } from "@/db/schema";
import { sql, eq, getTableColumns } from "drizzle-orm";
import { RideWithNames } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";

export const dynamicParams = false;

export async function generateStaticParams() {
  const rows = await db.select({ id: rides.id }).from(rides);
  return rows.map((row) => ({
    id: String(row.id),
  }));
}

async function getRide(id: string): Promise<RideWithNames | null> {
  try {
    const results = await db
      .select({
        ...getTableColumns(rides),
        driver_name: users.name,
        departure_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_departure})`,
        arrival_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_arrival})`,
      })
      .from(rides)
      .where(eq(rides.id, Number(id)))
      .leftJoin(users, eq(rides.driverId, users.id))
      .orderBy(rides.createdAt);
    return results[0] as RideWithNames;
  } catch (error) {
    console.error("Error fetching ride:", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ride = await getRide(id);
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
          title="Edit Ride"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Rides", href: "/dashboard/rides" },
            { label: "Edit Ride", href: `/dashboard/rides/${id}/edit` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <RidesEdit ride={ride as Ride} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
