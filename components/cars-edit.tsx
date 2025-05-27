import CarsForm from "@/components/cars-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { Car } from "@/db/schema";

export default function CarsEdit({ car }: { car: Car }) {
  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col gap-4 place-content-center items-center">
      <Card className="max-w-[500px] w-full">
        <CardHeader>
          <CardTitle>Edit a car</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <CarsForm data={car} operation="update" />
        </CardContent>
      </Card>
      <DangerZone id={Number(car.id)} collectionName="cars" />
    </div>
  );
}
