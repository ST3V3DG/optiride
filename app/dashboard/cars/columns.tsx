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
import { CarWithDriverName } from "@/lib/types";
// import { authClient } from "@/lib/auth-client";
// Assuming better-auth provides useSession through authClient
// If it's from "next-auth/react", that would be: import { useSession } from "next-auth/react";

export const getColumns = (
  setData: React.Dispatch<React.SetStateAction<CarWithDriverName[]>>
): ColumnDef<CarWithDriverName>[] => [
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
  },
  {
    accessorKey: "driver_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Driver
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.driver_name}</span>;
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Brand name
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.brand}</span>;
    },
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.model}</span>;
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.year}</span>;
    },
  },
  {
    accessorKey: "registration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.registration}</span>;
    },
  },
  {
    accessorKey: "available_seats",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Available seats
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.available_seats + " seat(s)"}</span>;
    },
  },
  {
    accessorKey: "comfort",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Comfort
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const comfort = row.original.comfort as
        | "standard"
        | "premium"
        | "luxury"
        | null;
      if (!comfort) return <Badge variant="default">N/A</Badge>;

      const variant =
        comfort === "standard"
          ? "default"
          : comfort === "premium"
          ? "secondary"
          : comfort === "luxury"
          ? "outline"
          : "default";

      return <Badge variant={variant}>{comfort}</Badge>;
    },
  },
  {
    header: () => <div className="text-left">Action</div>,
    id: "actions",
    cell: ({ row }) => {
      // const { data: session } = authClient.useSession(); 
      // Note: Adjust session.user.id and session.user.role if better-auth nests these differently
      // e.g., session.user.databaseId or session.user.activeOrganizationRole
      // const currentUserId = session?.user?.id; 
      // const currentUserRole = session?.user?.role; 

      // const isOwner = String(row.original.driverId) === String(currentUserId);

      // Check general permission for the action first
      // const canUpdate = authClient.organization.checkRolePermission({ permissions: { car: ["update"] } });
      // const canDelete = authClient.organization.checkRolePermission({ permissions: { car: ["delete"] } });

<<<<<<< HEAD
      // Determine if the edit/delete button should be shown
      // Admin can edit/delete if they have the permission.
      // Driver can edit/delete if they have the permission AND are the owner.
=======
      // // Determine if the edit/delete button should be shown
      // // Admin can edit/delete if they have the permission.
      // // Driver can edit/delete if they have the permission AND are the owner.
>>>>>>> fix-build-errors
      // const showEditButton = canUpdate && (currentUserRole === 'admin' || (currentUserRole === 'driver' && isOwner));
      // const showDeleteButton = canDelete && (currentUserRole === 'admin' || (currentUserRole === 'driver' && isOwner));

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="size-8 p-0 hover:cursor-pointer"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="*:hover:cursor-pointer">
            <DropdownMenuItem asChild>
              <Link
                className="w-full"
                href={`/dashboard/cars/${row.original.id}`}
              >
                Details
              </Link>
            </DropdownMenuItem>
            {/* {showEditButton && ( */}
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/dashboard/cars/${row.original.id}/edit`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
<<<<<<< HEAD
            {/* )} */}
            {/* {showDeleteButton && ( */}
=======
            {/* )}
            {showDeleteButton && ( */}
>>>>>>> fix-build-errors
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="p-0 focus:bg-transparent"
              >
                <DeleteButton
                  className="w-full font-normal hover:bg-red-500 hover:text-white justify-start px-2 mb-1 py-1.5 h-auto rounded-sm hover:no-underline cursor-pointer"
                  variant="link"
                  collectionName="cars"
                  id={Number(row.original.id)}
                  onDelete={(id) => {
                    setData((prevData) =>
                      prevData.filter((item) => item.id !== id)
                    );
                  }}
                />
              </DropdownMenuItem>
            {/* )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
