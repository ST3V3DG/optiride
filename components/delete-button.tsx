"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { deleteItemAction } from "@/server/common"; // Import the server action

export default function DeleteButton({
  collectionName,
  id,
  onDelete,
  className,
  variant,
}: {
  collectionName: string;
  id: number;
  onDelete?: (id: number) => void;
  className?: string;
  variant?: "link" | "destructive";
}) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const result = await deleteItemAction(collectionName, id);

      if (result.error) {
        toast.error("Error!", { description: result.error });
      } else if (result.success) {
        toast("Success!", { description: result.success });
        if (onDelete) {
          onDelete(id);
        }
        router.refresh(); // Refresh the current route to reflect changes
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
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}
