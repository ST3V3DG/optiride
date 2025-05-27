import { convertMinutesToHours } from "@/lib/helpers";
import { Minus, CarIcon, Star, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { RideWithNames } from "@/lib/types";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";

export default function RideCard({ ride }: { ride: RideWithNames }) {
  return (
    <li>
      <Link href={`/rides/${ride.id}`} target="_blank">
        <Card className="w-full py-4">
          <CardHeader>
            <div className="grid grid-cols-5 gap-2">
              <CardTitle className="col-span-4">
                {ride.departure_city} - {ride.arrival_city}
              </CardTitle>
              <div className="text-xl text-primary font-bold col-span-1 row-span-2 self-center">
                {Number(ride.price).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                })}
              </div>
              <CardDescription className="col-span-4 font-bold">
                <span>{ride.hour_of_departure?.slice(0, 5)}</span>
                <Minus className="inline-block size-8" />
                <span className="text-xs">
                  {convertMinutesToHours(Number(ride.duration))}
                </span>
                <Minus className="inline-block size-8" />
                <span>{ride.hour_of_arrival?.slice(0, 5)}</span>
              </CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex">
                  <CarIcon />
                  <div className="flex font-bold capitalize items-center ml-2">
                    <span className="text-sm text-muted-foreground font-normal ml-2">
                      Note générale :
                    </span>
                    <Star className="ml-2 size-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-normal text-sm ml-0.5">
                      4,5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <span className="capitalize">{ride.driver_name}</span>
                <div className="size-10 border rounded-full bg-foreground/50 flex place-content-center place-items-center">
                  {ride.driver_image ? (
                    <Image
                      height={500}
                      width={500}
                      alt={String(ride.driver_name)}
                      src={ride.driver_image}
                    />
                  ) : (
                    <User />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
