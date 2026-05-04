interface Props {
  className?: string;
  variant?: "full" | "mark";
}

export function Logo({ className, variant = "full" }: Props) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 40 40"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 6 L32 6 L32 26 C32 32 27 36 20 36 C13 36 8 32 8 26 Z"
          fill="#0F4C5C"
        />
        <path
          d="M14 12 L26 12 L26 23 C26 26.5 23.5 29 20 29 C16.5 29 14 26.5 14 23 Z"
          fill="#F76B53"
        />
        <circle cx="20" cy="20" r="2" fill="#FBFAF7" />
      </svg>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      dir="ltr"
    >
      <svg
        viewBox="0 0 40 40"
        className="h-full w-auto shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 6 L32 6 L32 26 C32 32 27 36 20 36 C13 36 8 32 8 26 Z"
          fill="#0F4C5C"
        />
        <path
          d="M14 12 L26 12 L26 23 C26 26.5 23.5 29 20 29 C16.5 29 14 26.5 14 23 Z"
          fill="#F76B53"
        />
        <circle cx="20" cy="20" r="2" fill="#FBFAF7" />
      </svg>
      <span
        className="font-extrabold text-[22px] tracking-tight text-ink leading-none"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Dojan
      </span>
    </span>
  );
}
