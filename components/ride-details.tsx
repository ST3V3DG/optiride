"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import NoData from "./no-data";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { convertirHeureEnDate } from "@/lib/helpers";

export default function RideDetails({ id }: { id: string; }) {
  
    const query = useQuery({
      queryKey: ["ride"],
      queryFn: () => apiClient.get(`rides/${id}`),
    });

  if (query.isError) {
    return <NoData />;
  }

  const arrivalTime = query.data?.data?.data.hour_of_arrival
    ? convertirHeureEnDate(query.data?.data?.data.hour_of_arrival)
    : new Date();
  const arrivalHour = String(arrivalTime.getHours()).padStart(2, "0");
  const arrivalMinute = String(arrivalTime.getMinutes()).padStart(2, "0");

  const departureTime = query.data?.data?.data.hour_of_departure
    ? convertirHeureEnDate(query.data?.data?.data.hour_of_departure)
    : new Date();
  const departureHour = String(departureTime.getHours()).padStart(2, "0");
  const departureMinute = String(departureTime.getMinutes()).padStart(2, "0");

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      <Card className="w-full max-w-[500px] m-auto">
        <CardHeader>
          <CardTitle>Ride information</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <ul className="flex flex-col gap-4 justify-between">
            <li>
              <span className="mr-2 font-medium">Driver:</span>
              <span className="capitalize">{query.data?.data?.data.driver.name || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Date:</span>
              {query.data?.data?.data.date
                ? new Date(query.data?.data?.data.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </li>
            <li>
              <span className="mr-2 font-medium">Departure:</span>
              <span className="capitalize">{query.data?.data?.data.place_of_departure.name || "N/A"}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({query.data?.data?.data.collection_point || "N/A"})
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Arrival:</span>
              <span className="capitalize">{query.data?.data?.data.place_of_arrival.name || "N/A"}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({query.data?.data?.data.drop_off_point || "N/A"})
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Hour of departure:</span>
              <span className="capitalize">
                {query.data?.data?.data.hour_of_departure
                  ? `${departureHour}h ${departureMinute}m`
                  : "N/A"}
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Hour of arrival:</span>
              <span className="capitalize">
                {query.data?.data?.data.hour_of_arrival
                  ? `${arrivalHour}h ${arrivalMinute}m`
                  : "N/A"}
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Duration:</span>
              {query.data?.data?.data.duration ? (
                <span className="capitalize">
                  {String(Math.floor(query.data?.data?.data.duration / 60)).padStart(2, "0")}h
                  {String(query.data?.data?.data.duration % 60).padStart(2, "0")}m
                </span>
              ) : (
                "N/A"
              )}
            </li>
            <li>
              <span className="mr-2 font-medium">Price:</span>
              <span className="capitalize">{query.data?.data?.data.price || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Available seats:</span>
              <span className="capitalize">
                {query.data?.data?.data.available_seats || "N/A"}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <DangerZone id={String(query.data?.data?.data.id)} collectionName="rides" />
    </div>
  );
}
