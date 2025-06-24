"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export default function DeleteButton({
  collectionName,
  id,
  onDelete,
  className,
  variant,
}: {
  collectionName: string;
  id: string;
  onDelete?: (id: string) => void;
  className?: string;
  variant?: "link" | "destructive";
}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["delete"],
    mutationFn: async () => apiClient.delete(`/${collectionName}/${id}`),
  });

  async function handleDelete() {
    try {
      const result = await mutation.mutateAsync();

      if (result) {
        toast("Success!", { description: "Record deleted successfully." });
        if (onDelete) {
          onDelete(id);
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Error during delete action call:", error);
      toast.error("Error!", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <Button
      className={cn("cursor-pointer", className)}
      variant={variant || "destructive"}
      size="sm"
      onClick={handleDelete}>
      Delete
    </Button>
  );
}
