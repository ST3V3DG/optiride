import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getColumns } from "@/app/dashboard/cars/columns";
// import { TriangleAlert } from "lucide-react";
// import { DataTable } from "@/app/dashboard/cars/user-table";
import Loader from "@/components/loader";
import { Car, User, cars, users } from "@/db/schema";
import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";
import { CarWithDriverName } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
import NoData from "@/components/no-data";
import CarsTable from "@/components/cars-table";
import { PageHeader } from "@/components/page-header";

export const dynamicParams = true;
export async function generateStaticParams() {
  const usersCollection: User[] = await db.select().from(users);
  return usersCollection.map((user) => ({
    id: String(user.id),
  }));
}

async function getUser(id: string): Promise<User | null> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)));
    return user[0] as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

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
        number_of_seats: cars.number_of_seats,
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
  const user = await getUser(id);
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
