import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/cashlane/types";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const categoryTone: Record<string, string> = {
  Templates: "from-accent-soft to-bg-subtle",
  Business: "from-bg-muted to-bg-elevated",
  Career: "from-bg-subtle to-bg-muted",
  Creator: "from-bg-elevated to-accent-soft",
};

export function ProductCard({ product }: { product: Product }) {
  const tone = categoryTone[product.category] ?? "from-bg-subtle to-bg-muted";
  return (
    <Link
      to="/shop/$productId"
      params={{ productId: product.id }}
      className="group block h-full"
    >
      <Card className="h-full overflow-hidden transition-colors hover:border-border-strong">
        <div
          className={`relative h-36 bg-gradient-to-br ${tone} border-b border-border`}
        >
          <div className="absolute inset-0 surface-grid opacity-60" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <Badge variant="outline" className="bg-bg/70 backdrop-blur-sm">
              {product.category}
            </Badge>
            <span className="font-mono text-sm tabular text-fg">
              {formatMoney(product.priceCents)}
            </span>
          </div>
        </div>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-snug tracking-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <ArrowUpRight className="size-4 shrink-0 text-fg-subtle opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
          </div>
          <p className="text-sm text-fg-muted line-clamp-2">{product.tagline}</p>
          <p className="text-xs text-fg-subtle">{product.delivery}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
