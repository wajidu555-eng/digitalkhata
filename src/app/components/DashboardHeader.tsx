'use client';
import React, { useState } from 'react';
import { CalendarDays, Download, Plus, RefreshCcw } from 'lucide-react';

const ranges = ['Today', '7 days', '14 days', '30 days'];

export default function DashboardHeader() {
  const [range, setRange] = useState('14 days');
  const [spin, setSpin] = useState(false);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">Wednesday, 28 October 2026</p>
        <h1 className="mt-0.5 text-2xl font-semibold">Good morning, Zalmai — here is your ledger</h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={14} /> Reporting currency: <span className="font-semibold text-foreground">AFN</span> ·
          rates as of 07:30 · last refreshed 08:57
          <button
            onClick={() => {
              setSpin(true);
              setTimeout(() => setSpin(false), 900);
            }}
            className="rounded-md p-1 transition-all hover:bg-muted active:scale-95"
            aria-label="Refresh dashboard data"
          >
            <RefreshCcw size={14} className={spin ? 'animate-spin' : ''} />
          </button>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-input bg-card p-0.5" role="group" aria-label="Date range">
          {ranges?.map((r) => (
            <button
              key={`range-${r}`}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
                range === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-input bg-card px-3.5 py-2 text-sm font-semibold transition-all duration-150 hover:bg-muted active:scale-95">
          <Download size={15} /> Export CSV
        </button>
        <a
          href="/customer-management"
          className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:opacity-95 active:scale-95"
        >
          <Plus size={15} /> Record Payment
        </a>
      </div>
    </div>
  );
}