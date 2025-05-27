"use client"

import { DataTable } from "@/app/dashboard/rides/data-table";
import { getColumns } from "@/app/dashboard/rides/columns";
import { Card, CardContent } from "@/components/ui/card";
import NoData from "./no-data";
import { useState } from "react";
import { type RideWithNames } from "@/lib/types";

interface RidesTableProps {
  initialRides: RideWithNames[];
}

export default function RidesTable({ initialRides }: RidesTableProps) {
  const [data, setData] = useState<RideWithNames[]>(initialRides);

  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <DataTable
          columns={getColumns(setData)}
          data={data}
        />
      </CardContent>
    </Card>
  );
}
