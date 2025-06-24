// "use server"

// import { db } from "@/db/db";
// import { cities } from "@/db/schema";
// import { eq, getTableColumns } from "drizzle-orm";

// export async function getCityAction(id: string) {
//   try {
//     const cityData = await db
//       .select({
//         ...getTableColumns(cities),
//       })
//       .from(cities)
//       .where(eq(cities.id, Number(id)));
//     return { success: true, data: cityData };
//   } catch (error) {
//     console.error("Error fetching city:", error);
//     return { success: false, error: "Database error: Failed to fetch city." };
//   }
// }

// export async function getCitiesAction() {
//   try {
//     const cityData = await db
//       .select()
//       .from(cities)
//       .orderBy(cities.createdAt);
//     return { success: true, data: cityData };
//   } catch (error) {
//     console.error("Error fetching cities:", error);
//     return { success: false, error: "Database error: Failed to fetch cities." };
//   }
// }