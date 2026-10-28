'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, FileText, Paperclip, Phone, MapPin, Printer, X, History, Wallet } from 'lucide-react';
import { ledgerRows, type Customer } from '@/lib/mockData';
import Badge from '@/components/ui/Badge';

const tabs = ['Balances', 'Statement', 'Attachments'] as const;

export default function CustomerDrawer({
  customer,
  onClose,
  onRecord,
}: {
  customer: Customer | null;
  onClose: () => void;
  onRecord: (id: string, kind: 'Credit Sale' | 'Payment') => void;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Balances');
  const [cur, setCur] = useState<'All' | 'AFN' | 'PKR' | 'USD'>('All');

  useEffect(() => {
    if (!customer) return;
    setTab('Balances');
    setCur('All');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [customer, onClose]);

  const stmt = useMemo(() => {
    if (!customer) return [];
    return ledgerRows.filter(
      (r) => r.customer === customer.name && (cur === 'All' || r.currency === cur)
    );
  }, [customer, cur]);

  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 fade-in" role="dialog" aria-modal="true" aria-label={`${customer.name} details`}>
      <button aria-label="Close drawer" className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <aside className="slide-up absolute inset-y-0 end-0 flex w-full max-w-xl flex-col bg-card shadow-2xl">
        <div className="border-b border-border p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {customer.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </span>
              <div>
                <h2 className="text-lg font-semibold">{customer.name}</h2>
                <p className="font-mono text-xs text-muted-foreground">{customer.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5" dir="ltr">
              <Phone size={13} /> {customer.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> {customer.city}
            </span>
            {customer.daysOverdue >= 30 ? (
              <Badge tone="danger">{customer.daysOverdue} d overdue</Badge>
            ) : customer.daysOverdue > 0 ? (
              <Badge tone="warning">{customer.daysOverdue} d overdue</Badge>
            ) : (
              <Badge tone="success">Current</Badge>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onRecord(customer.id, 'Payment')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-success-foreground transition-all hover:opacity-95 active:scale-95"
            >
              <ArrowDownLeft size={15} /> Record payment
            </button>
            <button
              onClick={() => onRecord(customer.id, 'Credit Sale')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-95"
            >
              <ArrowUpRight size={15} /> Credit sale
            </button>
            <button
              aria-label="Print statement"
              className="rounded-lg border border-input px-3 py-2 transition-all hover:bg-muted active:scale-95"
            >
              <Printer size={15} />
            </button>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border px-5" role="tablist">
          {tabs.map((t) => (
            <button
              key={`dt-${t}`}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'Balances' && (
            <div className="space-y-3 fade-in">
              <p className="text-xs text-muted-foreground">
                One balance row per currency (UNIQUE business · customer · currency). A payment in one currency never
                reduces another.
              </p>
              {customer.balances.map((b) => (
                <div key={`db-${customer.id}-${b.currency}`} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Wallet size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground">{b.currency} balance owed</p>
                    <p className="tabular text-2xl font-bold">
                      {b.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {b.amount === 0 ? <Badge tone="success">Settled</Badge> : <Badge tone="warning">Open</Badge>}
                </div>
              ))}
              <dl className="grid grid-cols-2 gap-3 rounded-lg bg-muted/60 p-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Last activity</dt>
                  <dd className="tabular font-semibold">{customer.lastActivity}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Created by</dt>
                  <dd className="font-semibold">{customer.createdBy}</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === 'Statement' && (
            <div className="fade-in">
              <div className="mb-3 inline-flex rounded-lg border border-input bg-background p-0.5" role="group" aria-label="Statement currency">
                {(['All', 'AFN', 'PKR', 'USD'] as const).map((c) => (
                  <button
                    key={`sc-${c}`}
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
              {stmt.length === 0 ? (
                <div className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center">
                  <History size={22} className="text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">No entries in this period</p>
                  <p className="text-xs text-muted-foreground">Post a credit sale or payment to start the statement.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {stmt.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          r.direction === 'decrease' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {r.direction === 'decrease' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{r.type}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {r.ref} · {r.postedAt}
                        </p>
                      </div>
                      <p
                        className={`tabular text-sm font-bold ${r.direction === 'decrease' ? 'text-success' : ''}`}
                      >
                        {r.direction === 'decrease' ? '−' : '+'}
                        {r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {r.currency}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'Attachments' && (
            <div className="fade-in">
              {customer.hasAttachment ? (
                <ul className="space-y-2">
                  {[
                    { id: 'att-1', name: 'national-id-scan.pdf', size: '412 KB' },
                    { id: 'att-2', name: 'trade-licence-2026.jpg', size: '1.2 MB' },
                  ].map((a) => (
                    <li key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <FileText size={18} className="text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.size} · private · signed URL expires in 5 min</p>
                      </div>
                      <button className="rounded-md border border-input px-2.5 py-1 text-xs font-semibold transition-all hover:bg-muted active:scale-95">
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center">
                  <Paperclip size={22} className="text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">No attachments yet</p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Upload an ID copy, trade licence or signed delivery note. Files stay private in Cloudflare R2.
                  </p>
                  <button className="mt-3 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all active:scale-95">
                    Upload document
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}