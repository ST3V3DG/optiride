import CarsForm from "@/components/cars-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CarsCreate() {
    return (
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col gap-4 place-content-center items-center">
            <Card className="max-w-[500px] w-full">
                <CardHeader>
                <CardTitle>Add a car</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                <CarsForm operation="create" />
                </CardContent>
            </Card>
        </div>
    );
}