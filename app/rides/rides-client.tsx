"use client";

import { useState, useEffect } from "react";
import RidesList from "@/components/rides-list";
import SearchRides from "@/components/search-rides";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { City, Ride, SearchParams } from "@/lib/types";

export default function RidesClient() {
  const [searchHistory, setSearchHistory] = useState<SearchParams[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    departure_id: null,
    arrival_id: null,
    date: null,
    // date: new Date().toISOString().split("T")[0],
    seats: 1,
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
        <RidesList initialRides={rides} />
      </div>
    </>
  );
}
