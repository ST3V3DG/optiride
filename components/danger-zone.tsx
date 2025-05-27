import DeleteButton from "./delete-button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function DangerZone({
  id,
  collectionName,
}: {
  id: number;
  collectionName: string;
}) {
  return (
    <Card className="bg-red-500/40 justify-self-end">
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center gap-4">
        <div>
          <p className="text-xl text-red-500">
            This is a danger zone. You can delete the record here.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            This action is irreversible and will delete all associated records.
          </p>
        </div>
        {id && (
          <DeleteButton
            collectionName={collectionName}
            id={id}
            className="px-6"
          />
        )}
      </CardContent>
    </Card>
  );
}
