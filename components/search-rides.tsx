"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { SearchParams, SearchRidesProps } from "@/lib/types";
import { DatePicker } from "./date-picker";
import Loader from "@/components/loader";
import { toast } from "sonner";

export default function SearchRides({
  onSearch,
  locations,
  isLoading,
}: SearchRidesProps) {
  // États pour les champs du formulaire
  const [departureId, setDepartureId] = useState<number | null>(null);
  const [arrivalId, setArrivalId] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [seats, setSeats] = useState<number>(1);

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

  return (
    <div className="fixed top-16 py-4 w-full border-b backdrop-blur-3xl z-1000 bg-background/50">
      <form
        className="grid grid-cols-1 gap-2 place-content-center px-2 mx-auto w-full max-w-7xl md:grid-cols-2 lg:grid-cols-9"
        onSubmit={handleSubmit}>
        <Combobox
          collection={locationOptions}
          value={departureId}
          setValue={setDepartureId}
          className="lg:col-span-2 dark:bg-input/30"
          placeholder="Ville de départ"
        />
        <Combobox
          collection={locationOptions}
          value={arrivalId}
          setValue={setArrivalId}
          className="lg:col-span-2 dark:bg-input/30"
          placeholder="Ville d'arrivée"
        />
        <DatePicker
          date={date}
          setDate={setDate}
          className="lg:col-span-2 dark:bg-input/30"
        />
        <Input
          type="number"
          value={seats}
          min={1}
          onChange={(e) => setSeats(Number(e.target.value))}
          placeholder="Nombre de places"
          className="lg:col-span-2"
        />
        <Button
          // variant="glow"
          className="w-32 cursor-pointer dark:text-white"
          type="submit"
          disabled={isLoading}>
          {isLoading ? (
            <Loader size="sm" />
          ) : (
            <>
              <Search className="mr-0.5" />
              <span className="text-sm">Rechercher</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
