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
import { type RideWithNames } from "@/lib/types";
// import { authClient } from "@/lib/auth-client";

export const getColumns = (
  setData: React.Dispatch<React.SetStateAction<RideWithNames[]>>
): ColumnDef<RideWithNames>[] => [
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
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Driver
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const driverName = row.original.driver_name;
      return <span>{driverName || "N/A"}</span>;
    },
  },
  {
    accessorKey: "car",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Car
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const car = row.original.car;
      return <span>{car || "N/A"}</span>;
    },
  },
  {
    accessorKey: "place_of_departure",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Place of departure
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cityName = row.original.departure_city;
      return <span>{cityName || "N/A"}</span>;
    },
  },
  {
    accessorKey: "collection_point",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Collection point
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const point = row.getValue("collection_point");
      return <span>{typeof point === "string" ? point : "N/A"}</span>;
    },
  },
  {
    accessorKey: "place_of_arrival",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Place of arrival
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cityName = row.original.arrival_city;
      return <span>{cityName || "N/A"}</span>;
    },
  },
  {
    accessorKey: "drop_off_point",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Drop off point
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const point = row.getValue("drop_off_point");
      return <span>{typeof point === "string" ? point : "N/A"}</span>;
    },
  },
  {
    accessorKey: "hour_of_departure",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hour of departure
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const time = row.getValue("hour_of_departure") as string | null;
      if (!time) return <span>N/A</span>;

      const [hours, minutes] = time.split(":");
      return (
        <span>
          {hours}h {minutes}m
        </span>
      );
    },
  },
  {
    accessorKey: "hour_of_arrival",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hour of arrival
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const time = row.getValue("hour_of_arrival") as string | null;
      if (!time) return <span>N/A</span>;

      const [hours, minutes] = time.split(":");
      return (
        <span>
          {hours}h {minutes}m
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const duration = row.getValue("duration");
      if (!duration) return <span>N/A</span>;

      const durationNum = Number(duration);
      const hours = Math.floor(durationNum / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (durationNum % 60).toString().padStart(2, "0");

      return (
        <span>
          {hours}h {minutes}m
        </span>
      );
    },
  },
  {
    accessorKey: "number_of_seats",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of seats
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const seats = row.getValue("number_of_seats");
      return <span>{seats ? `${seats} seat(s)` : "N/A"}</span>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prices
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as string | null;
      if (!price) return <div className="text-left">N/A</div>;

      const options: Intl.NumberFormatOptions = {
        style: "currency",
        currency: "XAF",
      };
      const formatter = new Intl.NumberFormat("fr-FR", options);

      return (
        <div className="text-left">{formatter.format(parseFloat(price))}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "opened"
        | "completed"
        | "canceled"
        | "full"
        | null;
      if (!status) return <Badge variant="default">N/A</Badge>;

      const variant =
        status === "opened"
          ? "default"
          : status === "full"
          ? "secondary"
          : status === "completed"
          ? "outline"
          : status === "canceled"
          ? "destructive"
          : "default";

      return <Badge variant={variant}>{status}</Badge>;
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

      // const canUpdate = authClient.organization.checkRolePermission({ permissions: { ride: ["update"] } });
      // Admin can edit if they have the permission.
      // Driver or User can edit if they have the permission AND are the owner (via driverId).
      // const showEditButton = canUpdate && (currentUserRole === 'admin' || isOwner);

      // const canDelete = authClient.organization.checkRolePermission({ permissions: { ride: ["delete"] } });
      // Admin can delete if they have the permission.
      // Driver or User can delete if they have the permission AND are the owner (via driverId).
      // const showDeleteButton = canDelete && (currentUserRole === 'admin' || isOwner);

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
          <DropdownMenuContent align="end" className="*:cursor-pointer text-left">
            <DropdownMenuItem asChild>
              <Link className="w-full" href={`/dashboard/rides/${row.original.id}`}>Details</Link>
            </DropdownMenuItem>
            {/* {showEditButton && (
              <DropdownMenuItem asChild>
                <Link className="w-full" href={`/dashboard/rides/${row.original.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
            )} */}
            {/* {showDeleteButton && ( */}
              <DropdownMenuItem onSelect={() => false} className="p-0 focus:bg-transparent">
                <DeleteButton
                  className="w-full font-normal hover:bg-red-500 hover:text-white justify-start px-2 mb-1 py-1.5 h-auto rounded-sm hover:no-underline cursor-pointer"
                  variant="link"
                  collectionName="rides"
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
