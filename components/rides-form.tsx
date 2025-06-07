"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/combobox";
import { DatePicker } from "./date-picker";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "./loader";
import {
  getDriversAction,
  getCitiesAction,
  createRide,
  updateRide,
} from "@/server/rides";
import { getCarsAction } from "@/server/cars";
import { Ride } from "@/db/schema";
import { Option } from "@/lib/types";

const formSchema = z.object({
  driver: z.number().min(1, "Driver is required."),
  car: z.number().min(1, "Car is required."),
  place_of_departure: z.number().min(1, "Place of departure is required."),
  place_of_arrival: z.number().min(1, "Place of arrival is required."),
  collection_point: z.string().min(1, "Collection point is required."),
  drop_off_point: z.string().min(1, "Drop off point is required."),
  hour_of_departure: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid departure time."),
  hour_of_arrival: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid arrival time."),
  price: z.number().positive("Price must be a positive number."),
  available_seats: z
    .number()
    .int()
    .min(1, "Number of seats must be at least 1."),
  date: z.date(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function RidesForm({
  data,
  operation,
}: {
  data?: Ride;
  operation: "create" | "update";
}) {
  const [date, setDate] = useState<Date>(new Date(data?.date ?? Date.now()));
  const [selectedDriver, setSelectedDriver] = useState<number | undefined>(
    data?.driverId ?? undefined
  );
  const [selectedCar, setSelectedCar] = useState<number | undefined>(
    data?.carId ?? undefined
  );
  const [selectedDeparture, setSelectedDeparture] = useState<
    number | undefined
  >(data?.place_of_departure ?? undefined);
  const [selectedArrival, setSelectedArrival] = useState<number | undefined>(
    data?.place_of_arrival ?? undefined
  );

  const [drivers, setDrivers] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [carsOptions, setCarsOptions] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [driversResult, citiesResult, carsResult] = await Promise.all([
        getDriversAction(),
        getCitiesAction(),
        getCarsAction(),
      ]);

      if (driversResult.success && driversResult.data) {
        setDrivers(
          driversResult.data
            .map((d) => ({ id: d.id, label: d.name ?? "N/A" }))
            .filter((d) => d.label !== "N/A")
        );
      } else {
        toast.error("Error fetching drivers", {
          description: driversResult.error,
        });
      }

      if (citiesResult.success && citiesResult.data) {
        setCities(
          citiesResult.data
            .map((c) => ({ id: c.id, label: c.name ?? "N/A" }))
            .filter((c) => c.label !== "N/A")
        );
      } else {
        toast.error("Error fetching cities", {
          description: citiesResult.error,
        });
      }

      if (carsResult.success && carsResult.data) {
        setCarsOptions(
          carsResult.data
            .map((c) => ({ id: c.id, label: c.model ?? "N/A" }))
            .filter((c) => c.label !== "N/A")
        );
      } else {
        toast.error("Error fetching cars", { description: carsResult.error });
      }

      if (data) {
        setSelectedDriver(data.driverId ?? undefined);
        setSelectedCar(data.carId ?? undefined);
        setSelectedDeparture(data.place_of_departure ?? undefined);
        setSelectedArrival(data.place_of_arrival ?? undefined);
        if (data.date) setDate(new Date(data.date));
      }
    };
    loadData();
  }, [data]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driver: data?.driverId ?? undefined,
      car: data?.carId ?? undefined,
      place_of_departure: data?.place_of_departure ?? undefined,
      place_of_arrival: data?.place_of_arrival ?? undefined,
      hour_of_departure: data?.hour_of_departure?.slice(0, 5) ?? "00:00",
      hour_of_arrival: data?.hour_of_arrival?.slice(0, 5) ?? "00:00",
      collection_point: data?.collection_point ?? "",
      drop_off_point: data?.drop_off_point ?? "",
      price: data?.price ? Number(data.price) : 0,
      available_seats: data?.available_seats ?? 1,
      date: date,
      description: data?.description ?? "",
    },
  });

  useEffect(() => {
    if (selectedDriver !== undefined) form.setValue("driver", selectedDriver);
  }, [selectedDriver, form]);

  useEffect(() => {
    if (selectedCar !== undefined) form.setValue("car", selectedCar);
  }, [selectedCar, form]);

  useEffect(() => {
    if (selectedDeparture !== undefined)
      form.setValue("place_of_departure", selectedDeparture);
  }, [selectedDeparture, form]);

  useEffect(() => {
    if (selectedArrival !== undefined)
      form.setValue("place_of_arrival", selectedArrival);
  }, [selectedArrival, form]);

  useEffect(() => {
    form.setValue("date", date);
  }, [date, form]);

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      const [departureHours, departureMinutes] = values.hour_of_departure
        .split(":")
        .map(Number);
      const [arrivalHours, arrivalMinutes] = values.hour_of_arrival
        .split(":")
        .map(Number);

      const departureTimeInMinutes = departureHours * 60 + departureMinutes;
      const arrivalTimeInMinutes = arrivalHours * 60 + arrivalMinutes;

      let durationInMinutes = arrivalTimeInMinutes - departureTimeInMinutes;
      if (durationInMinutes < 0) {
        durationInMinutes += 24 * 60;
      }

      const actionFormData = {
        ...values,
        duration: durationInMinutes,
        driverId: values.driver,
        carId: values.car,
      };

      const result =
        operation === "create"
          ? await createRide(actionFormData)
          : await updateRide(data!.id!, actionFormData);

      if (result.error) {
        toast.error("Error!", { description: result.error });
        if (result.details) {
          Object.entries(result.details).forEach(([key, value]) => {
            form.setError(key as keyof FormData, {
              type: "manual",
              message: (value as { _errors: string[] })._errors.join(", "),
            });
          });
        }
      } else if (result.success) {
        toast.success("Success!", { description: result.success });
        if (operation === "create") {
          form.reset();
          setSelectedDriver(undefined);
          setSelectedCar(undefined);
          setSelectedDeparture(undefined);
          setSelectedArrival(undefined);
          setDate(new Date());
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
        toast.error("Error !", {
            description: "Oops ! Something went wrong.",
        });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="driver"
            render={({ field }) => (
              <FormItem className="flex flex-col md:col-span-2">
                <FormLabel>Driver</FormLabel>
                <Combobox
                  collection={drivers}
                  value={selectedDriver}
                  setValue={(value) => {
                    setSelectedDriver(value as number);
                    field.onChange(value);
                  }}
                  placeholder="Select a driver"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="car"
            render={({ field }) => (
              <FormItem className="flex flex-col md:col-span-2">
                <FormLabel>Car</FormLabel>
                <Combobox
                  collection={carsOptions}
                  value={selectedCar}
                  setValue={(value) => {
                    setSelectedCar(value as number);
                    field.onChange(value);
                  }}
                  placeholder="Select a car"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="place_of_departure"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Place of departure</FormLabel>
                <Combobox
                  collection={cities}
                  value={selectedDeparture}
                  setValue={(value) => {
                    setSelectedDeparture(value as number);
                    field.onChange(value);
                  }}
                  placeholder="Select place of departure"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="place_of_arrival"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Place of arrival</FormLabel>
                <Combobox
                  collection={cities}
                  value={selectedArrival}
                  setValue={(value) => {
                    setSelectedArrival(value as number);
                    field.onChange(value);
                  }}
                  placeholder="Select place of arrival"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collection_point"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection point</FormLabel>
                <FormControl>
                  <Input placeholder="Enter collection point" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drop_off_point"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop off point</FormLabel>
                <FormControl>
                  <Input placeholder="Enter drop off point" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="flex flex-col md:col-span-2">
            <FormLabel>Date</FormLabel>
            <DatePicker className="w-full" date={date} setDate={setDate} />
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="hour_of_departure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hour of departure</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hour_of_arrival"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hour of arrival</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available_seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of seats</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of seats"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter ride description (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white cursor-pointer"
        >
          {isSubmitting ? (
            <Loader size="sm" />
          ) : operation === "create" ? (
            "Create Ride"
          ) : (
            "Update Ride"
          )}
        </Button>
      </form>
    </Form>
  );
}
