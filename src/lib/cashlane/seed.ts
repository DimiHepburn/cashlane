import type { Invoice, Product, StoreProfile } from "./types";

export const defaultProfile: StoreProfile = {
  brandName: "Cashlane",
  tagline: "Sell digital products. Invoice clients. Get paid.",
  ownerName: "You",
  supportEmail: "hello@cashlane.shop",
  monthlyGoalCents: 500_000,
};

export const seedProducts: Product[] = [
  {
    id: "prod_notion_os",
    name: "Life OS Notion System",
    tagline: "Goals, habits, and weekly reviews in one workspace",
    description:
      "A complete personal operating system for Notion: quarterly goals, habit loops, meeting notes, and a weekly review ritual. Instant PDF + duplicateable template link.",
    priceCents: 2900,
    category: "Templates",
    delivery: "Notion + PDF",
    featured: true,
    sales: 128,
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "prod_proposal_pack",
    name: "Freelance Proposal Pack",
    tagline: "Win more clients with ready-to-send proposals",
    description:
      "Five battle-tested proposal templates for design, writing, dev, and consulting gigs — plus a pricing sheet and objection-handling page. Google Docs + DOCX.",
    priceCents: 1900,
    category: "Business",
    delivery: "Google Docs + DOCX",
    featured: true,
    sales: 214,
    createdAt: "2026-04-02T10:00:00.000Z",
  },
  {
    id: "prod_pitch_deck",
    name: "Seed Pitch Deck Kit",
    tagline: "12-slide narrative that investors actually finish",
    description:
      "Story-first pitch structure with speaker notes, example metrics slides, and a one-pager leave-behind. Editable in Keynote, PowerPoint, and Figma.",
    priceCents: 3900,
    category: "Business",
    delivery: "Keynote + PPT + Figma",
    featured: true,
    sales: 87,
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    id: "prod_resume_bundle",
    name: "Resume + Cover Bundle",
    tagline: "ATS-friendly templates that still look premium",
    description:
      "Three resume layouts, matching cover letters, and a LinkedIn About section rewrite guide. Perfect for job switchers and freelancers rebranding.",
    priceCents: 1500,
    category: "Career",
    delivery: "DOCX + PDF",
    featured: false,
    sales: 301,
    createdAt: "2026-02-09T10:00:00.000Z",
  },
  {
    id: "prod_social_kit",
    name: "Creator Content OS",
    tagline: "30 days of posts planned in under an hour",
    description:
      "Content calendar, hook bank, carousel outlines, and a reusable batching workflow. Built for solo creators who want consistency without burnout.",
    priceCents: 2400,
    category: "Creator",
    delivery: "Notion + Canva",
    featured: false,
    sales: 156,
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "prod_invoice_kit",
    name: "Client Onboarding Kit",
    tagline: "Contracts, kickoff forms, and payment terms",
    description:
      "Everything you send after a yes: welcome packet, scope form, simple MSA language, and payment schedule templates. Stop chasing details.",
    priceCents: 2200,
    category: "Business",
    delivery: "PDF + Docs",
    featured: false,
    sales: 99,
    createdAt: "2026-01-22T10:00:00.000Z",
  },
];

export const seedInvoices: Invoice[] = [
  {
    id: "inv_1001",
    number: "CL-1042",
    clientName: "Northline Studio",
    clientEmail: "ops@northline.studio",
    project: "Brand site redesign",
    amountCents: 480_000,
    status: "sent",
    issuedAt: "2026-08-01T12:00:00.000Z",
    dueAt: "2026-08-15T12:00:00.000Z",
    notes: "50% on start already paid. This invoice is final milestone.",
  },
  {
    id: "inv_1002",
    number: "CL-1041",
    clientName: "Harbor Coffee",
    clientEmail: "maya@harbor.coffee",
    project: "Menu + packaging templates",
    amountCents: 125_000,
    status: "paid",
    issuedAt: "2026-07-18T12:00:00.000Z",
    dueAt: "2026-08-01T12:00:00.000Z",
    notes: "Paid via ACH.",
  },
  {
    id: "inv_1003",
    number: "CL-1040",
    clientName: "Kite Analytics",
    clientEmail: "finance@kite.io",
    project: "Q3 dashboard prototype",
    amountCents: 320_000,
    status: "overdue",
    issuedAt: "2026-07-01T12:00:00.000Z",
    dueAt: "2026-07-20T12:00:00.000Z",
    notes: "Follow up scheduled.",
  },
];
