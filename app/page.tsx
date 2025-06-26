"use client";

import { useState, useEffect, Suspense } from "react";
import SearchRides from "@/components/search-rides";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { City, Ride, SearchParams } from "@/lib/types";
import Header from "@/components/header";
import Hero from "@/components/sections/hero/default";
import Items from "@/components/sections/items/default";
import Logos from "@/components/sections/logos/default";
import Stats from "@/components/sections/stats/default";
import Pricing from "@/components/sections/pricing/default";
import CTA from "@/components/sections/cta/default";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function Page() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    departure_id: null,
    arrival_id: null,
    date: new Date().toISOString().split("T")[0],
    seats: 1,
  });
  const [, setRides] = useState<Ride[]>([]);

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
    const cleanedParams: Record<string, string> = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key as keyof SearchParams];
        if (value !== null && value !== undefined) {
          cleanedParams[key] = String(value);
        }
      }
    }
    setSearchParams(params);
    router.push(`/rides?${new URLSearchParams(cleanedParams).toString()}`);
  };

  return (
    <>
      <Header />
      <Suspense fallback={<Loader />}>
        <SearchRides
          locations={(citiesQuery.data?.data.data as City[]) || []}
          onSearch={handleSearch}
          isLoading={citiesQuery.isPending || ridesQuery.isPending}
        />
      </Suspense>
      <Hero />
      <Logos />
      <Items />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
