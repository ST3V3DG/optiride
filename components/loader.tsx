import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  className?: string;
}

const sizeMap = {
  sm: "size-4",
  md: "size-8",
  lg: "size-16",
  xl: "size-24",
};

export default function Loader({
  size = "lg",
  // variant = "light",
  className,
}: LoaderProps) {
  return (
    <div className="flex h-full w-full items-center justify-center min-w-22">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-secondary border-t-transparent",
          sizeMap[size],
          className
        )}
      />
    </div>
  );
}
