"use server";

import { apiClient } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { revalidatePath } from "next/cache";

export async function deleteItemAction(collectionName: string, id: number) {
  try {
      const mutation = useMutation({
          mutationKey: ['delete'],
          mutationFn: async () => apiClient.delete(`/${collectionName}/${id}`),
      });
      await mutation.mutateAsync();
    revalidatePath("/dashboard/users");
    return { success: "Item deleted successfully." };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error: "Failed to delete item. Please try again." };
  }
}