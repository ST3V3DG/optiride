import { TriangleAlert } from "lucide-react";

export default function NoData() {
    return (
      <p className="flex items-center place-content-center justify-center gap-2 py-4 font-bold text-foreground/50">
        <TriangleAlert />
        <span>No data available</span>
      </p>
    );
}