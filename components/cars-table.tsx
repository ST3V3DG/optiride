"use client";

import { DataTable } from "@/app/dashboard/cars/data-table";
import { getColumns } from "@/app/dashboard/cars/columns";
import NoData from "./no-data";
import { useState } from "react";
import { type CarWithDriverName, CarsTableProps } from "@/lib/types";

export default function CarsTable({ initialCars }: CarsTableProps) {
  const [data, setData] = useState<CarWithDriverName[]>(initialCars);

  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <DataTable columns={getColumns(setData)} data={data} />
  );
}
