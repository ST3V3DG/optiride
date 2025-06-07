import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import NoData from "./no-data";
import { CarWithDriverName } from "@/lib/types";

export default function CarDetails({ car }: { car: CarWithDriverName }) {
  if (!car) {
    return <NoData />;
  }

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      <Card className="w-full max-w-[500px] m-auto">
        <CardHeader>
          <CardTitle>Car Information</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <ul className="flex flex-col justify-between gap-4 pt-4">
            <li>
              <span className="font-medium mr-2">Driver:</span>
              <span className="capitalize">{car.driver_name || "N/A"}</span>
            </li>
            <li>
              <span className="font-medium mr-2">Brand:</span>
              <span className="capitalize">{car.brand || "N/A"}</span>
            </li>
            <li>
              <span className="font-medium mr-2">Model:</span>
              <span className="capitalize">{car.model || "N/A"}</span>
            </li>
            <li>
              <span className="font-medium mr-2">Year:</span>
              <span className="capitalize">{car.year || "N/A"}</span>
            </li>
            <li>
              <span className="font-medium mr-2">Comfort:</span>
              <span className="capitalize">{car.comfort || "N/A"}</span>
            </li>
            <li>
              <span className="font-medium mr-2">Registration:</span>
              <span className="uppercase">{car.registration || "N/A"}</span>
            </li>
            <li>
              <span className="font-medium mr-2">Number of seats:</span>
              <span className="capitalize">{car.available_seats || "N/A"}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <DangerZone id={Number(car.id)} collectionName="cars" />
    </div>
  );
}
