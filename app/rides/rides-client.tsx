"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RidesList from "@/components/rides-list";
import SearchRides from "@/components/search-rides";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { City, Ride, SearchParams } from "@/lib/types";

export default function RidesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useSearchParams();
  const [searchHistory, setSearchHistory] = useState<SearchParams[]>([]);
  const departure_id = urlParams.get("departure_id");
  const arrival_id = urlParams.get("arrival_id");
  const date = urlParams.get("date");
  const seats = urlParams.get("seats");

  const [searchParams, setSearchParams] = useState<SearchParams>({
    departure_id: departure_id ? Number(departure_id) : null,
    arrival_id: arrival_id ? Number(arrival_id) : null,
    date: date
      ? new Date(date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    seats: seats ? Number(seats) : 1,
  });
  const [rides, setRides] = useState<Ride[]>([]);

  // Fetch cities
  const citiesQuery = useQuery({
    queryKey: ["cities"],
    queryFn: () => apiClient.get("/cities"),
  });

  // Fetch rides
  const ridesQuery = useQuery({
    queryKey: ["rides", searchParams],
    queryFn: async () => {
      // if (!searchParams.departure_id || !searchParams.arrival_id)
      //   return { data: { data: [] } };
      return apiClient.get("/rides", { params: searchParams });
    },
    refetchOnWindowFocus: false,
  });

  // Update rides state when query data changes
  useEffect(() => {
    if (ridesQuery.data?.data?.data) {
      setRides(ridesQuery.data.data.data);
    }
  }, [ridesQuery.data]);

  const handleSearch = (params: SearchParams) => {
    const newUrlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value) !== "") {
        newUrlParams.set(key, String(value));
      }
    });

    router.push(`${pathname}?${newUrlParams.toString()}`);

    setSearchHistory((prev) => [params, ...prev.slice(0, 3)]);
    console.log(searchHistory);
    setSearchParams(params);
  };

  return (
    <>
      <SearchRides
        locations={(citiesQuery.data?.data.data as City[]) || []}
        onSearch={handleSearch}
        isLoading={citiesQuery.isPending || ridesQuery.isPending}
      />
      <div className="container px-4 mx-auto">
        <RidesList
          initialRides={rides}
          isLoading={citiesQuery.isPending || ridesQuery.isPending}
        />
      </div>
    </>
  );
}
