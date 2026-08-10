import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCashlane } from "@/lib/cashlane/store";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/shop/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = useCashlane((s) => s.products.find((p) => p.id === productId));
  const addToCart = useCashlane((s) => s.addToCart);

  if (!product) {
    throw notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link to="/shop">
            <ArrowLeft />
            Back to shop
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative min-h-64 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            <div className="absolute inset-0 surface-grid opacity-70" />
            <div className="relative flex h-full min-h-72 flex-col justify-between p-6 sm:p-8">
              <Badge variant="outline" className="w-fit bg-bg/60">
                {product.category}
              </Badge>
              <div>
                <p className="font-mono text-3xl tabular tracking-tight">
                  {formatMoney(product.priceCents)}
                </p>
                <p className="mt-1 text-sm text-fg-muted">{product.delivery}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl tracking-tight sm:text-4xl text-balance">
                {product.name}
              </h1>
              <p className="mt-3 text-lg text-fg-muted">{product.tagline}</p>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted sm:text-base">
              {product.description}
            </p>

            <ul className="space-y-2 text-sm text-fg-muted">
              {[
                "Instant download after checkout",
                "Commercial use for your clients",
                "Lifetimeable — sales tracked in your dashboard",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="sm:flex-1"
                onClick={() => {
                  addToCart(product.id);
                  toast.success("Added to cart", {
                    description: product.name,
                  });
                }}
              >
                <ShoppingBag />
                Add to cart
              </Button>
              <Button size="lg" variant="secondary" asChild className="sm:flex-1">
                <Link to="/cart">Go to cart</Link>
              </Button>
            </div>

            <Card className="bg-bg-elevated">
              <CardContent className="flex items-center justify-between gap-4 p-4 text-sm">
                <span className="text-fg-muted">Lifetime sales (demo)</span>
                <span className="font-mono tabular">{product.sales}</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
