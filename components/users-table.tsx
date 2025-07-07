"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/dashboard/users/data-table";
import { getColumns } from "@/app/dashboard/users/columns";
import NoData from "./no-data";
import { User } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import Loader from "./loader";

export default function UserTable() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get("/users"),
  });
  const [ data, setData ] = useState<User[]>([]);
  
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
