import DeleteButton from "./delete-button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function DangerZone({
  id,
  collectionName,
}: {
  id: string;
  collectionName: string;
}) {
  return (
    <Card className="justify-self-end bg-red-500/40">
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 justify-between items-center">
        <div>
          <p className="text-xl text-red-500">
            This is a danger zone. You can delete the record here.
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            This action is irreversible and will delete all associated records.
          </p>
        </div>
        {id ? (
          <DeleteButton
            collectionName={collectionName}
            id={id}
            className="px-6"
          />
        ) : <></>}
      </CardContent>
    </Card>
  );
}
