import Header from "@/components/header";
import Footer from "@/components/footer";
import { db } from "@/db/db";
import { rides, users, cities } from "@/db/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { RideWithNames } from "@/lib/types";
import RidesClient from "./rides-client";

// This function runs only on the server
async function getRides(): Promise<RideWithNames[]> {
  try {
    const results = await db
      .select({
        ...getTableColumns(rides),
        driver_name: users.name,
        departure_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_departure})`,
        arrival_city: sql<string>`(SELECT name FROM ${cities} WHERE id = ${rides.place_of_arrival})`,
      })
      .from(rides)
      .leftJoin(users, eq(rides.driverId, users.id))
      .orderBy(rides.createdAt);

    return results as RideWithNames[];
  } catch (error) {
    console.error("Error fetching rides:", error);
    return [];
  }
}

export default async function Page() {
  const initialRides = await getRides();

  return (
    <>
      <Header />
      <main className="flex-1">
        <RidesClient initialRides={initialRides} />
      </main>
      <Footer />
    </>
  );
}
