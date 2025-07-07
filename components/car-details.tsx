"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import Loader from "./loader";
import NoData from "./no-data";

export default function CarDetails({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["car"],
    queryFn: () => apiClient.get(`cars/${id}`),
  });

  if (query.isError) {
    return <NoData />;
  }

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      <Card className="w-full max-w-[500px] m-auto">
        <CardHeader>
          <CardTitle>Car Information</CardTitle>
        </CardHeader>
        <Separator />
        {query.isPending ? (
          <Loader />
        ) : (
          <CardContent>
            <ul className="flex flex-col gap-4 justify-between pt-4">
              <li>
                <span className="mr-2 font-medium">Driver:</span>
                <span className="capitalize">
                  {query.data?.data.data.driver.name || "N/A"}
                </span>
              </li>
              <li>
                <span className="mr-2 font-medium">Brand:</span>
                <span className="capitalize">
                  {query.data?.data.data.brand || "N/A"}
                </span>
              </li>
              <li>
                <span className="mr-2 font-medium">Model:</span>
                <span className="capitalize">
                  {query.data?.data.data.model || "N/A"}
                </span>
              </li>
              <li>
                <span className="mr-2 font-medium">Year:</span>
                <span className="capitalize">
                  {query.data?.data.data.year || "N/A"}
                </span>
              </li>
              <li>
                <span className="mr-2 font-medium">Comfort:</span>
                <span className="capitalize">
                  {query.data?.data.data.comfort || "N/A"}
                </span>
              </li>
              <li>
                <span className="mr-2 font-medium">Registration:</span>
                <span className="uppercase">
                  {query.data?.data.data.registration || "N/A"}
                </span>
              </li>
              <li>
                <span className="mr-2 font-medium">Number of seats:</span>
                <span className="capitalize">
                  {query.data?.data.data.available_seats || "N/A"}
                </span>
              </li>
            </ul>
          </CardContent>
        )}
      </Card>
      <DangerZone id={String(query.data?.data.data.id)} collectionName="cars" />
    </div>
  );
}
