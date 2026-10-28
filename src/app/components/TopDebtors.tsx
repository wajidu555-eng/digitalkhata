import React from 'react';
import { ChevronRight } from 'lucide-react';

const debtors = [
  { id: 'td-1', name: 'Peshawar Cloth House', primary: '1,385,000.00 PKR', secondary: '+ 840.00 USD', days: 63, pct: 100 },
  { id: 'td-2', name: 'Haji Abdul Wali Traders', primary: '482,500.00 AFN', secondary: '+ 1,250.00 USD', days: 41, pct: 74 },
  { id: 'td-3', name: 'Dubai Link Trading FZE', primary: '7,420.00 USD', secondary: '', days: 18, pct: 58 },
  { id: 'td-4', name: 'Khyber Spice Merchants', primary: '642,800.00 PKR', secondary: '', days: 27, pct: 46 },
  { id: 'td-5', name: 'Noor Mohammad Wholesale', primary: '218,300.00 AFN', secondary: '', days: 0, pct: 28 },
];

export default function TopDebtors() {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top debtors</h2>
        <a href="/customer-management" className="flex items-center text-xs font-semibold text-primary hover:underline">
          All customers <ChevronRight size={14} className="rtl:rotate-180" />
        </a>
      </div>
      <ul className="mt-3 space-y-3">
        {debtors?.map((d) => (
          <li key={d?.id}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-semibold">{d?.name}</p>
              <span
                className={`shrink-0 text-xs font-semibold ${
                  d?.days >= 30 ? 'text-destructive' : d?.days > 0 ? 'text-warning' : 'text-success'
                }`}
              >
                {d?.days > 0 ? `${d?.days} d overdue` : 'On time'}
              </span>
            </div>
            <p className="tabular text-xs text-muted-foreground">
              {d?.primary} {d?.secondary}
            </p>
            <div className="mt-1.5 h-1.5 rounded-full bg-muted">
              <div
                className={`h-1.5 rounded-full ${d?.days >= 30 ? 'bg-destructive' : d?.days > 0 ? 'bg-accent' : 'bg-primary'}`}
                style={{ width: `${d?.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}