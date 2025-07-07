"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { toast } from "sonner";
import Loader from "./loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Car, CarComfort } from "@/lib/types";
import { AxiosError } from "axios";

type CarsFormProps = {
  data?: Car;
  operation: "create" | "update";
};

export default function CarsForm({ data, operation }: CarsFormProps) {
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const response = await apiClient.get("/users?role=driver");
      return response.data.data.map((driver: { id: number; name: string }) => ({
        value: driver.id,
        label: driver.name,
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      driver_id: number | undefined;
      brand: string;
      model: string;
      year: string;
      registration: string;
      available_seats: number;
      comfort: CarComfort;
    }) =>
      apiClient.get("/csrf-cookie").then(() =>
        apiClient.post("/cars", data)
      ),
    onSuccess: () => {
      toast.success("Car created successfully!");
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Operation failed", {
        description: error.response?.data?.message,
      });
      console.log(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: number;
      driver_id: number | undefined;
      brand: string;
      model: string;
      year: string;
      registration: string;
      available_seats: number;
      comfort: CarComfort;
    }) =>
      apiClient.get("/csrf-cookie").then(() =>
        apiClient.put(`/cars/${data?.id}`, {
          id: data.id,
          driver_id: data.driver_id,
          brand: data.brand,
          model: data.model,
          year: data.year,
          registration: data.registration,
          available_seats: data.available_seats,
          comfort: data.comfort,
        })
      ),
    onSuccess: () => {
      toast.success("Car updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Operation failed", {
        description: error.response?.data?.message,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      driver_id: data?.driver?.id ?? undefined,
      brand: data?.brand ?? "",
      model: data?.model ?? "",
      year: data?.year ?? new Date().getFullYear().toString(),
      registration: data?.registration ?? "",
      comfort: data?.comfort ?? ("standard" as CarComfort),
      available_seats: data?.available_seats ?? 1,
    },
    onSubmit: async ({ value }) => {
      const submissionData = {
        ...value,
        year: String(value.year),
        available_seats: Number(value.available_seats),
      };

      if (operation === "create") {
        createMutation.mutate(submissionData);
      } else if (data) {
        updateMutation.mutate({ ...submissionData, id: data.id });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form.Field
          name="driver_id"
          validators={{
            onSubmit: ({ value }) => !value && "Driver is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start md:col-span-2">
              <Label htmlFor={field.name}>Driver</Label>
              <Combobox
                collection={drivers || []}
                value={field.state.value ?? null}
                setValue={(val) =>
                  field.handleChange(val === null ? undefined : Number(val))
                }
                placeholder="Select a driver"
                className="dark:bg-input/30"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="brand"
          validators={{
            onSubmit: ({ value }) => !value && "Brand is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Brand</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter car brand (e.g., Toyota)"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="model"
          validators={{
            onSubmit: ({ value }) => !value && "Model is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Model</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter car model (e.g., Camry)"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="year"
          validators={{
            onSubmit: ({ value }) => {
              const year = Number(value);
              if (!value) return "Year is required";
              if (year < 1900) return "Year must be after 1900";
              if (year > new Date().getFullYear() + 1)
                return "Year cannot be in the distant future";
            },
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Year of Manufacture</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter year (e.g., 2023)"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="registration"
          validators={{
            onSubmit: ({ value }) => !value && "Registration plate is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Registration Plate</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter registration (e.g., ABC 123)"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="available_seats"
          validators={{
            onSubmit: ({ value }) => {
              const seats = Number(value);
              if (!value) return "Number of seats is required";
              if (seats < 1) return "Number of seats must be at least 1";
              // if (seats > 4) return "Too many seats";
            },
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start md:col-span-2">
              <Label htmlFor={field.name}>Number of Seats</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="Enter number of seats"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="comfort">
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start md:col-span-2">
              <Label htmlFor={field.name}>Comfort Level</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as CarComfort)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select comfort level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      </div>

      <Button
        type="submit"
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full text-white cursor-pointer">
        {createMutation.isPending || updateMutation.isPending ? (
          <Loader size="sm" />
        ) : operation === "create" ? (
          "Create Car"
        ) : (
          "Update Car"
        )}
      </Button>
    </form>
  );
}
