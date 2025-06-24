"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Loader from "./loader";
import { UserFormProps } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { Label } from "./ui/label";

export default function UsersForm({ data, operation }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      return apiClient
        .get("/csrf-cookie")
        .then(() => apiClient.post("/users", data));
    },
    onSuccess: () => {
      toast.success("Success!", {
        description: "User created successfully.",
      });
      // Reset form after successful creation
      form.reset();
    },
    onError: (error) => {
      console.error("Create user error:", error);

      // Handle validation errors (422)
      // if (error.response?.status === 422) {
      //   const validationErrors = error.response.data.errors;
      //   if (validationErrors) {
      //     // Display specific validation errors
      //     Object.entries(validationErrors).forEach(([field, messages]) => {
      //       toast.error(`${field}: ${(messages as string[]).join(', ')}`);
      //     });
      //   } else {
      //     toast.error("Validation failed. Please check your input.");
      //   }
      // } else {
      //   toast.error("Error!", {
      //     description: "User creation failed.",
      //   });
      // }
      toast.error("Error!", {
        description: "User creation failed.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      email: string;
      password?: string;
      password_confirmation?: string;
    }) => {
      // Remove empty password fields for updates
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password_confirmation;
      }

      return apiClient
        .get("/csrf-cookie")
        .then(() => apiClient.put(`/users/${data.id}`, updateData));
    },
    onSuccess: () => {
      toast.success("Success!", {
        description: "User updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Update user error:", error);

      // Handle validation errors (422)
      // if (error.response?.status === 422) {
      //   const validationErrors = error.response.data.errors;
      //   if (validationErrors) {
      //     // Display specific validation errors
      //     Object.entries(validationErrors).forEach(([field, messages]) => {
      //       toast.error(`${field}: ${(messages as string[]).join(", ")}`);
      //     });
      //   } else {
      //     toast.error("Validation failed. Please check your input.");
      //   }
      // } else {
      //   toast.error("Error!", {
      //     description: "User update failed.",
      //   });
      // }
      toast.error("Error!", {
        description: "User update failed.",
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      password: "",
      password_confirmation: "",
    },
    onSubmit: async (value) => {
      try {
        if (operation === "update") {
          if (!data || typeof data.id !== "number") {
            toast.error("Error!", {
              description: "User ID is missing for update.",
            });
            return;
          }

          updateMutation.mutate({
            id: String(data.id),
            name: value.value.name,
            email: value.value.email,
            password: value.value.password,
            password_confirmation: value.value.password_confirmation,
          });
        } else if (operation === "create") {
          createMutation.mutate({
            name: value.value.name,
            email: value.value.email,
            password: value.value.password,
            password_confirmation: value.value.password_confirmation,
          });
        }
      } catch (error) {
        console.error(
          `Error ${operation === "create" ? "creating" : "updating"} user:`,
          error
        );
        toast.error("Error!", {
          description: "Something went wrong.",
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-4 space-y-2">
      <form.Field
        name="name"
        validators={{
          onSubmitAsync: async ({ value }) =>
            !value
              ? "The name field is required"
              : value.length < 4
              ? "The name field should have minimum 4 characters"
              : undefined,
        }}>
        {(field) => (
          <div className="flex flex-col gap-4 justify-between items-start">
            <Label htmlFor={field.name}>Name:</Label>
            <Input
              placeholder="Enter the username"
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {!field.state.meta.isValid && (
              <p className="text-sm text-red-500/90">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onSubmitAsync: async ({ value }) =>
            !value
              ? "The email field is required"
              : !/\S+@\S+\.\S+/.test(value)
              ? "Enter a valid email"
              : undefined,
        }}>
        {(field) => (
          <div className="flex flex-col gap-4 justify-between items-start">
            <Label htmlFor={field.name}>Email:</Label>
            <Input
              placeholder="Enter the user email address"
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {!field.state.meta.isValid && (
              <p className="text-sm text-red-500/90">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onSubmitAsync: async ({ value }) =>
            !value && operation === "create"
              ? "The password field is required"
              : value && value.length < 8
              ? "The password field should have minimum 8 characters"
              : undefined,
        }}>
        {(field) => (
          <div className="flex flex-col gap-4 justify-between items-start">
            <Label htmlFor={field.name}>Password:</Label>
            <div className="relative w-full">
              <Input
                placeholder="Enter the password"
                id={field.name}
                type={showPassword ? "text" : "password"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <button
                type="button"
                className="flex absolute inset-y-0 right-0 items-center px-3 hover:cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {!field.state.meta.isValid && (
              <p className="text-sm text-red-500/90">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password_confirmation"
        validators={{
          onChangeListenTo: ["password"],
          onChange: ({ value, fieldApi }) => {
            const password = fieldApi.form.getFieldValue("password");

            if (!password) return undefined; // No validation if password is empty

            if (!value && operation === "create") {
              return "The password confirmation field is required";
            }

            if (value && value.length < 8) {
              return "Password confirmation must be at least 8 characters";
            }

            if (value !== password) {
              return "Passwords do not match";
            }

            return undefined;
          },
        }}>
        {(field) => (
          <div className="flex flex-col gap-4 justify-between items-start">
            <Label htmlFor={field.name}>Password confirmation:</Label>
            <div className="relative w-full">
              <Input
                placeholder="Confirm the password"
                id={field.name}
                type={showPassword ? "text" : "password"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <button
                type="button"
                className="flex absolute inset-y-0 right-0 items-center px-3 hover:cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {!field.state.meta.isValid && (
              <p className="text-sm text-red-500/90">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <Button
        className="float-right text-white hover:cursor-pointer"
        type="submit"
        disabled={createMutation.isPending || updateMutation.isPending}>
        {createMutation.isPending || updateMutation.isPending ? (
          <Loader size="sm" />
        ) : operation === "create" ? (
          "Create User"
        ) : (
          "Update User"
        )}
      </Button>
    </form>
  );
}
