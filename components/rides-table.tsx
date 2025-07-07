"use client";

import { DataTable } from "@/app/dashboard/rides/data-table";
import { getColumns } from "@/app/dashboard/rides/columns";
import { Card, CardContent } from "@/components/ui/card";
import NoData from "./no-data";
import { useEffect, useState } from "react";
import { type Ride } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import Loader from "./loader";

export default function RidesTable() {
  const ridesQuery = useQuery({
    queryKey: ["rides"],
    queryFn: () => apiClient.get("/rides"),
  });

  const [data, setData] = useState<Ride[]>([]);

  useEffect(() => {
    if (ridesQuery.isSuccess) setData(ridesQuery.data?.data?.data || []);
  }, [ridesQuery.data?.data?.data, ridesQuery.isSuccess]);

  if (ridesQuery.isError) {
    return <NoData />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        {ridesQuery.isPending ? (
          <Loader />
        ) : (
          <DataTable columns={getColumns(setData)} data={data} />
        )}
      </CardContent>
    </Card>
  );
}
