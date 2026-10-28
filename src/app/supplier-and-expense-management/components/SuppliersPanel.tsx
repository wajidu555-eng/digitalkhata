'use client';
import React, { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, HandCoins, Search, Truck, Eye, FileText } from 'lucide-react';
import { suppliers, type Supplier } from '@/lib/mockData';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import EmptyState from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

const statusFilters = ['All', 'Overdue', 'Due soon', 'Current'] as const;

function tone(s: Supplier['status']) {
  if (s === 'Overdue') return 'danger' as const;
  if (s === 'Due soon') return 'warning' as const;
  return 'success' as const;
}

export default function SuppliersPanel({
  loading,
  onPay,
}: {
  loading: boolean;
  onPay: (name: string) => void;
}) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('All');

  const rows = useMemo(
    () =>
      suppliers.filter((s) => {
        const mq =
          q.trim() === '' ||
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.category.toLowerCase().includes(q.toLowerCase());
        const ms = status === 'All' || s.status === status;
        return mq && ms;
      }),
    [q, status]
  );

  const overdueCount = suppliers.filter((s) => s.status === 'Overdue').length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">PAYABLE · PKR</p>
          <p className="tabular mt-1 text-xl font-bold">3,440,000.00</p>
          <p className="text-xs text-muted-foreground">3 suppliers</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">PAYABLE · USD</p>
          <p className="tabular mt-1 text-xl font-bold">4,800.00</p>
          <p className="text-xs text-muted-foreground">1 supplier</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">PAYABLE · AFN</p>
          <p className="tabular mt-1 text-xl font-bold">203,300.00</p>
          <p className="text-xs text-muted-foreground">2 suppliers</p>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-medium tracking-wide text-destructive">OVERDUE SUPPLIERS</p>
            <AlertTriangle size={16} className="text-destructive" />
          </div>
          <p className="mt-1 text-xl font-bold text-destructive">{overdueCount} of {suppliers.length}</p>
          <p className="text-xs text-destructive">Lahore Edible Oil is 8 days late</p>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-60 flex-1">
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search supplier or category"
              aria-label="Search suppliers"
              className="h-10 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="inline-flex rounded-lg border border-input bg-background p-0.5" role="group" aria-label="Supplier status">
            {statusFilters.map((s) => (
              <button
                key={`sf-${s}`}
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                  status === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Truck size={22} />}
              title="No suppliers match"
              description="Change the status filter or add a supplier to start tracking what you owe."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-5 py-2.5 text-start font-semibold">Supplier</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Category</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Phone</th>
                  <th className="px-3 py-2.5 text-end font-semibold">We owe (per currency)</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Last payment</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Next due</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Status</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((s) => (
                  <tr key={s.id} className="group transition-colors duration-150 odd:bg-card even:bg-muted/20 hover:bg-muted/60">
                    <td className="px-5 py-3">
                      <p className="font-semibold">{s.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {s.id} · {s.city}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{s.category}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground" dir="ltr">
                      {s.phone}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-end gap-0.5">
                        {s.owed.map((o) => (
                          <span key={`${s.id}-${o.currency}`} className={`tabular font-bold ${o.amount === 0 ? 'text-muted-foreground' : ''}`}>
                            {o.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                            <span className="rounded bg-secondary px-1 py-0.5 text-[10px] font-bold text-secondary-foreground">
                              {o.currency}
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="tabular whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{s.lastPayment}</td>
                    <td className="tabular whitespace-nowrap px-3 py-3 text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarClock size={12} className="text-muted-foreground" /> {s.nextDue}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={tone(s.status)}>{s.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                        <Tooltip label="Pay supplier">
                          <button
                            onClick={() => onPay(s.name)}
                            aria-label={`Pay ${s.name}`}
                            className="rounded-md p-1.5 text-primary transition-all hover:bg-primary/10 active:scale-95"
                          >
                            <HandCoins size={15} />
                          </button>
                        </Tooltip>
                        <Tooltip label="Statement">
                          <button
                            aria-label={`Statement for ${s.name}`}
                            className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
                          >
                            <FileText size={15} />
                          </button>
                        </Tooltip>
                        <Tooltip label="View supplier">
                          <button
                            aria-label={`View ${s.name}`}
                            className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
                          >
                            <Eye size={15} />
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
    </div>
  );
}