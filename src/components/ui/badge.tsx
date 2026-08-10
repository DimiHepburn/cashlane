import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-bg-subtle text-fg-muted",
        accent: "border-transparent bg-accent-soft text-accent",
        success: "border-transparent bg-accent-soft text-accent",
        warning: "border-transparent bg-bg-muted text-warning",
        danger: "border-transparent bg-danger-soft text-danger",
        outline: "border-border text-fg-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
