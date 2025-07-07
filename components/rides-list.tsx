"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { City, Ride, SearchParams } from "@/lib/types";
import SearchRides from "@/components/search-rides";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Clock, Dot, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RideCard from "@/components/ride-card";
import Loader from "@/components/loader";
import NoData from "./no-data";

export default function RidesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsFromUrl = useSearchParams();

  const searchParams = useMemo(() => {
    return {
      departure_id: searchParamsFromUrl.get("departure_id")
        ? Number(searchParamsFromUrl.get("departure_id"))
        : null,
      arrival_id: searchParamsFromUrl.get("arrival_id")
        ? Number(searchParamsFromUrl.get("arrival_id"))
        : null,
      date:
        searchParamsFromUrl.get("date") ||
        new Date().toISOString().split("T")[0],
      seats: searchParamsFromUrl.get("seats")
        ? Number(searchParamsFromUrl.get("seats"))
        : 1,
    };
  }, [searchParamsFromUrl]);

  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [sortBy, setSortBy] = useState<string>("hour_of_departure");
  const [timeFilters, setTimeFilters] = useState<string[]>([]);

  const citiesQuery = useQuery({
    queryKey: ["cities"],
    queryFn: () => apiClient.get("/cities"),
  });

  const ridesQuery = useQuery({
    queryKey: ["rides", searchParams],
    queryFn: () => apiClient.get("/rides", { params: searchParams }),
    refetchOnWindowFocus: false,
  });

  const allRides = useMemo(
    () => ridesQuery.data?.data?.data || [],
    [ridesQuery.data]
  );
  const isLoading = citiesQuery.isPending || ridesQuery.isPending;

  const filterAndSortRides = useCallback(() => {
    let result: Ride[] = [...allRides];
    if (timeFilters.length > 0) {
      result = result.filter((ride) => {
        const departureTime = ride?.hour_of_departure;
        if (!departureTime) return false;
        const [hours] = departureTime.split(":").map(Number);
        return timeFilters.some((filter) => {
          switch (filter) {
            case "before-6":
              return hours < 6;
            case "6-12":
              return hours >= 6 && hours <= 12;
            case "12-18":
              return hours > 12 && hours <= 18;
            case "after-18":
              return hours > 18;
            default:
              return false;
          }
        });
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "hour_of_departure":
          return (a.hour_of_departure ?? "").localeCompare(
            b.hour_of_departure ?? ""
          );
        case "hour_of_arrival":
          return (a.hour_of_arrival ?? "").localeCompare(
            b.hour_of_arrival ?? ""
          );
        case "price":
          return Number(a.price ?? 0) - Number(b.price ?? 0);
        case "duration":
          return Number(a.duration ?? 0) - Number(b.duration ?? 0);
        default:
          return 0;
      }
    });

    setFilteredRides(result);
  }, [allRides, sortBy, timeFilters]);

  useEffect(() => {
    filterAndSortRides();
  }, [filterAndSortRides]);

  const handleSearch = (params: SearchParams) => {
    const newUrlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value) !== "") {
        newUrlParams.set(key, String(value));
      }
    });
    router.push(`${pathname}?${newUrlParams.toString()}`);
    // setSearchHistory((prev) => [params, ...prev.slice(0, 3)]);
  };

  const handleSort = (newSortBy: string) => setSortBy(newSortBy);

  const handleTimeFilterChange = (timeRange: string) => {
    setTimeFilters((current) =>
      current.includes(timeRange)
        ? current.filter((item) => item !== timeRange)
        : [...current, timeRange]
    );
  };

  return (
    <>
      <SearchRides
        locations={(citiesQuery.data?.data.data as City[]) || []}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <div className="container grid grid-cols-8 mx-auto max-w-7xl min-h-screen border-r border-l lg:pt-33 md:grid-cols-12">
        <div className="flex flex-col col-span-8 md:col-span-4 gap-4 justify-start p-2 border-r">
          <Card>
            <CardHeader className="flex justify-between">
              <span className="font-bold">Trier par</span>
              <Button
                onClick={() => handleSort("hour_of_departure")}
                className="text-sm font-bold text-white cursor-pointer hover:text-white">
                Réinitialiser
              </Button>
            </CardHeader>
            <CardContent>
              <RadioGroup value={sortBy} onValueChange={handleSort}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="hour_of_departure"
                    id="hour_of_departure"
                  />
                  <Label
                    htmlFor="hour_of_departure"
                    className="flex justify-between items-center w-full">
                    <span>Heure de départ</span>
                    <Clock className="size-5" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="hour_of_arrival"
                    id="hour_of_arrival"
                  />
                  <Label
                    htmlFor="hour_of_arrival"
                    className="flex justify-between items-center w-full">
                    <span>Heure d&apos;arrivée</span>
                    <Clock className="size-5" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price" id="price" />
                  <Label
                    htmlFor="price"
                    className="flex justify-between items-center w-full">
                    <span>Prix</span>
                    <Wallet className="size-5" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="duration" id="duration" />
                  <Label
                    htmlFor="duration"
                    className="flex justify-between items-center w-full">
                    <span>Temps de trajet</span>
                    <Clock className="size-5" />
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <span className="font-bold">Heure de départ</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "before-6", label: "Avant 06:00" },
                { id: "6-12", label: "06:00 - 12:00" },
                { id: "12-18", label: "12:00 - 18:00" },
                { id: "after-18", label: "Après 18:00" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={timeFilters.includes(id)}
                    onCheckedChange={() => handleTimeFilterChange(id)}
                  />
                  <Label
                    htmlFor={id}
                    className="flex justify-between items-center w-full text-sm">
                    <span>{label}</span>
                    <span className="font-bold text-muted-foreground">
                      {
                        allRides.filter((ride: Ride) => {
                          const [hours] = (ride.hour_of_departure ?? "")
                            .split(":")
                            .map(Number);
                          switch (id) {
                            case "before-6":
                              return hours < 6;
                            case "6-12":
                              return hours >= 6 && hours <= 12;
                            case "12-18":
                              return hours > 12 && hours <= 18;
                            case "after-18":
                              return hours > 18;
                            default:
                              return false;
                          }
                        }).length
                      }
                    </span>
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <main className="col-span-8 p-2">
          <Tabs defaultValue="car" className="w-full">
            <TabsList className="grid w-full grid-cols-1 h-fit *:cursor-pointer bg-background">
              <TabsTrigger
                value="car"
                className="flex gap-2 justify-center items-center">
                <Car className="size-9" />
                <span className="text-xl">Voitures</span>
                <Dot className="size-6" />
                <span className="text-xl">{filteredRides.length}</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="car">
              <div className="flex justify-between items-center px-2 pb-2 text-primary">
                <span>{filteredRides.length} trajet(s) disponible(s)</span>
              </div>
              <ul className="w-full flex flex-col gap-4 *:list-none max-h-screen lg:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hidden">
                {isLoading ? (
                  <Loader />
                ) : filteredRides.length > 0 ? (
                  filteredRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))
                ) : (
                  <NoData />
                )}
              </ul>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
