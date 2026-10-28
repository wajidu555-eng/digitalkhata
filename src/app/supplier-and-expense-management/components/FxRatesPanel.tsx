'use client';
import React, { useState } from 'react';
import { AlertTriangle, ArrowLeftRight, CheckCircle2, Clock3, Loader2, PencilLine, ShieldCheck } from 'lucide-react';
import { fxRates } from '@/lib/mockData';
import Badge from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function FxRatesPanel({
  loading,
  onConvert,
  onRateSaved,
}: {
  loading: boolean;
  onConvert: () => void;
  onRateSaved: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (id: string, rate: number) => {
    setEditing(id);
    setDraft(rate.toString());
  };

  const save = async () => {
    setSaving(true);
    // Backend integration: insert a new historical row into exchange_rates (never overwrite) via server action
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setEditing(null);
    onRateSaved();
  };

  const staleCount = fxRates.filter((r) => r.stale).length;

  return (
    <div className="space-y-4">
      {staleCount > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4" role="alert">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning">{staleCount} exchange rate is stale (older than 24 hours)</p>
            <p className="text-xs text-warning/90">
              Same-currency postings are unaffected. Conversions involving PKR/AFN need a fresh manual rate first.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-lg border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h2 className="text-lg font-semibold">Current exchange rates</h2>
              <p className="text-sm text-muted-foreground">
                Convention: 1 base unit = rate × quote units, before fees. Each change creates a new historical row.
              </p>
            </div>
            <button
              onClick={onConvert}
              className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-95"
            >
              <ArrowLeftRight size={15} /> Convert
            </button>
          </div>
          {loading ? (
            <TableSkeleton rows={3} cols={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                    <th className="px-5 py-2.5 text-start font-semibold">Pair</th>
                    <th className="px-3 py-2.5 text-end font-semibold">Rate</th>
                    <th className="px-3 py-2.5 text-start font-semibold">Source</th>
                    <th className="px-3 py-2.5 text-start font-semibold">Effective</th>
                    <th className="px-3 py-2.5 text-start font-semibold">Entered by</th>
                    <th className="px-3 py-2.5 text-start font-semibold">Freshness</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fxRates.map((r) => (
                    <tr key={r.id} className="transition-colors odd:bg-card even:bg-muted/20 hover:bg-muted/60">
                      <td className="px-5 py-3 font-bold">{r.pair}</td>
                      <td className="px-3 py-3 text-end">
                        {editing === r.id ? (
                          <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            aria-label={`New rate for ${r.pair}`}
                            dir="ltr"
                            className="tabular h-8 w-28 rounded-md border border-ring bg-background px-2 text-end text-sm font-bold outline-none ring-2 ring-ring/20"
                          />
                        ) : (
                          <span className="tabular font-bold">{r.rate.toFixed(r.rate < 1 ? 4 : 2)}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{r.source}</td>
                      <td className="tabular whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{r.effective}</td>
                      <td className="px-3 py-3 text-muted-foreground">{r.enteredBy}</td>
                      <td className="px-3 py-3">
                        {r.stale ? <Badge tone="warning">Stale</Badge> : <Badge tone="success">Fresh</Badge>}
                      </td>
                      <td className="px-5 py-3 text-end">
                        {editing === r.id ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={save}
                              disabled={saving}
                              className="flex min-w-14 items-center justify-center rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-all active:scale-95 disabled:opacity-70"
                            >
                              {saving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="rounded-md border border-input px-2.5 py-1 text-xs font-semibold transition-all hover:bg-muted active:scale-95"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(r.id, r.rate)}
                            aria-label={`Update rate for ${r.pair}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1 text-xs font-semibold transition-all hover:bg-muted active:scale-95"
                          >
                            <PencilLine size={12} /> Update
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Reporting policy</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Reporting currency</dt>
                <dd className="font-bold">AFN</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Rate basis</dt>
                <dd className="font-bold">Latest effective</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Rounding</dt>
                <dd className="font-bold">Half-up, once at the end</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Provider</dt>
                <dd className="font-bold">Manual entry</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Recent conversions</h2>
            <ul className="mt-3 space-y-3">
              {[
                { id: 'cv-1', text: '2,000.00 USD → 140,900.00 AFN', meta: 'Rate 70.45 · fee 0.00 · 27 Oct', ok: true },
                { id: 'cv-2', text: '500,000.00 PKR → 125,250.00 AFN', meta: 'Rate 0.2505 · fee 250.00 AFN · 22 Oct', ok: true },
              ].map((c) => (
                <li key={c.id} className="flex gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  <div>
                    <p className="tabular text-sm font-semibold">{c.text}</p>
                    <p className="text-xs text-muted-foreground">{c.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-success" />
              Historical conversions keep the rate used at posting time and never change when rates update.
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 size={12} /> Next scheduled rate review: tomorrow 07:30
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}