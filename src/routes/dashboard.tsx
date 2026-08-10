import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  monthRevenueCents,
  useCashlane,
} from "@/lib/cashlane/store";
import { formatDate, formatMoney } from "@/lib/utils";
import { ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex = pathname === "/dashboard" || pathname === "/dashboard/";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-tight">
              Seller dashboard
            </h1>
            <p className="mt-1 text-sm text-fg-muted">
              Revenue, products, and client invoices in one place.
            </p>
          </div>
          <DashboardNav />
        </div>
        {isIndex ? <DashboardHome /> : <Outlet />}
      </main>
      <SiteFooter />
    </div>
  );
}

function DashboardHome() {
  const orders = useCashlane((s) => s.orders);
  const invoices = useCashlane((s) => s.invoices);
  const products = useCashlane((s) => s.products);
  const profile = useCashlane((s) => s.profile);
  const updateProfile = useCashlane((s) => s.updateProfile);
  const resetDemo = useCashlane((s) => s.resetDemo);

  const monthRev = monthRevenueCents(orders, invoices);
  const productRev = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + o.totalCents, 0);
  const invoicePaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amountCents, 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + i.amountCents, 0);
  const goalPct = Math.min(
    100,
    Math.round((monthRev / Math.max(profile.monthlyGoalCents, 1)) * 100),
  );

  const chartData = buildChartData(orders, invoices);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="This month"
          value={formatMoney(monthRev)}
          hint={`${goalPct}% of goal`}
        />
        <StatCard
          label="Product sales"
          value={formatMoney(productRev)}
          hint={`${orders.length} orders`}
        />
        <StatCard
          label="Invoices paid"
          value={formatMoney(invoicePaid)}
          hint={`${invoices.filter((i) => i.status === "paid").length} paid`}
        />
        <StatCard
          label="Outstanding"
          value={formatMoney(outstanding)}
          hint="Sent + overdue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="font-display text-lg">Revenue trend</CardTitle>
            <Badge variant="outline">Last 14 days</Badge>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--color-border)"
                  vertical={false}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--color-fg-subtle)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-fg-subtle)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-elevated)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-fg)",
                  }}
                  formatter={(value: number) => [formatMoney(value), "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="cents"
                  stroke="var(--color-accent)"
                  fill="url(#revFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Monthly goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <p className="font-mono text-3xl tabular tracking-tight">
                {formatMoney(monthRev)}
              </p>
              <p className="text-sm text-fg-muted">
                of {formatMoney(profile.monthlyGoalCents)}
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <label className="block space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-muted">
                Goal amount (USD)
              </span>
              <input
                type="number"
                min={100}
                step={100}
                className="flex h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm"
                value={Math.round(profile.monthlyGoalCents / 100)}
                onChange={(e) =>
                  updateProfile({
                    monthlyGoalCents: Math.max(
                      100,
                      Math.round(Number(e.target.value) || 0) * 100,
                    ),
                  })
                }
              />
            </label>
            <div className="flex flex-col gap-2">
              <Button asChild variant="secondary">
                <Link to="/shop">
                  Make a demo sale
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  resetDemo();
                  toast.message("Demo data reset");
                }}
              >
                <RotateCcw />
                Reset demo data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/shop">Shop</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            {orders.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-fg-muted">
                No product orders yet. Checkout from the shop to book a sale.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {orders.slice(0, 5).map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {o.customerName}
                      </p>
                      <p className="text-xs text-fg-subtle">
                        {formatDate(o.createdAt)} · {o.items.length} item
                        {o.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="font-mono text-sm tabular">
                      {formatMoney(o.totalCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">
              Top products
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/products">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            <ul className="divide-y divide-border">
              {[...products]
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5)
                .map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-fg-subtle">
                        {p.sales} sold · {formatMoney(p.priceCents)}
                      </p>
                    </div>
                    <span className="font-mono text-sm tabular text-fg-muted">
                      {formatMoney(p.sales * p.priceCents)}
                    </span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs uppercase tracking-wide text-fg-subtle">{label}</p>
        <p className="mt-1 font-mono text-2xl tabular tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-fg-muted">{hint}</p>
      </CardContent>
    </Card>
  );
}

function buildChartData(
  orders: { createdAt: string; totalCents: number; status: string }[],
  invoices: { issuedAt: string; amountCents: number; status: string }[],
) {
  const days: { key: string; label: string; cents: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cents: 0,
    });
  }
  const map = new Map(days.map((d) => [d.key, d]));
  for (const o of orders) {
    if (o.status !== "paid") continue;
    const key = o.createdAt.slice(0, 10);
    const row = map.get(key);
    if (row) row.cents += o.totalCents;
  }
  for (const inv of invoices) {
    if (inv.status !== "paid") continue;
    const key = inv.issuedAt.slice(0, 10);
    const row = map.get(key);
    if (row) row.cents += inv.amountCents;
  }
  return days;
}
