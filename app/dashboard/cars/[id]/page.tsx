import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { db } from "@/db/db";
import { cars } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { PageHeader } from "@/components/page-header";
import { users } from "@/db/schema";
import CarDetails from "@/components/car-details";
import { CarWithDriverName } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
<<<<<<< HEAD
import { toast } from "sonner";
=======
>>>>>>> fix-build-errors

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
      .orderBy(cars.createdAt);
    return results[0] as CarWithDriverName;
  } catch (error) {
    console.error("Error fetching car:", error);
    toast.error("Error !", {
      description: "Oops ! Something went wrong.",
    });
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

<<<<<<< HEAD
  // const canReadCar = await auth.api.hasPermission({
  //   headers: await headers(),
  //   body: { permissions: { car: ["read"] } },
  // });

  // if (canReadCar?.success) {
    // Admin or User (client) with general 'read' permission can view.
    // If user is a driver, they must own the car to view its details page (unless they are admin).
    // const isDriver = session?.user?.role === "driver";
    // const isAdmin = session?.user?.role === "admin";
    // const isCarOwner = String(car?.driverId) === session?.user?.id;

    // if (isDriver && !isCarOwner && !isAdmin) {
    //   redirect("/dashboard/cars"); // Forbidden, not their car and not admin
    // }
  // } else {
  //   // No general 'read' permission
  //   redirect("/dashboard/cars"); // Forbidden
=======
  // const canReadCar = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { car: ["read"] } } });

  // if (canReadCar?.success) {
  //   // Admin or User (client) with general 'read' permission can view.
  //   // If user is a driver, they must own the car to view its details page (unless they are admin).
  //   if (
  //     session.user?.role === 'driver' &&
  //     String(car?.driverId) !== session.user.id
  //   ) {
  //     // If car is null here because it wasn't found, car?.driverId will be undefined, which is fine.
  //     redirect('/dashboard/cars'); // Forbidden, not their car
  //   }
  // } else {
  //   // No general 'read' permission
  //   redirect('/dashboard/cars'); // Forbidden
>>>>>>> fix-build-errors
  // }

  return (
    <SidebarProvider>
      <AppSidebar user={userProps} />
      <SidebarInset>
        <PageHeader
          title="Car details"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Cars", href: "/dashboard/cars" },
            { label: "Car details", href: `/dashboard/cars/${id}` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {car && <CarDetails car={car} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
