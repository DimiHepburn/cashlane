import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowRight,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCashlane } from "@/lib/cashlane/store";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const products = useCashlane((s) => s.products);
  const profile = useCashlane((s) => s.profile);
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const totalCatalog = products.reduce((s, p) => s + p.priceCents, 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 surface-grid" />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="max-w-2xl space-y-6">
              <Badge variant="accent" className="w-fit">
                Online income desk
              </Badge>
              <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
                Start selling online today — products, invoices, revenue.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
                {profile.tagline} Launch a digital storefront, bill clients, and
                track what you earned this month — all in one calm workspace.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/shop">
                    Browse the shop
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/dashboard">Open seller dashboard</Link>
                </Button>
              </div>
              <dl className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="rounded-xl border border-border bg-bg-elevated/80 p-3">
                  <dt className="text-[11px] uppercase tracking-wide text-fg-subtle">
                    Products
                  </dt>
                  <dd className="mt-1 font-mono text-lg tabular">
                    {products.length}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-bg-elevated/80 p-3">
                  <dt className="text-[11px] uppercase tracking-wide text-fg-subtle">
                    Catalog
                  </dt>
                  <dd className="mt-1 font-mono text-lg tabular">
                    {formatMoney(totalCatalog)}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-bg-elevated/80 p-3">
                  <dt className="text-[11px] uppercase tracking-wide text-fg-subtle">
                    Goal
                  </dt>
                  <dd className="mt-1 font-mono text-lg tabular">
                    {formatMoney(profile.monthlyGoalCents)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <PlayStep
                icon={<Package className="size-4" />}
                title="Sell downloads"
                body="Templates and kits with demo checkout. Sales land on your dashboard."
              />
              <PlayStep
                icon={<FileText className="size-4" />}
                title="Invoice clients"
                body="Bill freelance projects and mark invoices paid when money lands."
              />
              <PlayStep
                icon={<TrendingUp className="size-4" />}
                title="Hit a goal"
                body="Track monthly revenue against a target you can edit anytime."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Featured products
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                Ready-made digital goods — sell as-is or replace with your own.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/shop">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-bg-elevated/40">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Card className="border-border bg-bg">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="max-w-xl">
                  <h2 className="font-display text-2xl tracking-tight">
                    Try the full money loop
                  </h2>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                    Buy a product as a customer, then open the dashboard to see
                    the sale. Create an invoice for a client project and mark it
                    paid. Data saves in this browser.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row shrink-0">
                  <Button asChild>
                    <Link to="/shop">Make a sale</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link to="/dashboard/invoices">Create invoice</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PlayStep({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated/90 p-4 sm:p-5">
      <span className="grid size-9 place-items-center rounded-lg border border-border bg-bg-subtle text-fg">
        {icon}
      </span>
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-fg-muted leading-relaxed">{body}</p>
    </div>
  );
}
