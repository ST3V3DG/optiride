"use server";

import { z } from "zod";
import { db } from "@/db/db";
import { rides, users, cities, cars } from "@/db/schema";
import { and, eq, getTableColumns, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { RideWithNames } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const rideActionSchema = z.object({
    driverId: z.number(),
    place_of_departure: z.coerce.number(),
    place_of_arrival: z.coerce.number(),
    collection_point: z.string(),
    drop_off_point: z.string(),
    hour_of_departure: z.string(),
    hour_of_arrival: z.string(),
    duration: z.coerce.number(),
    available_seats: z.coerce.number(),
    price: z.coerce.number(),
    carId: z.coerce.number(),
    date: z.date().optional().default(new Date())
});

export async function createRide(formData: z.infer<typeof rideActionSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validatedFields = rideActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  const canCreateAnyRide = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { ride: ["create"] } } });

  if (!canCreateAnyRide?.success) {
    const userRoles = session.user.role;
    const userId = String(session.user.id); // Ensure userId is a string for comparisons

    if (userRoles === 'driver' && String(validatedFields.data.driverId) === userId) {
      // Driver creating for themselves, proceed
    } else if (userRoles === 'user') {
      // For 'user' role, permission 'ride: ["create"]' is already checked by canCreateAnyRide.
      // If not success, they shouldn't be here. If it was success, it means users can create rides.
      // The existing logic assigns their ID to driverId. This is maintained as per instructions.
      // We need to ensure the initial 'ride: ["create"]' permission in lib/permissions.ts for 'user' role is what allows this.
      // If canCreateAnyRide was false, it means the 'user' role does not have general 'ride: ["create"]'.
      // This part of the logic might be redundant if permissions are set up correctly,
      // as 'user' would either pass canCreateAnyRide or not.
      // However, to stick to the "if not general, then specific" pattern:
      // We re-check if the user has specific permission to create (which should be true if they got here and are 'user')
      const canUserCreateRide = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { ride: ["create"] } } });
      if (!canUserCreateRide?.success) {
         return { success: false, error: "Forbidden: You do not have permission to create this ride (user specific check)." };
      }
      // For 'user' role, ensure driverId is their own ID.
      validatedFields.data.driverId = Number(userId); // This assigns client's ID to driverId
    } else {
      // Neither admin, nor driver creating for self, nor specific user permission.
      return { success: false, error: "Forbidden: You do not have permission to create this ride." };
    }
  }

  try {
    const rideData = {
      // Ensure driverId is correctly set from validatedFields, especially if modified for 'user' role.
      driverId: validatedFields.data.driverId, 
      place_of_departure: validatedFields.data.place_of_departure,
      place_of_arrival: validatedFields.data.place_of_arrival,
      collection_point: validatedFields.data.collection_point,
      drop_off_point: validatedFields.data.drop_off_point,
      hour_of_departure: validatedFields.data.hour_of_departure,
      hour_of_arrival: validatedFields.data.hour_of_arrival,
      duration: validatedFields.data.duration,
      price: validatedFields.data.price.toFixed(2),
      available_seats: validatedFields.data.available_seats,
      carId: validatedFields.data.carId,
      status: "opened" as const,
      date: validatedFields.data.date
    };

    // const result = await db.insert(rides).values(rideData).execute();

    revalidatePath("/dashboard/rides");
    return { success: "Ride created successfully." };
  } catch (error) {
    console.error("Error creating ride:", error);
    return { success: false, error: "Database error: Failed to create ride." };
  }
}

