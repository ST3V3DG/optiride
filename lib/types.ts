export type User = {
  id: number;
  name: string;
  email: string;
  email_verified?: boolean | null;
  email_verified_at?: Date | null;
  phone?: string | null;
  image?: string | null;
  nic_passport_number?: string | null;
  nic_passport_recto?: string | null;
  nic_passport_verso?: string | null;
  role?: "driver" | "user" | "admin" | null;
  validated?: boolean | null;
  validated_at?: Date | null;
  password: string;
  remember_token?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type Car = {
  id: number;
  driver: User;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  registration?: string | null;
  available_seats?: number | null;
  comfort?: "standard" | "premium" | "luxury" | null;
  created_at: Date;
  updated_at: Date;
};

export type City = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export type Ride = {
  id: number;
  driver: User;
  car: Car;
  place_of_departure: City;
  place_of_arrival: City;
  collection_point?: string | null;
  drop_off_point?: string | null;
  hour_of_departure?: string | null;
  hour_of_arrival?: string | null;
  date?: string | null;
  duration?: number | null;
  price?: number | null;
  available_seats?: number | null;
  description?: string | null;
  status?: "opened" | "completed" | "canceled" | "full" | null;
  created_at: Date;
  updated_at: Date;
}


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
  initialRides: Ride[];
}

export type UserFormProps = {
  data?: User;
  operation: "create" | "update";
}

export type SearchRidesProps = {
  onSearch: (params: SearchParams) => void;
  locations: { id: number | null; name: string }[];
  isLoading: boolean;
  fromLabel?: string;
  toLabel?: string;
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

export type TanstackProviderProps = {
    children: React.ReactNode;
}
