import { useState } from 'react';

export default function useSearchRides() {
  const [departureId, setDepartureId] = useState<number | null>(null);
  const [arrivalId, setArrivalId] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [seats, setSeats] = useState<number>(1);

  const getSearchParams = () => ({
    departure_id: departureId,
    arrival_id: arrivalId,
    date: date.toISOString().split('T')[0],
    seats,
  });

  return {
    departureId,
    setDepartureId,
    arrivalId,
    setArrivalId,
    date,
    setDate,
    seats,
    setSeats,
    getSearchParams,
  };
}