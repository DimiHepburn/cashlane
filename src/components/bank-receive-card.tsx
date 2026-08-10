import { Building2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BankAccount } from "@/lib/cashlane/types";
import { cn } from "@/lib/utils";

function formatSortCode(sortCode: string) {
  const digits = sortCode.replace(/\D/g, "");
  if (digits.length !== 6) return sortCode;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
}

export function BankReceiveCard({
  bank,
  className,
  compact = false,
}: {
  bank: BankAccount;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Card className={cn("bg-bg-elevated", className)}>
      <CardHeader className={cn("pb-2", compact && "p-4 pb-1")}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <Building2 className="size-4 text-fg-muted" />
            Pay into this account
          </CardTitle>
          <Badge variant="accent" className="gap-1">
            <ShieldCheck className="size-3" />
            Receive only
          </Badge>
        </div>
        {!compact && (
          <p className="text-sm text-fg-muted">
            Bank transfer instructions for clients. Inbound payments only — never
            used to send money out.
          </p>
        )}
      </CardHeader>
      <CardContent className={cn("space-y-3", compact && "p-4 pt-2")}>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-fg-subtle">
              Account name
            </dt>
            <dd className="mt-0.5 font-medium">{bank.accountName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-fg-subtle">
              Bank
            </dt>
            <dd className="mt-0.5 font-medium">{bank.bankName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-fg-subtle">
              Sort code
            </dt>
            <dd className="mt-0.5 font-mono tabular tracking-wide">
              {formatSortCode(bank.sortCode)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-fg-subtle">
              Account number
            </dt>
            <dd className="mt-0.5 font-mono tabular tracking-wide">
              {bank.accountNumber}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-fg-subtle leading-relaxed">
          Reference the invoice number when paying. Card checkout in the shop is
          demo-only until a payment processor is connected; client invoices use
          this bank account for real transfers.
        </p>
      </CardContent>
    </Card>
  );
}

export function invoicePaymentNote(bank: BankAccount, invoiceNumber: string) {
  return [
    "Payment by bank transfer (receive only):",
    `Account name: ${bank.accountName}`,
    `Sort code: ${formatSortCode(bank.sortCode)}`,
    `Account number: ${bank.accountNumber}`,
    `Bank: ${bank.bankName}`,
    `Reference: ${invoiceNumber}`,
  ].join("\n");
}
