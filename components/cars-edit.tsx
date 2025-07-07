"use client";

import CarsForm from "@/components/cars-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import Loader from "./loader";

export default function CarsEdit({ id }: { id: string }) {
  const query = useQuery({
    queryKey: [ "car" ],
    queryFn: () => apiClient.get(`cars/${id}`),
  })
  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col gap-4 justify-center items-stretch">
      <Card className="max-w-[500px] w-full self-center">
        <CardHeader>
          <CardTitle>Edit a car</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {query.isPending ? <Loader /> : <CarsForm data={query.data?.data.data} operation="update" />}
        </CardContent>
      </Card>
      <DangerZone id={String(query.data?.data.data.id)} collectionName="cars" />
    </div>
  );
}
