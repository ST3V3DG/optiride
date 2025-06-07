import { Car } from "@/db/schema";

export default function CarList({
  cars,
  setCars,
}: {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
}) {
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete car.");
      }

      // Mettre à jour la liste des voitures après suppression
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div>
      {cars.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car.id} className="flex items-center justify-between">
              <span>{car.brand}</span>
              <button
                onClick={() => handleDelete(Number(car.id))}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
