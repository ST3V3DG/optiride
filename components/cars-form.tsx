// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Combobox } from "@/components/combobox";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import Loader from "./loader";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Car, Option } from "@/lib/types"



// const formSchema = z.object({
//   driverId: z.number().min(1, "Driver is required."),
//   brand: z.string().min(1, "Brand is required."),
//   model: z.string().min(1, "Model is required."),
//   year: z.coerce
//     .number()
//     .min(1900, "Year must be after 1900")
//     .max(new Date().getFullYear() + 1, "Year cannot be in the distant future"),
//   registration: z.string().min(1, "Registration plate is required."),
//   comfort: z.enum(["standard", "premium", "luxury"]).optional(),
//   available_seats: z.coerce
//     .number()
//     .int()
//     .min(1, "Number of seats must be at least 1")
//     .max(100, "Too many seats"),
// });

// type FormData = z.infer<typeof formSchema>;

// export default function CarsForm({
//   data,
//   operation,
// }: {
//   data?: Car;
//   operation: "create" | "update";
// }) {
//   const [selectedDriver, setSelectedDriver] = useState<number | undefined>(
//     data?.driver.id ?? undefined
//   );
//   const [drivers, setDrivers] = useState<Option[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       const driversResult = await getDriversAction();

//       if (driversResult.success && driversResult.data) {
//         setDrivers(
//           driversResult.data
//             .map((d) => ({ id: d.id, label: d.name ?? "N/A" }))
//             .filter((d) => d.label !== "N/A")
//         );
//       } else {
//         toast.error("Error fetching drivers", {
//           description: driversResult.error,
//         });
//       }

//       if (data) {
//         setSelectedDriver(data.driver.id ?? undefined);
//       }
//     };
//     loadData();
//   }, [data]);

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       driverId: data?.driver.id ?? undefined,
//       brand: data?.brand ?? "",
//       model: data?.model ?? "",
//       year: data?.year ? Number(data.year) : Number(new Date().getFullYear()),
//       registration: data?.registration ?? "",
//       comfort: data?.comfort ?? "standard",
//       available_seats: data?.available_seats ?? 1,
//     },
//   });

//   useEffect(() => {
//     if (selectedDriver !== undefined) form.setValue("driverId", selectedDriver);
//   }, [selectedDriver, form]);

//   async function onSubmit(values: FormData) {
//     setIsSubmitting(true);
//     try {
//       const actionFormData = {
//         ...values,
//       };

//       const result =
//         operation === "create"
//           ? await createCar(actionFormData)
//           : await updateCar(data!.id!, actionFormData);

//       if (result.error) {
//         toast.error("Error!", { description: result.error });
//         if (result.details && result.details.fieldErrors) {
//           Object.entries(result.details.fieldErrors).forEach(([key, value]) => {
//             if (value) {
//               form.setError(key as keyof FormData, {
//                 type: "manual",
//                 message: value.join(", "),
//               });
//             }
//           });
//         }
//       } else if (result.success) {
//         toast.success("Success !", { description: result.success });
//         if (operation === "create") {
//           form.reset({
//             driverId: undefined,
//             brand: "",
//             model: "",
//             year: undefined,
//             registration: "",
//             comfort: "standard",
//             available_seats: 1,
//           });
//           setSelectedDriver(undefined);
//         }
//       }
//     } catch (error) {
//       console.error("Error during form submission:", error);
//       toast.error("Error!", {
//         description: "Oops ! Something went wrong.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="driverId"
//             render={({ field }) => (
//               <FormItem className="flex flex-col md:col-span-2">
//                 <FormLabel>Driver</FormLabel>
//                 <Combobox
//                   collection={drivers}
//                   className="dark:bg-input/30"
//                   value={selectedDriver}
//                   setValue={(value) => {
//                     setSelectedDriver(value as number);
//                     field.onChange(value);
//                   }}
//                   placeholder="Select a driver"
//                 />
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="brand"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Brand</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter car brand (e.g., Toyota)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="model"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Model</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter car model (e.g., Camry)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="year"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Year of Manufacture</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="Enter year (e.g., 2023)"
//                     {...field}
//                     onChange={(e) =>
//                       field.onChange(parseInt(e.target.value, 10) || undefined)
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="registration"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Registration Plate</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter registration (e.g., ABC 123)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="available_seats"
//             render={({ field }) => (
//               <FormItem className="md:col-span-2">
//                 <FormLabel>Number of Seats</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="Enter number of seats"
//                     {...field}
//                     onChange={(e) =>
//                       field.onChange(parseInt(e.target.value, 10) || 1)
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="comfort"
//             render={({ field }) => (
//               <FormItem className="md:col-span-2">
//                 <FormLabel>Comfort Level</FormLabel>
//                 <FormControl>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select comfort level" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="standard">Standard</SelectItem>
//                       <SelectItem value="premium">Premium</SelectItem>
//                       <SelectItem value="luxury">Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full text-white cursor-pointer"
//         >
//           {isSubmitting ? (
//             <Loader size="sm" />
//           ) : operation === "create" ? (
//             "Create Car"
//           ) : (
//             "Update Car"
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// }
