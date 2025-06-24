"use client";

import { ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import RideInfoCard from "@/components/ride-info-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { convertMinutesToHours } from "@/lib/helpers";
import { apiClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "./loader";

export default function RideDetailsLayout({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["ride"],
    queryFn: () => apiClient(`rides/${id}`),
  });
  const rideDetails = query.data?.data.data;
  return (
    <div className="container px-2 pt-24 pb-8 mx-auto max-w-7xl min-h-screen border-r border-l">
      {query.isPending ? (
        <Loader />
      ) : (
        <>
          <h1 className="mb-8 text-3xl font-bold capitalize text-primary">
            {new Date(rideDetails?.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Panel: Ride Details */}
            <div className="space-y-6 lg:col-span-2">
              <RideInfoCard
                date={new Date(rideDetails?.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                departureTime={String(
                  rideDetails?.hour_of_departure?.slice(0, 5)
                )}
                departureDuration={String(rideDetails?.duration)}
                departureCity={String(rideDetails?.place_of_departure.name)}
                departureAddress={String(rideDetails?.collection_point)}
                arrivalTime={String(rideDetails?.hour_of_arrival?.slice(0, 5))}
                // arrivalDayOffset={String(rideDetails?.arrivalDayOffset)}
                arrivalCity={String(rideDetails?.place_of_arrival.name)}
                arrivalAddress={String(rideDetails?.drop_off_point)}
              />

              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Image
                      src={
                        rideDetails?.driver?.image &&
                        typeof rideDetails.driver.image === "string" &&
                        (rideDetails.driver.image.startsWith("http") ||
                          rideDetails.driver.image.startsWith("/"))
                          ? rideDetails.driver.image
                          : "/images/default-avatar.png"
                      }
                      alt={
                        rideDetails?.driver?.name
                          ? `${rideDetails.driver.name}'s profile picture`
                          : "Profile picture"
                      }
                      width={48}
                      height={48}
                      className="object-cover overflow-hidden mr-3 rounded-full border-2 border-primary"
                    />
                    <div>
                      <p className="text-lg font-semibold capitalize text-primary">
                        {String(rideDetails?.driver.name)}
                      </p>
                      <p className="flex items-center text-sm text-primary">
                        <span className="mr-1 text-xs text-sky-500">
                          <BadgeCheck />
                        </span>{" "}
                        Profil Vérifié
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-muted-foreground" />
                </div>

                {/* <p className="mb-6 whitespace-pre-line text-foreground/80">
                        {rideDetails?.driverMessage}
                      </p> */}

                <div className="space-y-3 text-sm text-foreground/80">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">⚡️</span>
                    Réservation instantanée
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🚭</span>
                    Voyager avec des fumeurs ne me dérange pas
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🐾</span>
                    Je préfère ne pas voyager en compagnie d`&apos;animaux
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🚗</span>
                    {rideDetails?.car ? (
                      <span>
                        {rideDetails.car.brand} {rideDetails.car.model} (
                        {rideDetails.car.year})
                      </span>
                    ) : (
                      "Aucune information sur le véhicule"
                    )}
                  </div>
                </div>

                <Button className="px-6 py-3 mt-6 w-full font-semibold text-white rounded-full border transition-colors cursor-pointer sm:w-auto border-primary hover:bg-primary/90">
                  💬 Contacter {String(rideDetails?.driver.name)}
                </Button>
              </Card>
            </div>

            {/* Right Panel: Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky p-6 top-18">
                <h2 className="mb-4 text-xl font-bold capitalize text-primary">
                  {new Date(rideDetails?.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="flex mb-4">
                  <div className="flex flex-col items-center mr-4">
                    <span className="text-sm text-muted-foreground">
                      {String(rideDetails?.hour_of_departure?.slice(0, 5))}
                    </span>
                    <div className="my-1 w-px h-8 bg-border"></div>
                    <span className="mt-1 text-xs text-muted-foreground">
                      ({convertMinutesToHours(Number(rideDetails?.duration))})
                    </span>
                    <div className="my-1 w-px h-8 bg-border"></div>
                    <span className="text-sm text-muted-foreground">
                      {String(rideDetails?.hour_of_arrival?.slice(0, 5))}
                    </span>
                    {/* <span className="mt-1 text-xs text-muted-foreground">
                            {String(rideDetails?.arrivalDayOffset)}
                          </span> */}
                  </div>
                  <div className="flex-grow">
                    <div className="mb-2">
                      <p className="font-semibold text-primary">
                        {String(rideDetails?.place_of_departure.name)}{" "}
                        <span className="text-xs text-muted-foreground">
                          🏢
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(rideDetails?.collection_point)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        {String(rideDetails?.place_of_arrival.name)}{" "}
                        <span className="text-xs text-muted-foreground">
                          🏢
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(rideDetails?.drop_off_point)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center py-4 my-4 border-t border-b">
                  <span className="mr-3 text-2xl text-muted-foreground">
                    🚗
                  </span>
                  <Image
                    src={
                      rideDetails?.driver?.image &&
                      typeof rideDetails.driver.image === "string" &&
                      (rideDetails.driver.image.startsWith("http") ||
                        rideDetails.driver.image.startsWith("/"))
                        ? rideDetails.driver.image
                        : "/images/default-avatar.png"
                    }
                    alt={
                      rideDetails?.driver?.name
                        ? `${rideDetails.driver.name}'s profile picture`
                        : "Profile picture"
                    }
                    width={32}
                    height={32}
                    className="object-cover overflow-hidden mr-2 rounded-full border border-primary"
                  />
                  <span className="capitalize text-primary">
                    {String(rideDetails?.driver.name)}
                  </span>
                </div>

                <div className="flex justify-between items-center my-4">
                  <span className="text-foreground/80">
                    {rideDetails?.available_seats
                      ? String(rideDetails?.available_seats).padStart(2, "0")
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

                <Button className="flex justify-center items-center py-3 w-full font-semibold text-white rounded-full transition-colors cursor-pointer bg-primary hover:bg-primary/90">
                  <span className="mr-2 text-xl">⚡️</span> Réserver
                </Button>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
