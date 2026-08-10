import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCashlane } from "@/lib/cashlane/store";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const products = useCashlane((s) => s.products);
  const addProduct = useCashlane((s) => s.addProduct);
  const deleteProduct = useCashlane((s) => s.deleteProduct);
  const updateProduct = useCashlane((s) => s.updateProduct);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("19");
  const [category, setCategory] = useState("Templates");
  const [delivery, setDelivery] = useState("PDF + link");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    if (!name.trim() || priceCents <= 0) {
      toast.error("Name and price are required");
      return;
    }
    addProduct({
      name: name.trim(),
      tagline: tagline.trim() || "Digital download",
      description:
        description.trim() ||
        "A ready-to-use digital product delivered instantly after purchase.",
      priceCents,
      category: category.trim() || "General",
      delivery: delivery.trim() || "Download",
      featured: false,
    });
    toast.success("Product published");
    setName("");
    setTagline("");
    setDescription("");
    setPrice("19");
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl tracking-tight">Products</h2>
          <p className="text-sm text-fg-muted">
            What you sell in the public shop.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen((v) => !v)}>
          <Plus />
          {open ? "Close form" : "New product"}
        </Button>
      </div>

      {open && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create product</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pname">Name</Label>
                <Input
                  id="pname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Freelance rate calculator"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ptag">Tagline</Label>
                <Input
                  id="ptag"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Price projects with confidence"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pprice">Price (USD)</Label>
                <Input
                  id="pprice"
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pcat">Category</Label>
                <Input
                  id="pcat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdel">Delivery</Label>
                <Input
                  id="pdel"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pdesc">Description</Label>
                <Textarea
                  id="pdesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What the buyer gets…"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Publish product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="hidden grid-cols-[1.4fr_0.6fr_0.5fr_0.5fr_auto] gap-3 border-b border-border bg-bg-elevated px-4 py-2.5 text-xs uppercase tracking-wide text-fg-subtle sm:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Sales</span>
          <span className="sr-only">Actions</span>
        </div>
        <ul className="divide-y divide-border bg-card">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid gap-3 px-4 py-4 sm:grid-cols-[1.4fr_0.6fr_0.5fr_0.5fr_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-xs text-fg-muted">{p.tagline}</p>
              </div>
              <div>
                <Badge variant="outline">{p.category}</Badge>
              </div>
              <p className="font-mono text-sm tabular">
                {formatMoney(p.priceCents)}
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm tabular text-fg-muted">
                  {p.sales}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="sm:hidden"
                  onClick={() =>
                    updateProduct(p.id, { featured: !p.featured })
                  }
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </Button>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="hidden sm:inline-flex"
                  onClick={() =>
                    updateProduct(p.id, { featured: !p.featured })
                  }
                >
                  {p.featured ? "Featured" : "Feature"}
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-fg-muted hover:text-danger"
                  aria-label={`Delete ${p.name}`}
                  onClick={() => {
                    deleteProduct(p.id);
                    toast.message("Product removed");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
