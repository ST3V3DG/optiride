// "use client";

// import { useState } from "react";
// import { RideWithNames } from "@/lib/types";
// import SearchRides from "@/components/search-rides";
// import RidesList from "@/components/rides-list";

// interface RidesPageClientProps {
//   initialRides: RideWithNames[];
// }

// export default function RidesPageClient({
//   initialRides,
// }: RidesPageClientProps) {
//   const [rides, setRides] = useState<RideWithNames[]>(initialRides);

//   const handleSearch = (searchResults: RideWithNames[]) => {
//     setRides(searchResults);
//   };

//   return (
//     <>
//       <SearchRides onSearch={handleSearch} />
//       <div className="container mx-auto px-4 py-8">
//         <RidesList initialRides={rides} />
//       </div>
//     </>
//   );
// }
