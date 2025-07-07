"use client";

import { DataTable } from "@/app/dashboard/cars/data-table";
import { getColumns } from "@/app/dashboard/cars/columns";
import NoData from "./no-data";
import { useEffect, useState } from "react";
import { Car } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { Card, CardContent } from "./ui/card";
import Loader from "./loader";

export default function CarsTable({id}: {id?: string}) {
  const query = useQuery({
    queryKey: ["cars"],
    queryFn: () => apiClient.get("/cars", {params: {driver_id: id}}),
  });

  const [data, setData] = useState<Car[]>([]);

  useEffect(() => {
    if (query.isSuccess) setData(query.data?.data?.data || []);
  }, [query.data?.data?.data, query.isSuccess]);

  if (query.isError) {
    return <NoData />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        {query.isPending ? (
          <Loader />
        ) : (
          <DataTable columns={getColumns(setData)} data={data} />
        )}
      </CardContent>
    </Card>
  );
}
