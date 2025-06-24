"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UsersForm from "./users-form";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import Loader from "./loader";

export default function UserEdit({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: () => apiClient.get(`/users/${id}`),
  });

  const user = query.data?.data.data;

  console.log(user);


  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      {user ? (
        <>
          <Card className="m-auto w-full max-w-96">
            <CardHeader>
              <CardTitle>Update user information</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
              <UsersForm data={user} operation="update" />
            </CardContent>
          </Card>
          <DangerZone id={user.id} collectionName="users" />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
