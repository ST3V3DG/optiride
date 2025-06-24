import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import NoData from "./no-data";
import { RideWithNames } from "@/lib/types";
import { convertirHeureEnDate } from "@/lib/helpers";

export default function RideDetails( { ride }: { ride: RideWithNames } ) {

  if (!ride) {
    return <NoData />;
  }

  const arrivalTime = ride.hour_of_arrival
    ? convertirHeureEnDate(ride.hour_of_arrival)
    : new Date();
  const arrivalHour = String(arrivalTime.getHours()).padStart(2, "0");
  const arrivalMinute = String(arrivalTime.getMinutes()).padStart(2, "0");

  const departureTime = ride.hour_of_departure
    ? convertirHeureEnDate(ride.hour_of_departure)
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
              <span className="capitalize">{ride.driver_name || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Date:</span>
              {ride.date
                ? new Date(ride.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </li>
            <li>
              <span className="mr-2 font-medium">Departure:</span>
              <span className="capitalize">{ride.departure_city || "N/A"}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({ride.collection_point || "N/A"})
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Arrival:</span>
              <span className="capitalize">{ride.arrival_city || "N/A"}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({ride.drop_off_point || "N/A"})
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Hour of departure:</span>
              <span className="capitalize">
                {ride.hour_of_departure
                  ? `${departureHour}h ${departureMinute}m`
                  : "N/A"}
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Hour of arrival:</span>
              <span className="capitalize">
                {ride.hour_of_arrival
                  ? `${arrivalHour}h ${arrivalMinute}m`
                  : "N/A"}
              </span>
            </li>
            <li>
              <span className="mr-2 font-medium">Duration:</span>
              {ride.duration ? (
                <span className="capitalize">
                  {String(Math.floor(ride.duration / 60)).padStart(2, "0")}h
                  {String(ride.duration % 60).padStart(2, "0")}m
                </span>
              ) : (
                "N/A"
              )}
            </li>
            <li>
              <span className="mr-2 font-medium">Price:</span>
              <span className="capitalize">{ride.price || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Available seats:</span>
              <span className="capitalize">
                {ride.available_seats || "N/A"}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <DangerZone id={String(ride.id)} collectionName="rides" />
    </div>
  );
}
