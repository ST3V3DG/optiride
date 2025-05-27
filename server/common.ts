"use server";

import { db } from "@/db/db";
import { users, rides, cars, cities as citiesSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteItemAction(collectionName: string, id: number) {
  try {
    let schemaTable;
    switch (collectionName) {
      case "users":
        schemaTable = users;
        break;
      case "rides":
        schemaTable = rides;
        break;
      case "cities":
        schemaTable = citiesSchema;
        break;
      case "cars":
        schemaTable = cars;
        break;
      default:
        return { error: `Invalid collection name: ${collectionName}` };
    }

    if (!schemaTable || !('id' in schemaTable)) {
        return { error: `Schema or id column not found for collection: ${collectionName}` };
    }

    await db.delete(schemaTable).where(eq(schemaTable.id, id));
    revalidatePath("/");
    return { success: "Item deleted successfully." };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error: "Failed to delete item. Please try again." };
  }
}