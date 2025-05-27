"use server";

import { z } from "zod";
import { db } from "@/db/db";
import { users, cars } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const carActionSchema = z.object({
  driverId: z.number(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  comfort: z.enum(["standard", "premium", "luxury"]).optional(),
  registration: z.string().min(1, "Registration is required"),
  number_of_seats: z.coerce.number().min(1, "At least one seat").max(100),
});

type CarComfort = "standard" | "premium" | "luxury";

export async function createCar(formData: z.infer<typeof carActionSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = carActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  const canCreateAnyCar = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { car: ["create"] } } });

  if (!canCreateAnyCar?.granted) {
    // Not an admin, check if driver is creating for themselves
    // @ts-ignore TODO: fix user type from session to include role
    const isDriver = session.user.role === 'driver';
    if (!(isDriver && String(validatedFields.data.driverId) === session.user.id)) {
      return { error: "Forbidden: You do not have permission to create this car." };
    }
  }

  try {
    const carData = {
      driverId: validatedFields.data.driverId,
      brand: validatedFields.data.brand,
      model: validatedFields.data.model,
      year: String(validatedFields.data.year),
      comfort: validatedFields.data.comfort as CarComfort | undefined,
      registration: validatedFields.data.registration,
      number_of_seats: validatedFields.data.number_of_seats,
      createdAt: sql`NOW()`,
      updatedAt: sql`NOW()`,
    };
    await db.insert(cars).values(carData).execute();

    revalidatePath("/dashboard/cars");
    return { success: "Car created successfully." };
  } catch (error) {
    console.error("Error creating car:", error);
    return { error: "Database error: Failed to create car." };
  }
}

export async function updateCar(carId: number, formData: z.infer<typeof carActionSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = carActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  const canUpdateAnyCar = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { car: ["update"] } } });

  if (!canUpdateAnyCar?.granted) {
    // Not an admin, check if driver is updating their own car
    const carToUpdateResult = await db.select().from(cars).where(eq(cars.id, carId)).limit(1);
    if (!carToUpdateResult[0]) {
      return { error: "Car not found." };
    }
    const carToUpdate = carToUpdateResult[0];

    // @ts-ignore TODO: fix user type from session to include role
    const isDriver = session.user.role === 'driver';
    if (!(isDriver && 
          String(carToUpdate.driverId) === session.user.id && 
          String(validatedFields.data.driverId) === session.user.id)) {
      return { error: "Forbidden: You do not have permission to update this car or change its driver." };
    }
  }

  try {
    const updateData = {
      driverId: validatedFields.data.driverId,
      brand: validatedFields.data.brand,
      model: validatedFields.data.model,
      year: String(validatedFields.data.year),
      comfort: validatedFields.data.comfort as CarComfort | undefined,
      registration: validatedFields.data.registration,
      number_of_seats: validatedFields.data.number_of_seats,
      updatedAt: sql`NOW()`
    };

    await db.update(cars)
      .set(updateData)
      .where(eq(cars.id, carId))
      .execute();

    revalidatePath("/dashboard/cars");
    revalidatePath(`/dashboard/cars/${carId}`);
    return { success: "Car updated successfully." };
  } catch (error) {
    console.error("Error updating car:", error);
    return { error: "Database error: Failed to update car." };
  }
}

export async function getDriversAction() {
  try {
    const driverUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'driver'))
      .orderBy(users.createdAt);
    return { success: true, data: driverUsers };
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return { success: false, error: "Database error: Failed to fetch drivers." };
  }
}

export async function getCarsAction() {
  try {
    const carData = await db
      .select()
      .from(cars)
      .orderBy(cars.createdAt);
    return { success: true, data: carData };
  } catch (error) {
    console.error("Error fetching cars:", error);
    return { success: false, error: "Database error: Failed to fetch cars." };
  }
}

export async function deleteCar(carId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const canDeleteAnyCar = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { car: ["delete"] } } });

  if (!canDeleteAnyCar?.granted) {
    // Not an admin, check if driver is deleting their own car
    const carToDeleteResult = await db.select().from(cars).where(eq(cars.id, carId)).limit(1);
    if (!carToDeleteResult[0]) {
      return { error: "Car not found." };
    }
    const carToDelete = carToDeleteResult[0];
    // @ts-ignore TODO: fix user type from session to include role
    const isDriver = session.user.role === 'driver';
    if (!(isDriver && String(carToDelete.driverId) === session.user.id)) {
      return { error: "Forbidden: You do not have permission to delete this car." };
    }
  }

  try {
    await db.delete(cars).where(eq(cars.id, carId)).execute();
    revalidatePath("/dashboard/cars");
    return { success: "Car deleted successfully." };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { error: "Database error: Failed to delete car." };
  }
}
