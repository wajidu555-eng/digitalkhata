import React from 'react';
import type { Customer, CurrencyCode } from '@/lib/mockData';

function sumFor(rows: Customer[], code: CurrencyCode): number {
  return rows
    .filter((c) => c.status === 'Active')
    .reduce((acc, c) => acc + (c.balances.find((b) => b.currency === code)?.amount ?? 0), 0);
}

export default function CustomerSummaryStrip({ rows }: { rows: Customer[] }) {
  const active = rows.filter((c) => c.status === 'Active');
  const overdue = active.filter((c) => c.daysOverdue >= 30).length;
  const settled = active.filter((c) => c.balances.every((b) => b.amount === 0)).length;
  const stats = [
    { id: 'ss-active', label: 'Active customers', value: active.length.toString(), note: `${rows.length - active.length} archived`, tone: 'bg-card' },
    { id: 'ss-afn', label: 'Owed in AFN', value: sumFor(rows, 'AFN').toLocaleString('en-US', { minimumFractionDigits: 2 }), note: 'AFN ledger only', tone: 'bg-card' },
    { id: 'ss-pkr', label: 'Owed in PKR', value: sumFor(rows, 'PKR').toLocaleString('en-US', { minimumFractionDigits: 2 }), note: 'PKR ledger only', tone: 'bg-card' },
    { id: 'ss-usd', label: 'Owed in USD', value: sumFor(rows, 'USD').toLocaleString('en-US', { minimumFractionDigits: 2 }), note: 'USD ledger only', tone: 'bg-card' },
    { id: 'ss-over', label: 'Overdue 30+ days', value: overdue.toString(), note: `${settled} fully settled`, tone: 'bg-destructive/10' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((s) => (
        <div key={s.id} className={`rounded-lg border border-border p-4 shadow-sm ${s.tone}`}>
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">{s.label}</p>
          <p className={`tabular mt-1 text-xl font-bold ${s.id === 'ss-over' && overdue > 0 ? 'text-destructive' : ''}`}>
            {s.value}
          </p>
          <p className="text-xs text-muted-foreground">{s.note}</p>
        </div>
      ))}
    </div>
  );
}