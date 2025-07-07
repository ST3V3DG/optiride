"use client";

import RidesForm from "@/components/rides-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import Loader from "./loader";

export default function RidesEdit({ id }: { id: string; }) {
  const query = useQuery({
    queryKey: [ "ride" ],
    queryFn: () => apiClient.get(`rides/${id}`),
  })
  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col gap-4 place-content-center items-stretch">
      <Card className="max-w-[500px] w-full self-center">
        <CardHeader>
          <CardTitle>Edit a ride</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {query.isPending ? <Loader /> : <RidesForm data={query.data?.data.data} operation="update" />}
        </CardContent>
      </Card>
      <DangerZone id={query.data?.data.data.id} collectionName="rides" />
    </div>
  );
}
