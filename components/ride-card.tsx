import { convertMinutesToHours } from "@/lib/helpers";
import { Minus, CarIcon, Star, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Ride } from "@/lib/types";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";

export default function RideCard({ ride }: { ride: Ride }) {
  return (
    <li>
      <Link href={`/rides/${ride.id}`} target="_blank">
        <Card className="py-4 w-full">
          <CardHeader>
            <div className="grid grid-cols-5 gap-2">
              <CardTitle className="col-span-4">
                {ride.place_of_departure.name} - {ride.place_of_arrival.name}
              </CardTitle>
              <div className="col-span-1 row-span-2 self-center text-xl font-bold text-primary">
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
                  <div className="flex items-center ml-2 font-bold capitalize">
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      Note générale :
                    </span>
                    <Star className="ml-2 size-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-normal text-sm ml-0.5">
                      4,5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center items-center">
                <span className="capitalize">{ride.driver.name}</span>
                <div className="flex place-content-center place-items-center rounded-full border size-10 bg-foreground/50">
                  {ride.driver.image ? (
                    <Image
                      height={500}
                      width={500}
                      className="overflow-hidden rounded-full"
                      alt={String(ride.driver.name)}
                      src={'/' + String(ride.driver.image)}
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
