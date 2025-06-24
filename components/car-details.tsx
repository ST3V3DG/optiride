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
          <ul className="flex flex-col gap-4 justify-between pt-4">
            <li>
              <span className="mr-2 font-medium">Driver:</span>
              <span className="capitalize">{car.driver_name || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Brand:</span>
              <span className="capitalize">{car.brand || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Model:</span>
              <span className="capitalize">{car.model || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Year:</span>
              <span className="capitalize">{car.year || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Comfort:</span>
              <span className="capitalize">{car.comfort || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Registration:</span>
              <span className="uppercase">{car.registration || "N/A"}</span>
            </li>
            <li>
              <span className="mr-2 font-medium">Number of seats:</span>
              <span className="capitalize">{car.available_seats || "N/A"}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <DangerZone id={String(car.id)} collectionName="cars" />
    </div>
  );
}
