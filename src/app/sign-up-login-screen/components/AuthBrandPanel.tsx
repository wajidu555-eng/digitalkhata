import React from 'react';
import { ShieldCheck, Layers, RefreshCcw } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { copy, type LangCode } from './authCopy';

const sampleBalances = [
  { id: 'bp-afn', code: 'AFN', amount: '864,550.00', tone: 'bg-primary-foreground/10' },
  { id: 'bp-pkr', code: 'PKR', amount: '2,027,800.00', tone: 'bg-primary-foreground/10' },
  { id: 'bp-usd', code: 'USD', amount: '9,605.00', tone: 'bg-accent/90 text-accent-foreground' },
];

export default function AuthBrandPanel({ lang }: { lang: LangCode }) {
  const t = copy[lang];
  return (
    <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="grid-dots pointer-events-none absolute inset-0" />
      <div className="blob-primary pointer-events-none absolute -end-24 -top-24 h-96 w-96" />

      <div className="relative flex items-center gap-3">
        <AppLogo size={44} />
        <div>
          <p className="text-xl font-bold tracking-tight">DigitalKhata</p>
          <p className="text-xs text-primary-foreground/70">{t.tagline}</p>
        </div>
      </div>

      <div className="relative max-w-xl">
        <h1 className="text-hero-xl font-bold tracking-tight">{t.headline}</h1>
        <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">{t.sub}</p>

        <div className="mt-8 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
            Outstanding receivables · never summed across currencies
          </p>
          {sampleBalances.map((b) => (
            <div
              key={b.id}
              className={`flex items-center justify-between rounded-lg px-4 py-3 ${b.tone}`}
              dir="ltr"
            >
              <span className="text-sm font-bold tracking-wider">{b.code}</span>
              <span className="tabular text-lg font-bold">{b.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="relative grid grid-cols-3 gap-4 text-sm">
        <li className="flex items-start gap-2">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent" />
          <span className="text-primary-foreground/85">Immutable ledger with reversal-based corrections</span>
        </li>
        <li className="flex items-start gap-2">
          <Layers size={18} className="mt-0.5 shrink-0 text-accent" />
          <span className="text-primary-foreground/85">Separate balance per customer and currency</span>
        </li>
        <li className="flex items-start gap-2">
          <RefreshCcw size={18} className="mt-0.5 shrink-0 text-accent" />
          <span className="text-primary-foreground/85">Idempotent posting — retries never duplicate</span>
        </li>
      </ul>
    </div>
  );
}