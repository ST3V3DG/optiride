"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/combobox";
import { DatePicker } from "./date-picker";
import { toast } from "sonner";
import Loader from "./loader";
import { RideFormProps } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { Label } from "./ui/label";
import { useState } from "react";
import { AxiosError } from "axios";

export default function RidesForm({ data, operation }: RideFormProps) {
  // Fetch data for comboboxes
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

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await apiClient.get("/cities");
      return response.data.data.map((city: { id: number; name: string }) => ({
        value: city.id,
        label: city.name,
      }));
    },
  });

  const [cars, setCars] = useState<
    { value: string | number | null; label: string | null }[]
  >([]);

  if (data) {
    apiClient.get(`/cars?driver=${data?.driver.id}`).then((response) => {
      const newCars = response.data.data?.map(
        (car: { id: number; brand: string; model: string }) => ({
          value: car.id,
          label: `${car.brand} ${car.model}`,
        })
      );
      setCars(newCars);
    });
  }

  // Mutations for create and update
  const createMutation = useMutation({
    mutationFn: (data: {
      driver_id: number | undefined;
      car_id: number | undefined;
      place_of_departure_id: number | undefined;
      place_of_arrival_id: number | undefined;
      collection_point: string;
      drop_off_point: string;
      hour_of_departure: string;
      hour_of_arrival: string;
      date: string;
      duration: number;
      price: number;
      available_seats: number;
      description: string;
    }) => apiClient.post("/rides", data),
    onSuccess: () => {
      toast.success("Ride created successfully!");
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Operation failed", {
        description: error.response?.data?.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: number;
      driver_id: number | undefined;
      car_id: number | undefined;
      place_of_departure_id: number | undefined;
      place_of_arrival_id: number | undefined;
      collection_point: string;
      drop_off_point: string;
      hour_of_departure: string;
      hour_of_arrival: string;
      date: string;
      duration: number;
      price: number;
      available_seats: number;
      description: string;
    }) => apiClient.put(`/rides/${data?.id}`, data),
    onSuccess: () => {
      toast.success("Ride updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Operation failed", {
        description: error.response?.data?.message,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      driver_id: data?.driver?.id,
      car_id: data?.car?.id,
      place_of_departure_id: data?.place_of_departure?.id,
      place_of_arrival_id: data?.place_of_arrival?.id,
      collection_point: data?.collection_point ?? "",
      drop_off_point: data?.drop_off_point ?? "",
      hour_of_departure: data?.hour_of_departure?.slice(0, 5) ?? "08:00",
      hour_of_arrival: data?.hour_of_arrival?.slice(0, 5) ?? "10:00",
      price: data?.price ? Number(data.price) : 0,
      available_seats: data?.available_seats ?? 1,
      date: data?.date ? new Date(data.date) : new Date(),
      description: data?.description ?? "",
    },
    onSubmit: async ({ value }) => {
      const [departureHours, departureMinutes] = value.hour_of_departure
        .split(":")
        .map(Number);
      const [arrivalHours, arrivalMinutes] = value.hour_of_arrival
        .split(":")
        .map(Number);

      const departureTimeInMinutes = departureHours * 60 + departureMinutes;
      const arrivalTimeInMinutes = arrivalHours * 60 + arrivalMinutes;
      let durationInMinutes = arrivalTimeInMinutes - departureTimeInMinutes;
      if (durationInMinutes < 0) {
        durationInMinutes += 24 * 60; // Handles overnight rides
      }

      const submissionData = {
        ...value,
        duration: durationInMinutes,
        date: (value.date as Date).toISOString().split("T")[0], // Format date to YYYY-MM-DD
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
                setValue={(val) => {
                  const driverId = val === null ? undefined : Number(val);
                  field.handleChange(driverId);
                  form.setFieldValue("car_id", undefined);

                  if (driverId) {
                    apiClient
                      .get(`/cars?driver=${driverId}`)
                      .then((response) => {
                        console.log(response);
                        const newCars = response.data.data?.map(
                          (car: {
                            id: number;
                            brand: string;
                            model: string;
                          }) => ({
                            value: car.id,
                            label: `${car.brand} ${car.model}`,
                          })
                        );
                        setCars(newCars);
                      });
                  } else {
                    setCars([]);
                  }
                }}
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
          name="car_id"
          validators={{ onSubmit: ({ value }) => !value && "Car is required" }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start md:col-span-2">
              <Label htmlFor={field.name}>Car</Label>
              <Combobox
                collection={cars || []}
                value={field.state.value ?? null}
                setValue={(val) =>
                  field.handleChange(val === null ? undefined : Number(val))
                }
                placeholder="Select a car"
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
          name="place_of_departure_id"
          validators={{
            onSubmit: ({ value }) => !value && "Place of departure is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Place of departure</Label>
              <Combobox
                collection={cities || []}
                value={field.state.value ?? null}
                setValue={(val) =>
                  field.handleChange(val === null ? undefined : Number(val))
                }
                placeholder="Select place of departure"
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
          name="place_of_arrival_id"
          validators={{
            onSubmit: ({ value }) => !value && "Place of arrival is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Place of arrival</Label>
              <Combobox
                collection={cities || []}
                value={field.state.value ?? null}
                setValue={(val) =>
                  field.handleChange(val === null ? undefined : Number(val))
                }
                placeholder="Select place of arrival"
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
          name="collection_point"
          validators={{
            onSubmit: ({ value }) => !value && "Collection point is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Collection point</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter collection point"
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
          name="drop_off_point"
          validators={{
            onSubmit: ({ value }) => !value && "Drop off point is required",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Drop off point</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter drop off point"
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
          name="hour_of_departure"
          validators={{
            onSubmit: ({ value }) =>
              !/^([01]\d|2[0-3]):([0-5]\d)$/.test(value) &&
              "Invalid departure time",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Hour of departure</Label>
              <Input
                id={field.name}
                type="time"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
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
          name="hour_of_arrival"
          validators={{
            onSubmit: ({ value }) =>
              !/^([01]\d|2[0-3]):([0-5]\d)$/.test(value) &&
              "Invalid arrival time",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Hour of arrival</Label>
              <Input
                id={field.name}
                type="time"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
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
          name="price"
          validators={{
            onSubmit: ({ value }) =>
              (value === null || value <= 0) &&
              "Price must be a positive number",
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Price</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="Enter price"
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
            onSubmit: ({ value }) =>
              (value === null || value < 1) &&
              "Number of seats must be at least 1",
            // if (seats > 4) return "Too many seats";
          }}>
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start">
              <Label htmlFor={field.name}>Available Seats</Label>
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

        <form.Field name="date">
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start md:col-span-2">
              <Label>Date</Label>
              <DatePicker
                className="w-full dark:bg-input/30"
                date={field.state.value}
                setDate={(date) => field.handleChange(date)}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500/90">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="flex flex-col gap-4 justify-between items-start md:col-span-2">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a description (optional)"
              />
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
          "Create Ride"
        ) : (
          "Update Ride"
        )}
      </Button>
    </form>
  );
}
