'use client';
import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Archive,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Paperclip,
  Phone,
  Users,
  Eye,
} from 'lucide-react';
import type { Customer } from '@/lib/mockData';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import EmptyState from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import type { SortKey } from './CustomerWorkspace';

interface Props {
  loading: boolean;
  rows: Customer[];
  total: number;
  selected: string[];
  onSelect: (ids: string[]) => void;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
  page: number;
  pageCount: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
  onOpen: (id: string) => void;
  onRecord: (id: string, kind: 'Credit Sale' | 'Payment') => void;
  onArchiveSelected: () => void;
  onClearFilters: () => void;
}

const optionalCols = [
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City' },
  { key: 'createdBy', label: 'Created by' },
] as const;

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={12} className="text-muted-foreground/60" />;
  return dir === 'asc' ? <ArrowUp size={12} className="text-primary" /> : <ArrowDown size={12} className="text-primary" />;
}

function agingBadge(days: number, status: Customer['status']) {
  if (status === 'Archived') return <Badge tone="neutral">Archived</Badge>;
  if (days >= 30) return <Badge tone="danger">{days} d overdue</Badge>;
  if (days > 0) return <Badge tone="warning">{days} d overdue</Badge>;
  return <Badge tone="success">Current</Badge>;
}

export default function CustomerTable(p: Props) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [colMenu, setColMenu] = useState(false);
  const show = (k: string) => !hidden.includes(k);
  const allOnPage = p.rows.length > 0 && p.rows.every((r) => p.selected.includes(r.id));
  const start = p.total === 0 ? 0 : (p.page - 1) * p.pageSize + 1;
  const end = Math.min(p.page * p.pageSize, p.total);

  const toggleAll = () => {
    if (allOnPage) p.onSelect(p.selected.filter((id) => !p.rows.some((r) => r.id === id)));
    else p.onSelect(Array.from(new Set([...p.selected, ...p.rows.map((r) => r.id)])));
  };
  const toggleOne = (id: string) =>
    p.onSelect(p.selected.includes(id) ? p.selected.filter((x) => x !== id) : [...p.selected, id]);

  const pages = Array.from({ length: p.pageCount }, (_, i) => i + 1);

  return (
    <section className="relative rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing <span className="tabular font-semibold text-foreground">{start}–{end}</span> of{' '}
          <span className="tabular font-semibold text-foreground">{p.total}</span> customers
        </p>
        <div className="relative">
          <button
            onClick={() => setColMenu(!colMenu)}
            className="flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-xs font-semibold transition-all hover:bg-muted active:scale-95"
          >
            <Columns3 size={14} /> Columns
          </button>
          {colMenu && (
            <div className="absolute end-0 z-20 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-lg modal-in">
              {optionalCols.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={show(c.key)}
                    onChange={() =>
                      setHidden(hidden.includes(c.key) ? hidden.filter((h) => h !== c.key) : [...hidden, c.key])
                    }
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {p.loading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : p.rows.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<Users size={22} />}
            title="No customers match these filters"
            description="Adjust the search or aging filter, or add a new customer to start recording credit sales."
            action={
              <button
                onClick={p.onClearFilters}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all active:scale-95"
              >
                Show all customers
              </button>
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <th className="w-10 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={allOnPage}
                    onChange={toggleAll}
                    aria-label="Select all customers on this page"
                    className="h-4 w-4 accent-primary"
                  />
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  <button onClick={() => p.onSort('name')} className="flex items-center gap-1.5">
                    Customer <SortIcon active={p.sortKey === 'name'} dir={p.sortDir} />
                  </button>
                </th>
                {show('phone') && <th className="px-3 py-2.5 text-start font-semibold">Phone</th>}
                {show('city') && <th className="px-3 py-2.5 text-start font-semibold">City</th>}
                <th className="px-3 py-2.5 text-end font-semibold">Outstanding balances (per currency)</th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  <button onClick={() => p.onSort('daysOverdue')} className="flex items-center gap-1.5">
                    Aging <SortIcon active={p.sortKey === 'daysOverdue'} dir={p.sortDir} />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  <button onClick={() => p.onSort('lastActivity')} className="flex items-center gap-1.5">
                    Last activity <SortIcon active={p.sortKey === 'lastActivity'} dir={p.sortDir} />
                  </button>
                </th>
                {show('createdBy') && <th className="px-3 py-2.5 text-start font-semibold">Created by</th>}
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {p.rows.map((c) => {
                const isSel = p.selected.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`group transition-colors duration-150 hover:bg-muted/60 ${
                      isSel ? 'bg-primary/5' : 'odd:bg-card even:bg-muted/20'
                    } ${c.status === 'Archived' ? 'opacity-70' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleOne(c.id)}
                        aria-label={`Select ${c.name}`}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => p.onOpen(c.id)} className="flex items-center gap-3 text-start">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                          {c.name
                            .split(' ')
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join('')}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 font-semibold hover:underline">
                            <span className="max-w-52 truncate">{c.name}</span>
                            {c.hasAttachment && <Paperclip size={12} className="text-muted-foreground" />}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                        </span>
                      </button>
                    </td>
                    {show('phone') && (
                      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground" dir="ltr">
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={12} /> {c.phone}
                        </span>
                      </td>
                    )}
                    {show('city') && <td className="px-3 py-3 text-muted-foreground">{c.city}</td>}
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-end gap-0.5">
                        {c.balances.map((b) => (
                          <span
                            key={`${c.id}-${b.currency}`}
                            className={`tabular text-sm font-bold ${b.amount === 0 ? 'text-muted-foreground' : ''}`}
                          >
                            {b.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                            <span className="rounded bg-secondary px-1 py-0.5 text-[10px] font-bold text-secondary-foreground">
                              {b.currency}
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3">{agingBadge(c.daysOverdue, c.status)}</td>
                    <td className="tabular whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{c.lastActivity}</td>
                    {show('createdBy') && <td className="px-3 py-3 text-muted-foreground">{c.createdBy}</td>}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                        <Tooltip label="Record payment">
                          <button
                            onClick={() => p.onRecord(c.id, 'Payment')}
                            disabled={c.status === 'Archived'}
                            aria-label={`Record payment for ${c.name}`}
                            className="rounded-md p-1.5 text-success transition-all hover:bg-success/10 active:scale-95 disabled:opacity-40"
                          >
                            <ArrowDownLeft size={15} />
                          </button>
                        </Tooltip>
                        <Tooltip label="Record credit sale">
                          <button
                            onClick={() => p.onRecord(c.id, 'Credit Sale')}
                            disabled={c.status === 'Archived'}
                            aria-label={`Record credit sale for ${c.name}`}
                            className="rounded-md p-1.5 text-primary transition-all hover:bg-primary/10 active:scale-95 disabled:opacity-40"
                          >
                            <ArrowUpRight size={15} />
                          </button>
                        </Tooltip>
                        <Tooltip label="Open statement">
                          <button
                            onClick={() => p.onOpen(c.id)}
                            aria-label={`Open statement for ${c.name}`}
                            className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
                          >
                            <Eye size={15} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!p.loading && p.total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Rows per page
            <select
              value={p.pageSize}
              onChange={(e) => p.onPageSize(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold text-foreground outline-none focus:border-ring"
            >
              {[5, 10, 25].map((n) => (
                <option key={`ps-${n}`} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => p.onPage(Math.max(1, p.page - 1))}
              disabled={p.page === 1}
              aria-label="Previous page"
              className="rounded-md border border-input p-1.5 transition-all hover:bg-muted active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft size={14} className="rtl:rotate-180" />
            </button>
            {pages.map((n) => (
              <button
                key={`pg-${n}`}
                onClick={() => p.onPage(n)}
                aria-current={n === p.page ? 'page' : undefined}
                className={`tabular h-8 min-w-8 rounded-md px-2 text-xs font-semibold transition-all active:scale-95 ${
                  n === p.page ? 'bg-primary text-primary-foreground' : 'border border-input hover:bg-muted'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => p.onPage(Math.min(p.pageCount, p.page + 1))}
              disabled={p.page === p.pageCount}
              aria-label="Next page"
              className="rounded-md border border-input p-1.5 transition-all hover:bg-muted active:scale-95 disabled:opacity-40"
            >
              <ChevronRight size={14} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {p.selected.length > 0 && (
        <div className="slide-up sticky bottom-4 z-10 mx-auto mb-4 flex w-fit items-center gap-4 rounded-lg bg-foreground px-4 py-2.5 text-background shadow-xl">
          <span className="text-sm font-semibold">{p.selected.length} selected</span>
          <button className="text-sm font-semibold transition-opacity hover:opacity-80">Export statements</button>
          <button
            onClick={p.onArchiveSelected}
            className="flex items-center gap-1.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
          >
            <Archive size={14} /> Archive
          </button>
          <button onClick={() => p.onSelect([])} className="text-sm text-background/70 hover:text-background">
            Clear
          </button>
        </div>
      )}
    </section>
  );
}