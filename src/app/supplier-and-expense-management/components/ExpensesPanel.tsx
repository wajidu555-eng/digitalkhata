'use client';
import React, { useMemo, useState } from 'react';
import { Paperclip, Receipt, Search, Undo2 } from 'lucide-react';
import type { Expense } from '@/lib/mockData';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import EmptyState from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { expenseByCategory } from '@/lib/mockData';
import ExpenseCategoryChart from './ExpenseCategoryChart';

const currencyFilters = ['All', 'AFN', 'PKR', 'USD'] as const;

export default function ExpensesPanel({
  loading,
  rows,
  onAdd,
  onDelete,
}: {
  loading: boolean;
  rows: Expense[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const [cur, setCur] = useState<(typeof currencyFilters)[number]>('All');
  const [category, setCategory] = useState('All');
  const [removing, setRemoving] = useState<string | null>(null);

  const categories = useMemo(() => ['All', ...Array.from(new Set(rows.map((r) => r.category)))], [rows]);

  const filtered = useMemo(
    () =>
      rows.filter((e) => {
        const mq =
          q.trim() === '' ||
          e.description.toLowerCase().includes(q.toLowerCase()) ||
          e.ref.toLowerCase().includes(q.toLowerCase());
        const mc = cur === 'All' || e.currency === cur;
        const mcat = category === 'All' || e.category === category;
        return mq && mc && mcat;
      }),
    [rows, q, cur, category]
  );

  const totals = useMemo(() => {
    const t: Record<string, number> = { AFN: 0, PKR: 0, USD: 0 };
    filtered.forEach((e) => {
      t[e.currency] += e.amount;
    });
    return t;
  }, [filtered]);

  const handleDelete = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      onDelete(id);
      setRemoving(null);
    }, 260);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Spend by category</h2>
              <p className="text-sm text-muted-foreground">AFN-denominated expenses · 21–28 Oct</p>
            </div>
            <Badge tone="info">AFN only</Badge>
          </div>
          <div className="mt-3">
            <ExpenseCategoryChart data={expenseByCategory} />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Filtered totals</h2>
          <p className="text-sm text-muted-foreground">Never combined across currencies</p>
          <dl className="mt-4 space-y-3">
            {(['AFN', 'PKR', 'USD'] as const).map((c) => (
              <div key={`tot-${c}`} className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
                <dt className="text-sm font-bold">{c}</dt>
                <dd className={`tabular text-lg font-bold ${totals[c] === 0 ? 'text-muted-foreground' : ''}`}>
                  {totals[c].toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            {filtered.length} of {rows.length} expenses · receipts attached to{' '}
            {filtered.filter((e) => e.hasReceipt).length}
          </p>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-60 flex-1">
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search description or reference"
              aria-label="Search expenses"
              className="h-10 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-ring"
          >
            {categories.map((c) => (
              <option key={`cat-${c}`} value={c}>
                {c === 'All' ? 'All categories' : c}
              </option>
            ))}
          </select>
          <div className="inline-flex rounded-lg border border-input bg-background p-0.5" role="group" aria-label="Currency filter">
            {currencyFilters.map((c) => (
              <button
                key={`ecf-${c}`}
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

        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Receipt size={22} />}
              title="No expenses recorded"
              description="Record rent, wages, freight or customs costs to see where the money goes each week."
              action={
                <button
                  onClick={onAdd}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all active:scale-95"
                >
                  Add expense
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-5 py-2.5 text-start font-semibold">Date</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Reference</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Category</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Description</th>
                  <th className="px-3 py-2.5 text-end font-semibold">Amount</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Method</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Recorded by</th>
                  <th className="px-3 py-2.5 text-start font-semibold">Receipt</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className={`group transition-all duration-300 odd:bg-card even:bg-muted/20 hover:bg-muted/60 ${
                      removing === e.id ? 'max-h-0 opacity-0' : 'opacity-100'
                    }`}
                  >
                    <td className="tabular whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">{e.date}</td>
                    <td className="px-3 py-3 font-mono text-xs font-semibold">{e.ref}</td>
                    <td className="px-3 py-3">
                      <Badge tone="neutral" dot={false}>
                        {e.category}
                      </Badge>
                    </td>
                    <td className="max-w-64 truncate px-3 py-3">{e.description}</td>
                    <td className="tabular whitespace-nowrap px-3 py-3 text-end font-bold">
                      {e.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                      <span className="text-xs font-semibold text-muted-foreground">{e.currency}</span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{e.method}</td>
                    <td className="px-3 py-3 text-muted-foreground">{e.recordedBy}</td>
                    <td className="px-3 py-3">
                      {e.hasReceipt ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                          <Paperclip size={12} /> Attached
                        </span>
                      ) : (
                        <span className="text-xs text-warning">Missing</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                        <Tooltip label="Reverse expense — original is kept in audit log">
                          <button
                            onClick={() => handleDelete(e.id)}
                            aria-label={`Reverse expense ${e.ref}`}
                            className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
                          >
                            <Undo2 size={15} />
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