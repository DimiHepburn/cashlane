import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Overview", exact: true },
  { to: "/dashboard/products", label: "Products", exact: false },
  { to: "/dashboard/invoices", label: "Invoices", exact: false },
] as const;

export function DashboardNav() {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-bg-elevated p-1">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.exact }}
          className={cn(
            "rounded-lg px-3.5 py-2 text-sm text-fg-muted transition-colors hover:text-fg",
          )}
          activeProps={{
            className: "bg-bg-muted text-fg font-medium",
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
