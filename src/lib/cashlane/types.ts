export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  category: string;
  delivery: string;
  featured: boolean;
  sales: number;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type Order = {
  id: string;
  items: { productId: string; name: string; priceCents: number; qty: number }[];
  totalCents: number;
  customerEmail: string;
  customerName: string;
  createdAt: string;
  status: "paid" | "refunded";
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Invoice = {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  project: string;
  amountCents: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  notes: string;
};

export type BankAccount = {
  accountName: string;
  sortCode: string;
  accountNumber: string;
  bankName: string;
  /** Always true — this account is for inbound payouts only */
  receiveOnly: true;
};

export type StoreProfile = {
  brandName: string;
  tagline: string;
  ownerName: string;
  supportEmail: string;
  monthlyGoalCents: number;
  bank: BankAccount;
};
