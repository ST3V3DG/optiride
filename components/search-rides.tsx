"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Loader from "@/components/loader";
import { City, Ride, User } from "@/db/schema";
import {RideWithNames, SearchParams, SearchRidesProps} from "@/lib/types";
import { getCitiesAction } from "@/server/cities";
import { getFilteredRides } from "@/server/rides";
import { DatePicker } from "./date-picker";


async function searchRides(params: SearchParams): Promise<RideWithNames[]> {
  try {
    const response = await getFilteredRides(
        params.departure_id ? String(params.departure_id) : null,
        params.arrival_id ? String(params.arrival_id) : null,
        params.date ? new Date(params.date) : null,
        params.seats ?? 1
    );
    if (!response.success) {
      console.error("Failed to search rides", response.error);
      return [];
    }
    return response.data as RideWithNames[];
  } catch (error) {
    console.error("Error searching rides:", error);
    return [];
  }
}

export default function SearchRides({ onSearch }: SearchRidesProps) {
  const [departure_id, setDepartureId] = useState<number | null>(null);
  const [arrival_id, setArrivalId] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [seats, setSeats] = useState<number>(1);
  const [cities, setCities] =
      useState<{ id: number | null; label: string | null }[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const response = await getCitiesAction();
      const fetchedCities =
          response.success && response.data ? response.data : [];
      setCities([
        { id: null, label: "Aucune" },
        ...fetchedCities.map(({ id, name }: City) => ({ id, label: name })),
      ]);
    };
    initialize();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    const results = await searchRides({
      departure_id,
      arrival_id,
      date: String(date),
      seats,
    });
    onSearch(results);

    setIsLoading(false);
  };

  return (
      <div className="fixed top-16 z-1000 bg-background/50 backdrop-blur-3xl py-4 w-full border-b">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-2 place-content-center px-2">
          <Combobox
              collection={cities}
              value={departure_id}
              setValue={
                setDepartureId as React.Dispatch<
                    React.SetStateAction<number | City | User | Ride | null>
                >
              }
              className="lg:col-span-2 dark:bg-input/30"
              placeholder="Ville de départ"
          />
          <Combobox
              collection={cities}
              value={arrival_id}
              setValue={
                setArrivalId as React.Dispatch<
                    React.SetStateAction<number | City | User | Ride | null>
                >
              }
              className="lg:col-span-2 dark:bg-input/30"
              placeholder="Ville de d'arrivée"
          />
          {/* <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="lg:col-span-2"
          /> */}
          <DatePicker date={date} setDate={setDate} className="lg:col-span-2 dark:bg-input/30" />
          <Input
              type="number"
              value={seats}
              min={1}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              placeholder="Nombre de places"
              className="lg:col-span-2"
          />
          <Button
              className="w-32 dark:text-white cursor-pointer"
              onClick={handleSearch}
          >
            {isLoading ? (
                <Loader size="sm" />
            ) : (
                <>
                  <Search className="mr-0.5" />
                  <span className="text-sm">Rechercher</span>
                </>
            )}
          </Button>
        </div>
      </div>
  );
}