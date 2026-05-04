import { cn } from "@/lib/utils";

interface Props {
  color?: string;
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
  variant?: "solid" | "soft" | "outline";
}

export function DisciplinePill({
  color = "#0F4C5C",
  children,
  size = "sm",
  className,
  variant = "soft",
}: Props) {
  const sizes = {
    sm: "h-6 px-2.5 text-[11px]",
    md: "h-8 px-3.5 text-sm",
  }[size];

  if (variant === "solid") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium text-white",
          sizes,
          className,
        )}
        style={{ background: color }}
      >
        {children}
      </span>
    );
  }
  if (variant === "outline") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium border bg-surface",
          sizes,
          className,
        )}
        style={{
          color,
          borderColor: `${color}40`,
        }}
      >
        <span
          className="size-1.5 rounded-full me-1.5"
          style={{ background: color }}
        />
        {children}
      </span>
    );
  }
  // soft (default)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizes,
        className,
      )}
      style={{
        background: `${color}14`,
        color,
      }}
    >
      <span
        className="size-1.5 rounded-full me-1.5"
        style={{ background: color }}
      />
      {children}
    </span>
  );
}
