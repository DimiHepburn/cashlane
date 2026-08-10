import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cartTotalCents,
  useCashlane,
} from "@/lib/cashlane/store";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const navigate = useNavigate();
  const cart = useCashlane((s) => s.cart);
  const products = useCashlane((s) => s.products);
  const setCartQty = useCashlane((s) => s.setCartQty);
  const removeFromCart = useCashlane((s) => s.removeFromCart);
  const checkout = useCashlane((s) => s.checkout);
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@example.com");
  const [busy, setBusy] = useState(false);

  const lines = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.productId);
      if (!p) return null;
      return { ...c, product: p };
    })
    .filter(Boolean) as {
    productId: string;
    qty: number;
    product: (typeof products)[number];
  }[];

  const total = cartTotalCents(cart, products);

  function handleCheckout(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email required");
      return;
    }
    setBusy(true);
    const order = checkout({
      customerName: name.trim(),
      customerEmail: email.trim(),
    });
    setBusy(false);
    if (!order) {
      toast.error("Cart is empty");
      return;
    }
    toast.success("Payment received", {
      description: `${formatMoney(order.totalCents)} · Order ${order.id.slice(-8)}`,
    });
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Cart
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Demo checkout simulates a real card charge and books the sale.
        </p>

        {lines.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-bg-elevated px-6 py-16 text-center">
            <p className="text-fg-muted">Your cart is empty.</p>
            <Button className="mt-4" asChild>
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              {lines.map(({ product, qty }) => (
                <Card key={product.id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        to="/shop/$productId"
                        params={{ productId: product.id }}
                        className="font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-fg-muted">
                        {formatMoney(product.priceCents)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setCartQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-8 text-center font-mono text-sm tabular">
                          {qty}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setCartQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                      <span className="w-20 text-right font-mono text-sm tabular">
                        {formatMoney(product.priceCents * qty)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-fg-muted hover:text-danger"
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="font-display text-xl">Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCheckout}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-fg-muted">Total</span>
                    <span className="font-mono text-xl tabular">
                      {formatMoney(total)}
                    </span>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={busy}>
                    {busy ? "Processing…" : "Pay now (demo)"}
                  </Button>
                  <p className="text-center text-xs text-fg-subtle">
                    No real charges. Sale is recorded locally for your dashboard.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
