import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cartCount, useCashlane } from "@/lib/cashlane/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/invoices", label: "Invoices" },
] as const;

export function SiteHeader({ className }: { className?: string }) {
  const cart = useCashlane((s) => s.cart);
  const profile = useCashlane((s) => s.profile);
  const count = cartCount(cart);
  const { user, isPending } = useCurrentUserState();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 min-w-0 shrink-0"
          >
            <span className="grid size-8 place-items-center rounded-lg border border-border bg-bg-elevated">
              <span className="size-2 rounded-full bg-accent" />
            </span>
            <span className="font-display text-lg tracking-tight truncate">
              {profile.brandName}
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg hover:bg-bg-subtle"
                activeProps={{ className: "text-fg bg-bg-subtle" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart" aria-label={`Cart, ${count} items`}>
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg tabular">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-bg-muted" />
          ) : user ? (
            <UserButton />
          ) : (
            <Button variant="secondary" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
