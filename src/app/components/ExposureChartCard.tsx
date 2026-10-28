import React from 'react';
import { Info } from 'lucide-react';
import ExposureChart from './ExposureChart';

const legend = [
  { id: 'lg-afn', code: 'AFN', share: '29.9%', color: 'bg-primary', note: '≈ 864,550 AFN' },
  { id: 'lg-pkr', code: 'PKR', share: '70.1%', color: 'bg-accent', note: '2,027,800 PKR ≈ 507,939 AFN' },
  { id: 'lg-usd', code: 'USD', share: '—', color: 'bg-success', note: '9,605 USD ≈ 676,672 AFN' },
];

export default function ExposureChartCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Currency exposure</h2>
      <p className="text-sm text-muted-foreground">Share of customer-ledger entries by currency</p>
      <div className="mt-2">
        <ExposureChart />
      </div>
      <ul className="mt-2 space-y-2.5">
        {legend?.map((l) => (
          <li key={l?.id} className="flex items-center gap-3 text-sm">
            <span className={`h-3 w-3 rounded-sm ${l?.color}`} />
            <span className="w-10 font-bold">{l?.code}</span>
            <span className="flex-1 text-xs text-muted-foreground">{l?.note}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/70 p-3 text-xs text-muted-foreground">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>
          AFN equivalents use USD/AFN 70.45 and PKR/AFN 0.2505 (effective 28 Oct 07:30). Converted figures are
          estimates, not ledger amounts.
        </p>
      </div>
    </section>
  );
}