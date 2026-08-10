import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BankReceiveCard,
  invoicePaymentNote,
} from "@/components/bank-receive-card";
import { useCashlane } from "@/lib/cashlane/store";
import type { InvoiceStatus } from "@/lib/cashlane/types";
import { formatDate, formatMoney, cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/invoices")({
  component: InvoicesPage,
});

const statusVariant: Record<
  InvoiceStatus,
  "default" | "success" | "warning" | "danger" | "outline"
> = {
  draft: "outline",
  sent: "default",
  paid: "success",
  overdue: "danger",
};

function InvoicesPage() {
  const invoices = useCashlane((s) => s.invoices);
  const profile = useCashlane((s) => s.profile);
  const addInvoice = useCashlane((s) => s.addInvoice);
  const setInvoiceStatus = useCashlane((s) => s.setInvoiceStatus);
  const deleteInvoice = useCashlane((s) => s.deleteInvoice);
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("2500");
  const [notes, setNotes] = useState("");
  const [dueDays, setDueDays] = useState("14");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    const amountCents = Math.round(parseFloat(amount || "0") * 100);
    if (!clientName.trim() || !project.trim() || amountCents <= 0) {
      toast.error("Client, project, and amount are required");
      return;
    }
    const due = new Date();
    due.setDate(due.getDate() + Math.max(1, parseInt(dueDays || "14", 10)));
    addInvoice({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || "client@example.com",
      project: project.trim(),
      amountCents,
      dueAt: due.toISOString(),
      notes: notes.trim(),
      status: "sent",
    });
    toast.success("Invoice sent", {
      description: `${clientName} · ${formatMoney(amountCents)} — pay to Monzo Business`,
    });
    setClientName("");
    setClientEmail("");
    setProject("");
    setAmount("2500");
    setNotes("");
    setOpen(false);
  }

  const totalOpen = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + i.amountCents, 0);

  async function copyPaymentDetails(invoiceNumber: string) {
    const text = invoicePaymentNote(profile.bank, invoiceNumber);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Payment details copied", {
        description: "Send to your client for bank transfer",
      });
    } catch {
      toast.message("Copy failed — details are on the invoice card");
    }
  }

  return (
    <div className="space-y-6">
      <BankReceiveCard bank={profile.bank} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl tracking-tight">Invoices</h2>
          <p className="text-sm text-fg-muted">
            Bill clients for project work.{" "}
            <span className="text-fg">{formatMoney(totalOpen)} open</span>
            {" · "}paid into Monzo Business (receive only)
          </p>
        </div>
        <Button type="button" onClick={() => setOpen((v) => !v)}>
          <Plus />
          {open ? "Close form" : "New invoice"}
        </Button>
      </div>

      {open && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="cname">Client name</Label>
                <Input
                  id="cname"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Acme Co."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Client email</Label>
                <Input
                  id="cemail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="ops@acme.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="proj">Project</Label>
                <Input
                  id="proj"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Landing page redesign"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amt">Amount (USD)</Label>
                <Input
                  id="amt"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due">Due in (days)</Label>
                <Input
                  id="due"
                  type="number"
                  min="1"
                  value={dueDays}
                  onChange={(e) => setDueDays(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, milestone details…"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Send invoice</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {invoices.map((inv) => (
          <Card key={inv.id}>
            <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs text-fg-subtle">
                      {inv.number}
                    </p>
                    <Badge variant={statusVariant[inv.status]}>
                      {inv.status}
                    </Badge>
                  </div>
                  <p className="font-medium truncate">{inv.clientName}</p>
                  <p className="text-sm text-fg-muted truncate">{inv.project}</p>
                  <p className="text-xs text-fg-subtle">
                    Issued {formatDate(inv.issuedAt)} · Due{" "}
                    {formatDate(inv.dueAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                  <p className="font-mono text-xl tabular">
                    {formatMoney(inv.amountCents)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["sent", "paid", "overdue"] as InvoiceStatus[]).map(
                      (st) => (
                        <Button
                          key={st}
                          type="button"
                          size="sm"
                          variant={inv.status === st ? "default" : "outline"}
                          className={cn(
                            "capitalize",
                            inv.status === st && "pointer-events-none",
                          )}
                          onClick={() => {
                            setInvoiceStatus(inv.id, st);
                            toast.message(`Invoice marked ${st}`);
                          }}
                        >
                          {st}
                        </Button>
                      ),
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => void copyPaymentDetails(inv.number)}
                    >
                      <Copy className="size-3.5" />
                      Copy bank details
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-fg-muted hover:text-danger"
                      onClick={() => {
                        deleteInvoice(inv.id);
                        toast.message("Invoice deleted");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-bg-subtle/80 px-3 py-2.5 text-xs text-fg-muted leading-relaxed">
                <span className="font-medium text-fg">Bank transfer · </span>
                {profile.bank.accountName} · sort{" "}
                <span className="font-mono text-fg">
                  {profile.bank.sortCode}
                </span>{" "}
                · a/c{" "}
                <span className="font-mono text-fg">
                  {profile.bank.accountNumber}
                </span>{" "}
                · {profile.bank.bankName} · ref{" "}
                <span className="font-mono text-fg">{inv.number}</span>
                <span className="text-fg-subtle"> · receive only</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {invoices.length === 0 && (
          <p className="py-12 text-center text-sm text-fg-muted">
            No invoices yet. Create one to bill a client into your Monzo
            Business account.
          </p>
        )}
      </div>
    </div>
  );
}
