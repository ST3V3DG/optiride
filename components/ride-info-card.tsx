import { ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { convertMinutesToHours } from "@/lib/helpers";

type RideInfoProps = {
  date: string;
  departureTime: string;
  departureDuration?: string;
  departureCity: string;
  departureAddress: string;
  arrivalTime: string;
  arrivalDayOffset?: string;
  arrivalCity: string;
  arrivalAddress: string;
}

export default function RideInfoCard({
  date,
  departureTime,
  departureDuration,
  departureCity,
  departureAddress,
  arrivalTime,
  arrivalDayOffset,
  arrivalCity,
  arrivalAddress,
}: RideInfoProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary capitalize">{date}</h2>
        <ArrowRight className="text-muted-foreground" />
      </div>

      <div className="flex items-center">
        <div className="flex flex-col items-center mr-4">
          <span className="text-sm text-muted-foreground">{departureTime}</span>
          <div className="w-px h-12 bg-muted my-1"></div>
          {departureDuration && (
            <span className="text-xs text-muted-foreground/70 mt-1">
              ({convertMinutesToHours(Number(departureDuration))})
            </span>
          )}
          <div className="w-px h-12 bg-muted my-1"></div>
          <span className="text-sm text-muted-foreground">{arrivalTime}</span>
          {arrivalDayOffset && (
            <span className="text-xs text-muted-foreground/70 mt-1">
              {arrivalDayOffset}
            </span>
          )}
        </div>

        <div className="flex-grow">
          <div className="mb-4">
            <p className="font-semibold text-primary">
              {departureCity}{" "}
              <span className="text-xs text-muted-foreground">🏢</span>
            </p>
            <p className="text-sm text-muted-foreground">{departureAddress}</p>
          </div>
          <div>
            <p className="font-semibold text-primary">
              {arrivalCity}{" "}
              <span className="text-xs text-muted-foreground">🏢</span>
            </p>
            <p className="text-sm text-muted-foreground">{arrivalAddress}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
