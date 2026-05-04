import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-accent-600 shadow-[0_8px_24px_-8px_rgb(247_107_83_/_0.5)] active:translate-y-px",
        ink: "bg-ink text-white hover:bg-brand-700 active:translate-y-px",
        brand:
          "bg-brand text-white hover:bg-brand-500 active:translate-y-px",
        outline:
          "border border-border bg-surface text-ink hover:border-ink-muted",
        ghost: "text-ink-muted hover:bg-surface-2 hover:text-ink",
        link: "text-brand hover:underline underline-offset-4 px-0",
      },
      size: {
        sm: "h-9 text-sm px-4",
        md: "h-11 text-[15px] px-5",
        lg: "h-14 text-base px-7",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(button({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export const buttonStyles = button;
