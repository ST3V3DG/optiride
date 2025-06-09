"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UsersForm from "./users-form";
import { Separator } from "@/components/ui/separator";

export default function UsersCreate() {

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      <Card className="max-w-96 w-full m-auto">
        <CardHeader>
          <CardTitle>Create user information</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <UsersForm operation="create" />
        </CardContent>
      </Card>
    </div>
  );
}
