"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
import { toast } from "sonner";
// import { Checkbox } from "./ui/checkbox";
import { createUser, updateUser } from "@/server/users";
import Loader from "./loader";
import { UserFormProps } from "@/lib/types";

// Base schema for common fields
const baseFormSchema = z.object({
  // nic_passport_number: z.string().min(9, {
  //   message: "NIC/Passport must be at least 9 characters.",
  // }),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  // phone: z.string().min(9, {
  //   message: "Phone must be at least 9 characters.",
  // }),
  email: z.string().email(),
  // role: z.enum(["user", "driver", "admin"], {
  //   message: "Type must be one of: user, driver, admin.",
  // }),
  // validated: z.boolean(),
});

// For create operations, password is required
const createFormSchema = baseFormSchema.extend({
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

// For update operations, password is optional
const updateFormSchema = baseFormSchema.extend({
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters.",
    })
    .optional(),
});

export default function UsersForm({ data, operation }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form values type
  type FormValues = {
    name: string;
    email: string;
    password?: string;
  };

  // Use the appropriate schema based on operation
  const formSchema = operation === "create" ? createFormSchema : updateFormSchema;

  // 1. Define your form.
<<<<<<< HEAD
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Re-validate on change
    criteriaMode: "all", // Collect all errors
    shouldFocusError: true, // Focus first error field
    shouldUnregister: true, // Unregister fields when they are removed from the form
=======
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
>>>>>>> fix-build-errors
    defaultValues: {
      name: data?.name ?? "",
      password: "",
      email: data?.email ?? "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      if (operation === "update") {
        // For update operations
        if (!data || typeof data.id !== "number") {
          toast("Error!", {
            description: "User ID is missing for update.",
          });
          return;
        }

        // If password is empty string, remove it from the values to avoid updating with empty password
        const updateValues = { ...values };
        if (!updateValues.password) {
          delete updateValues.password;
        }

        // Call the server action to update the user
        const result = await updateUser(String(data.id), updateValues);

        if (result.success) {
          toast("Success!", {
            description: result.success,
          });
        } else if (result.error) {
          toast("Error!", {
            description: result.error,
          });
          // If there are field-specific errors, you could set them on the form
          if (result.details) {
            console.error("Validation errors:", result.details);
          }
        }
      } else if (operation === "create") {
        // For create operations
        const result = await createUser({name: values.name, email: values.email, password: String(values.password)});

        if (result.success) {
          toast("Success!", {
            description: result.success,
          });
          // Optionally reset the form after successful creation
          form.reset();
        } else if (result.error) {
          toast("Error!", {
            description: result.error,
          });
          // If there are field-specific errors, you could set them on the form
          if (result.details) {
            console.error("Validation errors:", result.details);
          }
        }
      }
    } catch (error) {
      console.error(
        `Error ${operation === "create" ? "creating" : "updating"} user:`,
        error
      );
      toast.error("Error !", {
        description: "Oops ! Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // No longer need a separate toggleValidationStatus function as we're using FormField for validated

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter the username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter the password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center hover:cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormDescription>Keep this secret.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter the user email address" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="float-right hover:cursor-pointer text-white md:col-span-2"
          type="submit"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? (
            <Loader size="sm" />
          ) : operation === "create" ? (
            "Create User"
          ) : (
            "Update User"
          )}
        </Button>
      </form>
    </Form>
  );
}
