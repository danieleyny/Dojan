import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function RatingStars({
  value,
  count,
  size = "sm",
  className,
  showValue = true,
}: Props) {
  const px = { sm: "size-3.5", md: "size-4", lg: "size-5" }[size];
  const text = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];
  return (
    <div className={cn("inline-flex items-center gap-1", text, className)}>
      <Star className={cn(px, "fill-warning stroke-warning")} />
      {showValue && (
        <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-ink-subtle">({count})</span>
      )}
    </div>
  );
}
