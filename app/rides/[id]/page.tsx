import { ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import RideInfoCard from "@/components/ride-info-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRideAction } from "@/server/rides";
import { convertMinutesToHours } from "@/lib/helpers";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ride = await getRideAction(id);

  const rideDetails = ride.data ? ride.data[0] : null;

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-7xl pt-24 min-h-screen border-r border-l px-2 pb-8">
        <h1 className="text-3xl font-bold text-primary mb-8 capitalize">
          {String(
            rideDetails?.date?.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          )}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Ride Details */}
          <div className="lg:col-span-2 space-y-6">
            <RideInfoCard
              date={String(
                rideDetails?.date?.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )}
              departureTime={String(
                rideDetails?.hour_of_departure?.slice(0, 5)
              )}
              departureDuration={String(rideDetails?.duration)}
              departureCity={String(rideDetails?.departure_city)}
              departureAddress={String(rideDetails?.collection_point)}
              arrivalTime={String(rideDetails?.hour_of_arrival?.slice(0, 5))}
              arrivalDayOffset={String(rideDetails?.arrival_city)}
              arrivalCity={String(rideDetails?.arrival_city)}
              arrivalAddress={String(rideDetails?.drop_off_point)}
            />

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Image
                    src={
                      rideDetails?.driver_image
                        ? String(rideDetails?.driver_image)
                        : "/"
                    }
                    alt={
                      rideDetails?.driver_name
                        ? String(rideDetails?.driver_name)
                        : "/"
                    }
                    width={48}
                    height={48}
                    className="rounded-full mr-3 border-2 border-primary object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg text-primary capitalize">
                      {String(rideDetails?.driver_name)}
                    </p>
                    <p className="text-sm text-primary flex items-center">
                      <span className="mr-1 text-xs text-sky-500"><BadgeCheck /></span> Profil Vérifié
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground" />
              </div>

              {/* <p className="text-foreground/80 mb-6 whitespace-pre-line">
                {rideDetails?.driverMessage}
              </p> */}

              <div className="space-y-3 text-sm text-foreground/80">
                <div className="flex items-center">
                  <span className="text-xl mr-3">⚡️</span>
                  Réservation instantanée
                </div>
                <div className="flex items-center">
                  <span className="text-xl mr-3">🚭</span>
                  Voyager avec des fumeurs ne me dérange pas
                </div>
                <div className="flex items-center">
                  <span className="text-xl mr-3">🐾</span>
                  Je préfère ne pas voyager en compagnie d'animaux
                </div>
                <hr className="my-4" />
                <div className="flex items-center">
                  <span className="text-xl mr-3">🚗</span>
                  {rideDetails?.car}
                </div>
              </div>

              <Button className="mt-6 w-full sm:w-auto px-6 py-3 border border-primary rounded-full font-semibold hover:bg-primary/90 text-white transition-colors cursor-pointer">
                💬 Contacter {String(rideDetails?.driver_name)}
              </Button>
            </Card>
          </div>

          {/* Right Panel: Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-18">
              <h2 className="text-xl font-bold text-primary mb-4 capitalize">
                {String(
                  rideDetails?.date?.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                )}
              </h2>
              <div className="flex mb-4">
                <div className="flex flex-col items-center mr-4">
                  <span className="text-sm text-muted-foreground">
                    {String(rideDetails?.hour_of_departure?.slice(0, 5))}
                  </span>
                  <div className="w-px h-8 bg-border my-1"></div>
                  <span className="text-xs text-muted-foreground mt-1">
                    ({convertMinutesToHours(Number(rideDetails?.duration))})
                  </span>
                  <div className="w-px h-8 bg-border my-1"></div>
                  <span className="text-sm text-muted-foreground">
                    {String(rideDetails?.hour_of_arrival?.slice(0, 5))}
                  </span>
                  {/* <span className="text-xs text-muted-foreground mt-1">
                    {String(rideDetails?.arrivalDayOffset)}
                  </span> */}
                </div>
                <div className="flex-grow">
                  <div className="mb-2">
                    <p className="font-semibold text-primary">
                      {String(rideDetails?.departure_city)}{" "}
                      <span className="text-xs text-muted-foreground">🏢</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {String(rideDetails?.collection_point)}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      {String(rideDetails?.arrival_city)}{" "}
                      <span className="text-xs text-muted-foreground">🏢</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {String(rideDetails?.drop_off_point)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center my-4 py-4 border-t border-b">
                <span className="text-2xl mr-3 text-muted-foreground">🚗</span>
                <Image
                  src={
                    rideDetails?.driver_image
                      ? String(rideDetails?.driver_image)
                      : "/"
                  }
                  alt={
                    rideDetails?.driver_name
                      ? String(rideDetails?.driver_name)
                      : "/"
                  }
                  width={32}
                  height={32}
                  className="rounded-full mr-2 border border-primary object-cover"
                />
                <span className="text-primary capitalize">
                  {String(rideDetails?.driver_name)}
                </span>
              </div>

              <div className="flex justify-between items-center my-4">
                <span className="text-foreground/80">
                  {rideDetails?.number_of_seats
                    ? String(rideDetails?.number_of_seats).padStart(2, "0")
                    : 0}{" "}
                  passager(s)
                </span>
                <span className="text-2xl font-bold text-primary">
                  {Number(rideDetails?.price).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  })}
                </span>
              </div>

              <Button className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer">
                <span className="text-xl mr-2">⚡️</span> Réserver
              </Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
