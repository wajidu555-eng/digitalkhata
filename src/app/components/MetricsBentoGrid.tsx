import React from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Landmark,
  Scale,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Sparkline from './Sparkline';

const receivables = [
  { id: 'rc-afn', code: 'AFN', amount: '864,550.00', delta: '+3.1%', up: true, spark: [8, 9, 8.6, 9.4, 9.1, 9.8, 10.2, 9.9, 10.6, 10.4] },
  { id: 'rc-pkr', code: 'PKR', amount: '2,027,800.00', delta: '-1.8%', up: false, spark: [22, 21.5, 21.8, 20.9, 21.2, 20.6, 20.9, 20.3, 20.5, 20.2] },
  { id: 'rc-usd', code: 'USD', amount: '9,605.00', delta: '+6.4%', up: true, spark: [6, 6.4, 6.2, 7.1, 7.4, 7.2, 8.1, 8.6, 9.0, 9.6] },
];

export default function MetricsBentoGrid() {
  return (
    <section aria-label="Key metrics" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Hero: receivables by currency (spans 2 cols, 2 rows tall on xl) */}
      <article className="rounded-lg border border-border bg-card p-5 shadow-sm md:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-muted-foreground">
              OUTSTANDING RECEIVABLES · BY CURRENCY
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              142 active customers · totals are never summed across currencies
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Landmark size={18} />
          </span>
        </div>
        <div className="mt-4 divide-y divide-border">
          {receivables?.map((r) => (
            <div key={r?.id} className="flex items-center gap-4 py-3">
              <span className="flex h-9 w-14 items-center justify-center rounded-md bg-secondary text-sm font-bold text-secondary-foreground">
                {r?.code}
              </span>
              <p className="tabular flex-1 text-2xl font-bold tracking-tight">{r?.amount}</p>
              <div className="hidden w-28 sm:block">
                <Sparkline data={r?.spark} positive={r?.up} />
              </div>
              <span
                className={`flex w-16 items-center justify-end gap-1 text-sm font-semibold ${
                  r?.up ? 'text-warning' : 'text-success'
                }`}
                title={r?.up ? 'Receivable grew — more money out on credit' : 'Receivable shrank — collections outpacing credit'}
              >
                {r?.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {r?.delta}
              </span>
            </div>
          ))}
        </div>
      </article>

      {/* Collections today */}
      <article className="rounded-lg border border-border bg-success/10 p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">COLLECTED TODAY</p>
          <ArrowDownLeft size={18} className="text-success" />
        </div>
        <p className="tabular mt-3 text-3xl font-bold">40,000.00</p>
        <p className="text-sm font-semibold text-success">AFN</p>
        <p className="mt-3 text-xs text-muted-foreground">
          1 payment · yesterday: <span className="tabular font-semibold">209,000.00 AFN</span>
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-success/20">
          <div className="h-1.5 w-[19%] rounded-full bg-success" />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">19% of yesterday&apos;s pace</p>
      </article>

      {/* Credit sales today */}
      <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">CREDIT SALES TODAY</p>
          <ArrowUpRight size={18} className="text-primary" />
        </div>
        <p className="tabular mt-3 text-3xl font-bold">86,500.00</p>
        <p className="text-sm font-semibold text-primary">AFN</p>
        <p className="mt-3 text-xs text-muted-foreground">
          1 invoice · 14-day avg: <span className="tabular font-semibold">122,300.00 AFN</span>
        </p>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">Net exposure today: +46,500.00 AFN</p>
      </article>

      {/* Overdue alert */}
      <article className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-[13px] font-medium tracking-wide text-destructive">OVERDUE 30+ DAYS</p>
          <AlertTriangle size={18} className="text-destructive" />
        </div>
        <p className="mt-3 text-3xl font-bold text-destructive">3 customers</p>
        <ul className="mt-3 space-y-1 text-xs">
          <li className="flex justify-between gap-2">
            <span className="truncate">Peshawar Cloth House</span>
            <span className="font-semibold">63 d</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="truncate">Haji Abdul Wali Traders</span>
            <span className="font-semibold">41 d</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="truncate">Khyber Spice Merchants</span>
            <span className="font-semibold">27 d</span>
          </li>
        </ul>
        <a href="/customer-management" className="mt-3 inline-block text-xs font-semibold text-destructive underline">
          Open collection list
        </a>
      </article>

      {/* Supplier payables */}
      <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-[13px] font-medium tracking-wide text-muted-foreground">SUPPLIER PAYABLES</p>
          <Clock3 size={18} className="text-warning" />
        </div>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">PKR</dt>
            <dd className="tabular font-bold">3,440,000.00</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">USD</dt>
            <dd className="tabular font-bold">4,800.00</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">AFN</dt>
            <dd className="tabular font-bold">203,300.00</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs font-semibold text-warning">2 suppliers overdue</p>
      </article>

      {/* Reconciliation (spans 2) */}
      <article className="rounded-lg border border-border bg-card p-5 shadow-sm md:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-muted-foreground">LEDGER RECONCILIATION</p>
            <p className="mt-1 text-sm text-muted-foreground">Balance projection vs. sum of posted entries · run at 06:00</p>
          </div>
          <Scale size={18} className="text-success" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { id: 'rec-afn', code: 'AFN', entries: '4,218', drift: '0.00' },
            { id: 'rec-pkr', code: 'PKR', entries: '1,904', drift: '0.00' },
            { id: 'rec-usd', code: 'USD', entries: '312', drift: '0.00' },
          ]?.map((r) => (
            <div key={r?.id} className="rounded-lg bg-muted/60 p-3">
              <p className="text-xs font-semibold text-muted-foreground">{r?.code}</p>
              <p className="tabular mt-1 text-lg font-bold">{r?.entries}</p>
              <p className="text-[11px] text-muted-foreground">entries verified</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
                <CheckCircle2 size={12} /> drift {r?.drift}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}