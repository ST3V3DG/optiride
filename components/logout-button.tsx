"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { apiClient } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCookie } from "@/lib/helpers";

export default function LogoutButton({ className, variant }: { className?: string, variant? : 'glow' | 'default' | 'outline' }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => {
      return apiClient.get("/csrf-cookie").then(() => apiClient.post("/logout"));
    },
    onSuccess: () => {
      toast.success("Success!", {
        description: "User logged out.",
      });
      deleteCookie("token");
      deleteCookie("XSRF-TOKEN");
      deleteCookie("laravel_session");
      router.push("/login");
    },
    onError: (error) => {
      toast.error("Error!", {
        description: "Oops ! Something went wrong.",
      });
      console.log(error);
    },
  });
  return (
    <Button
      className={className}
      variant={variant}
      onClick={() => mutation.mutate()}>
      Déconnexion
    </Button>
  );
}
