import { User, type Car, type Ride } from "@/db/schema";

export type RideWithNames = Ride & {
  driver_name: string | null;
  driver_image: string | null;
  car: string | null;
  departure_city: string | null;
  arrival_city: string | null;
};

export type CarWithDriverName = Car & {
  driver_name: string | null;
}

export type NavUserProps = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type SearchParams = {
  departure_id: number | null;
  arrival_id: number | null;
  date: string;
  seats: number;
}

export type RidesListProps = {
  initialRides: RideWithNames[];
}

export type UserFormProps = {
  data?: User;
  operation: "create" | "update";
}

export type SearchRidesProps = {
  onSearch: (rides: RideWithNames[]) => void;
}

export type BreadcrumbType = {
  label: string;
  href: string;
}

export type Option = {
  id: number;
  label: string;
}

export type CarsTableProps = {
  initialCars: CarWithDriverName[];
}

export type CarComfort = "standard" | "premium" | "luxury";