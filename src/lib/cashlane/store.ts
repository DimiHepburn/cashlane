import { create } from "zustand";
import { persist } from "zustand/middleware";
import { businessBank, defaultProfile, seedInvoices, seedProducts } from "./seed";
import type {
  CartItem,
  Invoice,
  InvoiceStatus,
  Order,
  Product,
  StoreProfile,
} from "./types";
import { uid } from "@/lib/utils";

type CashlaneState = {
  profile: StoreProfile;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  invoices: Invoice[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  updateProfile: (patch: Partial<StoreProfile>) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  checkout: (input: { customerName: string; customerEmail: string }) => Order | null;
  addProduct: (input: Omit<Product, "id" | "sales" | "createdAt">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addInvoice: (
    input: Omit<Invoice, "id" | "number" | "issuedAt" | "status"> & {
      status?: InvoiceStatus;
    },
  ) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  resetDemo: () => void;
};

function withBank(profile: StoreProfile | (Omit<StoreProfile, "bank"> & { bank?: StoreProfile["bank"] })): StoreProfile {
  return {
    ...defaultProfile,
    ...profile,
    ownerName: profile.ownerName || defaultProfile.ownerName,
    bank: {
      ...businessBank,
      ...(profile.bank ?? {}),
      receiveOnly: true as const,
    },
  };
}

export const useCashlane = create<CashlaneState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      products: seedProducts,
      cart: [],
      orders: [],
      invoices: seedInvoices,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      updateProfile: (patch) =>
        set((s) => ({
          profile: withBank({
            ...s.profile,
            ...patch,
            bank: patch.bank
              ? { ...businessBank, ...patch.bank, receiveOnly: true as const }
              : s.profile.bank,
          }),
        })),
      addToCart: (productId) =>
        set((s) => {
          const existing = s.cart.find((c) => c.productId === productId);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.productId === productId ? { ...c, qty: c.qty + 1 } : c,
              ),
            };
          }
          return { cart: [...s.cart, { productId, qty: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),
      setCartQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => c.productId !== productId)
              : s.cart.map((c) =>
                  c.productId === productId ? { ...c, qty } : c,
                ),
        })),
      clearCart: () => set({ cart: [] }),
      checkout: ({ customerName, customerEmail }) => {
        const { cart, products } = get();
        if (cart.length === 0) return null;
        const items = cart
          .map((c) => {
            const p = products.find((x) => x.id === c.productId);
            if (!p) return null;
            return {
              productId: p.id,
              name: p.name,
              priceCents: p.priceCents,
              qty: c.qty,
            };
          })
          .filter(Boolean) as Order["items"];
        if (items.length === 0) return null;
        const totalCents = items.reduce(
          (sum, i) => sum + i.priceCents * i.qty,
          0,
        );
        const order: Order = {
          id: uid("ord"),
          items,
          totalCents,
          customerEmail,
          customerName,
          createdAt: new Date().toISOString(),
          status: "paid",
        };
        set((s) => ({
          orders: [order, ...s.orders],
          cart: [],
          products: s.products.map((p) => {
            const sold = items.find((i) => i.productId === p.id);
            return sold ? { ...p, sales: p.sales + sold.qty } : p;
          }),
        }));
        return order;
      },
      addProduct: (input) =>
        set((s) => ({
          products: [
            {
              ...input,
              id: uid("prod"),
              sales: 0,
              createdAt: new Date().toISOString(),
            },
            ...s.products,
          ],
        })),
      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),
      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          cart: s.cart.filter((c) => c.productId !== id),
        })),
      addInvoice: (input) =>
        set((s) => {
          const n = 1040 + s.invoices.length + 1;
          const inv: Invoice = {
            id: uid("inv"),
            number: `CL-${n}`,
            clientName: input.clientName,
            clientEmail: input.clientEmail,
            project: input.project,
            amountCents: input.amountCents,
            status: input.status ?? "sent",
            issuedAt: new Date().toISOString(),
            dueAt: input.dueAt,
            notes: input.notes,
          };
          return { invoices: [inv, ...s.invoices] };
        }),
      setInvoiceStatus: (id, status) =>
        set((s) => ({
          invoices: s.invoices.map((i) =>
            i.id === id ? { ...i, status } : i,
          ),
        })),
      deleteInvoice: (id) =>
        set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) })),
      resetDemo: () =>
        set({
          profile: defaultProfile,
          products: seedProducts,
          cart: [],
          orders: [],
          invoices: seedInvoices,
        }),
    }),
    {
      name: "cashlane-v1",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.profile = withBank(state.profile);
          state.setHydrated(true);
        }
      },
      partialize: (s) => ({
        profile: s.profile,
        products: s.products,
        cart: s.cart,
        orders: s.orders,
        invoices: s.invoices,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CashlaneState>;
        return {
          ...current,
          ...p,
          profile: withBank(p.profile ?? current.profile),
        };
      },
    },
  ),
);

export function cartCount(cart: CartItem[]) {
  return cart.reduce((n, c) => n + c.qty, 0);
}

export function cartTotalCents(cart: CartItem[], products: Product[]) {
  return cart.reduce((sum, c) => {
    const p = products.find((x) => x.id === c.productId);
    return sum + (p ? p.priceCents * c.qty : 0);
  }, 0);
}

export function monthRevenueCents(orders: Order[], invoices: Invoice[]) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const orderSum = orders
    .filter((o) => {
      const d = new Date(o.createdAt);
      return o.status === "paid" && d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((s, o) => s + o.totalCents, 0);
  const invSum = invoices
    .filter((i) => {
      const d = new Date(i.issuedAt);
      return i.status === "paid" && d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((s, i) => s + i.amountCents, 0);
  return orderSum + invSum;
}
