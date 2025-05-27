"use client";

import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { Button } from "./ui/button";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  return <Button className={className} onClick={() => authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push("/login"); // redirect to login page
      },
    },
  })}>Déconnexion</Button>;
}
