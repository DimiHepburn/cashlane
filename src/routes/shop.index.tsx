import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCashlane } from "@/lib/cashlane/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/")({ component: ShopPage });

function ShopPage() {
  const products = useCashlane((s) => s.products);
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Digital shop
          </h1>
          <p className="mt-2 text-fg-muted">
            Instant-download products. Add to cart, checkout, and the sale lands
            in your seller dashboard.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              className={cn(category === c && "pointer-events-none")}
            >
              {c}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-fg-muted">
            No products in this category yet. Add one from the dashboard.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
