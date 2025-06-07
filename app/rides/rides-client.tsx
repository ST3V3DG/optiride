"use client";

import { useState, useEffect } from "react";
import { RideWithNames } from "@/lib/types";
import RidesList from "@/components/rides-list";
import SearchRides from "@/components/search-rides";
import { RidesListProps } from "@/lib/types";

export default function RidesClient({ initialRides }: RidesListProps) {
  const [rides, setRides] = useState<RideWithNames[]>(initialRides);

  useEffect(() => {
    console.log("Rides state updated:", rides);
  }, [rides]);

  const handleSearch = (searchResults: RideWithNames[]) => {
    console.log("Search results received:", searchResults);
    setRides(searchResults);
  };

  return (
    <>
      <SearchRides onSearch={handleSearch} />
      <div className="container mx-auto px-4">
        <RidesList initialRides={rides} />
      </div>
    </>
  );
}
