"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { SearchParams, SearchRidesProps } from "@/lib/types";
import { DatePicker } from "./date-picker";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { IconReload } from "@tabler/icons-react";

export default function SearchRides({
  onSearch,
  locations,
  isLoading,
}: SearchRidesProps) {
  // États pour les champs du formulaire
  const searchParams = useSearchParams();
  const departureIdParam = searchParams.get("departure_id");
  const arrivalIdParam = searchParams.get("arrival_id");
  const dateParam = searchParams.get("date");
  const seatsParam = searchParams.get("seats");

  const [departureId, setDepartureId] = useState<number | null>(
    departureIdParam ? parseInt(departureIdParam) : null
  );
  const [arrivalId, setArrivalId] = useState<number | null>(
    arrivalIdParam ? parseInt(arrivalIdParam) : null
  );
  const [date, setDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [seats, setSeats] = useState<number>(
    seatsParam ? parseInt(seatsParam) : 1
  );

  // Fonction de validation
  const validateSearch = (params: SearchParams) => {
    if (!params.departure_id || !params.arrival_id) {
      return "Veuillez sélectionner un lieu de départ et d'arrivée";
    }
    if (params.departure_id === params.arrival_id) {
      return "Le lieu de départ et d'arrivée doivent être différents";
    }
    return null;
  };

  // Formatage des options pour le Combobox
  const locationOptions = useMemo(() => {
    // Si locations n'est pas un tableau, retourne un tableau vide avec l'option par défaut
    if (!Array.isArray(locations)) {
      console.error("Locations is not an array:", locations);
      return [{ id: null, label: "Sélectionner..." }];
    }

    return [
      { id: null, label: "Sélectionner..." },
      ...locations
        .filter(
          (loc) =>
            loc && typeof loc === "object" && "id" in loc && "name" in loc
        )
        .map((loc) => ({
          id: loc.id,
          label: loc.name || `Ville ${loc.id}`,
        })),
    ];
  }, [locations]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchParams = {
      departure_id: departureId,
      arrival_id: arrivalId,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`,
      seats,
    };

    // Validation
    const validationError = validateSearch(searchParams);
    if (validationError) {
      toast.error("Erreur !", { description: validationError });
      return;
    }

    // Envoi des paramètres de recherche
    onSearch(searchParams);
  };

  // Gestion de l'annulatio du formulaire
  const handleReset = () => {
    setDepartureId(null);
    setArrivalId(null);
    setDate(new Date());
    setSeats(1);
    onSearch({
      departure_id: null,
      arrival_id: null,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`,
      seats,
    });
  };

  return (
    <div className="lg:fixed lg:top-16 py-4 w-full border-b backdrop-blur-3xl -z-1 lg:z-1000 bg-background/50 md:pt-16">
      <form
        className="flex flex-col lg:flex-row gap-2 place-content-center px-2 mx-auto w-full max-w-7xl pt-12 md:pt-0"
        onSubmit={handleSubmit}>
        <Combobox
          collection={locationOptions}
          value={departureId}
          setValue={setDepartureId}
          className="grow-1 dark:bg-input/30"
          placeholder="Ville de départ"
        />
        <Combobox
          collection={locationOptions}
          value={arrivalId}
          setValue={setArrivalId}
          className="grow-1 dark:bg-input/30"
          placeholder="Ville d'arrivée"
        />
        <DatePicker
          date={date}
          setDate={setDate}
          className="grow-1 dark:bg-input/30 z-1000"
        />
        <Input
          type="number"
          value={seats}
          min={1}
          onChange={(e) => setSeats(Number(e.target.value))}
          placeholder="Nombre de places"
          className="grow-1"
        />
        <div className="flex justify-center items-center gap-1 shrink-1">
          <Button
            className="w-full md:w-32 cursor-pointer dark:text-white flex lg:justify-between justify-center items-center gap-1"
            type="submit"
            disabled={isLoading}>
            {isLoading ? (
              <Loader size="sm" />
            ) : (
              <>
                <Search />
                <span className="text-sm">Rechercher</span>
              </>
            )}
          </Button>
          <Button
            className="w-full md:max-w-32 md:w-fit cursor-pointer dark:text-white flex lg:justify-between justify-center items-center gap-1"
            type="reset"
            variant="outline"
            disabled={isLoading}
            onClick={handleReset}>
            {isLoading ? (
              <Loader size="sm" />
            ) : (
              <>
                <IconReload />
                <span className="text-sm lg:hidden">Reinitialiser</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