export async function updateRide(rideId: number, formData: z.infer<typeof rideActionSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const validatedFields = rideActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  const canUpdateAnyRide = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { ride: ["update"] } } });

  if (!canUpdateAnyRide?.success) {
    const rideToUpdateResult = await db.select().from(rides).where(eq(rides.id, rideId)).limit(1);
    if (!rideToUpdateResult[0]) {
      return { success: false, error: "Ride not found." };
    }
    const rideToUpdate = rideToUpdateResult[0];

    const userRoles = session.user.role;
    const userId = String(session.user.id); // Ensure userId is a string

    if (userRoles === 'driver' &&
        String(rideToUpdate.driverId) === userId &&
        String(validatedFields.data.driverId) === userId) {
      // Driver updating their own ride, and not changing the driverId to someone else.
    } else if (userRoles === 'user' && String(rideToUpdate.driverId) === userId) {
      // User updating a ride they "own" via driverId.
      // General 'ride: ["update"]' permission for 'user' role should allow this.
      // This specific check ensures they can only update 'their' rides (where their ID is in driverId).
      const canUserUpdateRide = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { ride: ["update"] } } });
      if (!canUserUpdateRide?.success) {
        return { success: false, error: "Forbidden: You do not have permission to update this ride (user specific check)." };
      }
      // Ensure 'user' role cannot change the driverId to someone else. It must remain their own.
      validatedFields.data.driverId = Number(userId); // This re-affirms client's ID to driverId
    } else {
      return { success: false, error: "Forbidden: You do not have permission to update this ride (general)." };
    }
  }

  try {
    const updateData = {
      // Ensure driverId is correctly set from validatedFields, especially if modified for 'user' role.
      driverId: validatedFields.data.driverId, 
      place_of_departure: validatedFields.data.place_of_departure,
      place_of_arrival: validatedFields.data.place_of_arrival,
      collection_point: validatedFields.data.collection_point,
      drop_off_point: validatedFields.data.drop_off_point,
      hour_of_departure: validatedFields.data.hour_of_departure,
      hour_of_arrival: validatedFields.data.hour_of_arrival,
      duration: validatedFields.data.duration,
      price: validatedFields.data.price.toFixed(2),
      available_seats: validatedFields.data.available_seats,
      carId: validatedFields.data.carId,
      date: validatedFields.data.date,
      updatedAt: sql`NOW()`
    };

    await db.update(rides)
      .set(updateData)
      .where(eq(rides.id, rideId))
      .execute();

    revalidatePath("/dashboard/rides");
    revalidatePath(`/dashboard/rides/${rideId}`);
    return { success: "Ride updated successfully." };
  } catch (error) {
    console.error("Error updating ride:", error);
    return { success: false, error: "Database error: Failed to update ride." };
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

export async function getCitiesAction() {
  try {
    const cityData = await db
      .select()
      .from(cities)
      .orderBy(cities.createdAt);
    return { success: true, data: cityData };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { success: false, error: "Database error: Failed to fetch cities." };
  }
}

export async function getRidesAction() {
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

    return {success: true, data: results as RideWithNames[]};
  } catch (error) {
    console.error("Error fetching rides:", error);
    return {success: false, error: "Database error: Failed to fetch rides."};
  }
}

export async function getFilteredRides(departure: string | null, arrival: string | null, date: Date | null, seats: number | null) {

  try {
  const conditions = [];

  if (departure && !isNaN(Number(departure))) {
    conditions.push(eq(rides.place_of_departure, Number(departure)));
  }

  if (arrival && !isNaN(Number(arrival))) {
    conditions.push(eq(rides.place_of_arrival, Number(arrival)));
  }

  if (date) {
    conditions.push(eq(rides.date, new Date(date)));
  }

  if (seats && !isNaN(Number(seats))) {
    conditions.push(gte(rides.available_seats, Number(seats)));
  }

  const result = await db
    .select(
      {
        ...getTableColumns(rides),
        departure_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_departure})`,
        arrival_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_arrival})`,
        car: cars.model,
        driver_name: users.name,
        driver_image: users.image,
      }
    )
    .from(rides)
    .leftJoin(users, eq(rides.driverId, users.id))
    .leftJoin(cars, eq(rides.carId, cars.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined);
    
  return {success: true, data: result};
  } catch (error) {
    console.error("Error fetching filtered rides:", error);
    return {success: false, error: "Database error: Failed to fetch filtered rides."};
  }
}

export async function getRideAction(id:string) {
  try {
    const ride = await db
      .select({
        ...getTableColumns(rides),
        departure_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_departure})`,
        arrival_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_arrival})`,
        car: cars.model,
        driver_name: users.name,
        driver_image: users.image,
      })
      .from(rides)
      .leftJoin(users, eq(rides.driverId, users.id))
      .leftJoin(cars, eq(rides.carId, cars.id))
      .where(eq(rides.id, Number(id)));
    return {success: true, data: ride};
  } catch (error) {
    console.error("Error fetching ride:", error);
    return {success: false, error: "Database error: Failed to fetch ride."};
  }
}

export async function deleteRide(rideId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const canDeleteAnyRide = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { ride: ["delete"] } } });

  if (!canDeleteAnyRide?.success) {
    const rideToDeleteResult = await db.select().from(rides).where(eq(rides.id, rideId)).limit(1);
    if (!rideToDeleteResult[0]) {
      return { success: false, error: "Ride not found." };
    }
    const rideToDelete = rideToDeleteResult[0];

    const userRoles = session.user.role;
    const userId = String(session.user.id); // Ensure userId is a string

    if (userRoles === 'driver' && String(rideToDelete.driverId) === userId) {
      // Driver deleting their own ride
    } else if (userRoles === 'user' && String(rideToDelete.driverId) === userId) {
      // User deleting a ride they "own" via driverId.
      // General 'ride: ["delete"]' permission for 'user' role should allow this.
      const canUserDeleteRide = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { ride: ["delete"] } } });
      if (!canUserDeleteRide?.success) {
         return { success: false, error: "Forbidden: You do not have permission to delete this ride (user specific check)." };
      }
    } else {
      return { success: false, error: "Forbidden: You do not have permission to delete this ride (general)." };
    }
  }

  try {
    await db.delete(rides).where(eq(rides.id, rideId)).execute();
    revalidatePath("/dashboard/rides");
    return { success: true, message: "Ride deleted successfully." };
  } catch (error) {
    console.error("Error deleting ride:", error);
    return { success: false, error: "Database error: Failed to delete ride." };
  }
}
