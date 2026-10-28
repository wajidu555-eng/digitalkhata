'use client';
import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, RotateCcw, Search, Eye, Undo2, ReceiptText } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import EmptyState from '@/components/ui/EmptyState';
import { ledgerRows, type LedgerRow } from '@/lib/mockData';

const typeFilters = ['All', 'Credit Sale', 'Payment', 'Reversal'] as const;
const currencyFilters = ['All', 'AFN', 'PKR', 'USD'] as const;

function typeIcon(t: LedgerRow['type']) {
  if (t === 'Payment') return <ArrowDownLeft size={14} className="text-success" />;
  if (t === 'Reversal') return <RotateCcw size={14} className="text-warning" />;
  return <ArrowUpRight size={14} className="text-primary" />;
}

export default function RecentLedgerTable() {
  const [q, setQ] = useState('');
  const [type, setType] = useState<(typeof typeFilters)[number]>('All');
  const [cur, setCur] = useState<(typeof currencyFilters)[number]>('All');

  const rows = useMemo(
    () =>
      ledgerRows.filter((r) => {
        const matchQ =
          q.trim() === '' ||
          r.customer.toLowerCase().includes(q.toLowerCase()) ||
          r.ref.toLowerCase().includes(q.toLowerCase());
        const matchT = type === 'All' || r.type === type;
        const matchC = cur === 'All' || r.currency === cur;
        return matchQ && matchT && matchC;
      }),
    [q, type, cur]
  );

  return (
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent ledger entries</h2>
            <p className="text-sm text-muted-foreground">Immutable · corrections appear as reversals</p>
          </div>
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            {rows.length} of {ledgerRows.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by customer or reference"
              aria-label="Filter ledger entries"
              className="h-9 w-full rounded-lg border border-input bg-background ps-8 pe-3 text-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="inline-flex rounded-lg border border-input bg-background p-0.5" role="group" aria-label="Type filter">
            {typeFilters.map((t) => (
              <button
                key={`tf-${t}`}
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                  type === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-lg border border-input bg-background p-0.5" role="group" aria-label="Currency filter">
            {currencyFilters.map((c) => (
              <button
                key={`cf-${c}`}
                onClick={() => setCur(c)}
                aria-pressed={cur === c}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                  cur === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<ReceiptText size={22} />}
            title="No ledger entries match"
            description="Try a different customer, reference or currency. Entries appear here the moment they are posted."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <th className="px-5 py-2.5 text-start font-semibold">Reference</th>
                <th className="px-3 py-2.5 text-start font-semibold">Customer</th>
                <th className="px-3 py-2.5 text-start font-semibold">Type</th>
                <th className="px-3 py-2.5 text-end font-semibold">Amount</th>
                <th className="px-3 py-2.5 text-start font-semibold">Method</th>
                <th className="px-3 py-2.5 text-start font-semibold">Posted by</th>
                <th className="px-3 py-2.5 text-start font-semibold">Posted at</th>
                <th className="px-3 py-2.5 text-start font-semibold">Status</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="group transition-colors duration-150 odd:bg-card even:bg-muted/20 hover:bg-muted/60">
                  <td className="px-5 py-3 font-mono text-xs font-semibold">{r.ref}</td>
                  <td className="max-w-48 truncate px-3 py-3 font-medium">{r.customer}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                      {typeIcon(r.type)} {r.type}
                    </span>
                  </td>
                  <td
                    className={`tabular whitespace-nowrap px-3 py-3 text-end font-bold ${
                      r.direction === 'decrease' ? 'text-success' : 'text-foreground'
                    }`}
                  >
                    {r.direction === 'decrease' ? '−' : '+'}
                    {r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    <span className="text-xs font-semibold text-muted-foreground">{r.currency}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{r.method}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.postedBy}</td>
                  <td className="tabular whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{r.postedAt}</td>
                  <td className="px-3 py-3">
                    <Badge tone={r.status === 'Posted' ? 'success' : 'neutral'}>{r.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                      <Tooltip label="View entry">
                        <button className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-card hover:text-foreground active:scale-95" aria-label="View entry">
                          <Eye size={14} />
                        </button>
                      </Tooltip>
                      <Tooltip label="Post reversal">
                        <button
                          disabled={r.status === 'Reversed'}
                          className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-card hover:text-destructive active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Post reversal"
                        >
                          <Undo2 size={14} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}