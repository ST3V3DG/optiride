import RidesForm from "@/components/rides-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { Ride } from "@/db/schema";

export default function RidesEdit({ ride }: { ride: Ride }) {
  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col gap-4 place-content-center items-center">
      <Card className="max-w-[500px] w-full">
        <CardHeader>
          <CardTitle>Edit a ride</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <RidesForm data={ride} operation="update" />
        </CardContent>
      </Card>
      <DangerZone id={Number(ride.id)} collectionName="rides" />
    </div>
  );
}
