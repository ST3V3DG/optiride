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
import NoData from "@/components/no-data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const rows = await db.select({ id: cars.id }).from(cars);
  return rows.map((row) => ({
    id: String(row.id),
  }));
}

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

  // const canUpdateCar = await auth.api.hasPermission({
  //   headers: await headers(),
  //   body: { permissions: { car: ["update"] } },
  // });

  // if (canUpdateCar?.success) {
  //   if (session?.user?.role === 'driver' && String(car.driverId) !== session?.user.id) {
  //     redirect('/dashboard/cars');
  //   } else if (session?.user?.role === 'user') {
  //     redirect('/dashboard/cars');
  //   }
  // } else {
  //   redirect('/dashboard/cars');
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
            { label: `Edit Car #${car?.id}`, href: `/dashboard/cars/${car?.id}` },
            { label: "Edit", href: `/dashboard/cars/${id}/edit` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {car ? <CarsEdit car={car} /> : <NoData />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
