// import CarsForm from "@/components/cars-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import DangerZone from "./danger-zone";
// import { Car } from "@/lib/types";

// export default function CarsEdit({ car }: { car: Car }) {
//   return (
//     <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col gap-4 justify-center items-stretch">
//       <Card className="max-w-[500px] w-full self-center">
//         <CardHeader>
//           <CardTitle>Edit a car</CardTitle>
//         </CardHeader>
//         <Separator />
//         <CardContent>
//           <CarsForm data={car} operation="update" />
//         </CardContent>
//       </Card>
//       <DangerZone id={String(car.id)} collectionName="cars" />
//     </div>
//   );
// }
