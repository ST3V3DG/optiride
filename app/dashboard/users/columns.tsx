"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteButton from "@/components/delete-button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import React from "react";
import { User } from "@/db/schema";
import { toggleProfileValidation } from "@/server/users";

// Props pour la fonction validate
type ValidateProps = {
  id: number;
  validated: boolean;
  setData: React.Dispatch<React.SetStateAction<User[]>>;
};

async function validate({ id, validated, setData }: ValidateProps) {
  const optimisticNewState = !validated;
  const originalState = validated;

  try {
    const response = await toggleProfileValidation(
      String(id),
      optimisticNewState
    );

    if (response.success) {
      // --- Mise à jour optimiste de l'UI ---
      setData((prevData) =>
        prevData.map((user) =>
          user.id === String(id)
            ? { ...user, validated: optimisticNewState }
            : user
        )
      );

      // --- Gestion du succès ---
      toast("Success!", {
        description: `User validation status updated successfully.`,
      });
    }

    if (response.error) {
      // --- Gestion d'erreur' ---
      toast("Error!", {
        description:
          response.error ||
          "An unexpected error occurred while updating validation status.",
      });
    }

    // La mise à jour optimiste a déjà géré le changement de l'UI.
  } catch (error: any) {
    console.error("Error updating validation status:", error);
    toast("Error!", {
      description:
        error.message ||
        "An unexpected error occurred while updating validation status.",
    });

    // --- Rollback de la mise à jour optimiste en cas d'erreur ---
    setData((prevData) =>
      prevData.map(
        (user) =>
          user.id === String(id) ? { ...user, validated: originalState } : user // Revenir à l'état original
      )
    );
  }
}

// --- Transformer 'columns' en une fonction qui accepte setData ---
export const getColumns = (
  setData: React.Dispatch<React.SetStateAction<User[]>>
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        style={{ transform: "translateY(-5px)" }}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Phone
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"];
      let variant: "default" | "secondary" | "outline" = "default";
      switch (role) {
        case "client":
          variant = "default";
          break;
        case "driver":
          variant = "outline";
          break;
        case "admin":
          variant = "secondary";
          break;
      }
      return (
        <Badge variant={variant} className="capitalize">
          {role}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "validated",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Validated
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("validated") ? "default" : "outline"}>
        {row.getValue("validated") ? "Yes" : "No"}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-left">Action</div>,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-8 h-8 p-0 hover:cursor-pointer"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="*:cursor-pointer text-left"
          >
            <DropdownMenuItem asChild>
              <Link
                className="w-full no-underline place-content-start"
                href={`/dashboard/users/${user.id}`}
              >
                Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className="w-full no-underline place-content-start"
                href={`/dashboard/users/${user.id}/edit`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0 focus:bg-transparent"
            >
              <DeleteButton
                className="w-full font-normal hover:bg-red-500 hover:text-white justify-start px-2 mb-1 py-1.5 h-auto rounded-sm hover:no-underline cursor-pointer"
                variant="link"
                collectionName="users"
                id={Number(user.id)}
                onDelete={(id) => {
                  setData((prevData) =>
                    prevData.filter((item) => item.id !== String(id))
                  );
                }}
              />
            </DropdownMenuItem>
            <Separator />
            {/* --- Appeler validate avec le vrai setData --- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0 focus:bg-transparent"
            >
              <Button
                variant="ghost"
                className="w-full font-normal justify-start mt-1 px-2 py-1.5 h-auto rounded-sm text-foreground cursor-pointer"
                onClick={() => {
                  if (user.id !== null) {
                    // S'assurer que l'ID n'est pas null
                    validate({
                      id: Number(user.id),
                      validated: Boolean(user.validated),
                      setData: setData, // Passer la fonction setData reçue par getColumns
                    });
                  }
                }}
              >
                {user.validated ? "Invalidated" : "Validated"}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
