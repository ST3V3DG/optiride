"use server";

import { z } from "zod";
import { db } from "@/db/db";
import { rides, users, cities, cars } from "@/db/schema";
import { and, eq, getTableColumns, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { RideWithNames } from "../lib/types";

const rideActionSchema = z.object({
    driverId: z.number(),
    place_of_departure: z.coerce.number(),
    place_of_arrival: z.coerce.number(),
    collection_point: z.string(),
    drop_off_point: z.string(),
    hour_of_departure: z.string(),
    hour_of_arrival: z.string(),
    duration: z.coerce.number(),
    number_of_seats: z.coerce.number(),
    price: z.coerce.number(),
    carId: z.coerce.number(),
    date: z.date().optional().default(new Date())
});

export async function createRide(formData: z.infer<typeof rideActionSchema>) {
  // Validate input
  const validatedFields = rideActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  try {
    const rideData = {
      driverId: validatedFields.data.driverId,
      place_of_departure: validatedFields.data.place_of_departure,
      place_of_arrival: validatedFields.data.place_of_arrival,
      collection_point: validatedFields.data.collection_point,
      drop_off_point: validatedFields.data.drop_off_point,
      hour_of_departure: validatedFields.data.hour_of_departure,
      hour_of_arrival: validatedFields.data.hour_of_arrival,
      duration: validatedFields.data.duration,
      price: validatedFields.data.price.toFixed(2),
      number_of_seats: validatedFields.data.number_of_seats,
      carId: validatedFields.data.carId,
      status: "opened" as const,
      date: validatedFields.data.date
    };

    const result = await db.insert(rides).values(rideData).execute();

    revalidatePath("/dashboard/rides");
    return { success: "Ride created successfully." };
  } catch (error) {
    console.error("Error creating ride:", error);
    return { success: false, error: "Database error: Failed to create ride." };
  }
}

export async function updateRide(rideId: number, formData: z.infer<typeof rideActionSchema>) {
  const validatedFields = rideActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  try {
    const updateData = {
      driverId: validatedFields.data.driverId,
      place_of_departure: validatedFields.data.place_of_departure,
      place_of_arrival: validatedFields.data.place_of_arrival,
      collection_point: validatedFields.data.collection_point,
      drop_off_point: validatedFields.data.drop_off_point,
      hour_of_departure: validatedFields.data.hour_of_departure,
      hour_of_arrival: validatedFields.data.hour_of_arrival,
      duration: validatedFields.data.duration,
      price: validatedFields.data.price.toFixed(2),
      number_of_seats: validatedFields.data.number_of_seats,
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
    conditions.push(gte(rides.number_of_seats, Number(seats)));
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
