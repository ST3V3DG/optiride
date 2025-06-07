import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UsersForm from "./users-form";
import { Separator } from "@/components/ui/separator";
import DangerZone from "./danger-zone";
import { User } from "@/db/schema";
import NoData from "./no-data";

type UserProfileProps = {
  user?: User;
}

export default function UserEdit({ user }: UserProfileProps) {
  if (!user) {
    return (
      <NoData />
    );
  }

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      <Card className="max-w-[800px] w-full m-auto">
        <CardHeader>
          <CardTitle>Update user information</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {user && <UsersForm data={user} operation="update" />}
        </CardContent>
      </Card>
      <DangerZone id={Number(user.id)} collectionName="users" />
    </div>
  );
}
