import { Link } from "@tanstack/react-router";
import { useCashlane } from "@/lib/cashlane/store";

export function SiteFooter() {
  const profile = useCashlane((s) => s.profile);
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-base">{profile.brandName}</p>
          <p className="mt-1 text-sm text-fg-muted max-w-sm">
            {profile.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-fg-muted">
          <Link to="/shop" className="hover:text-fg transition-colors">
            Shop
          </Link>
          <Link to="/dashboard" className="hover:text-fg transition-colors">
            Dashboard
          </Link>
          <Link
            to="/dashboard/invoices"
            className="hover:text-fg transition-colors"
          >
            Invoices
          </Link>
          <span className="text-fg-subtle">{profile.supportEmail}</span>
        </div>
      </div>
    </footer>
  );
}
