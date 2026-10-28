import React from 'react';
import { TrendingDown } from 'lucide-react';
import FlowChart from './FlowChart';

export default function FlowChartCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Credit sales vs. collections</h2>
          <p className="text-sm text-muted-foreground">AFN only · 15–28 Oct · other currencies on their own ledgers</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Credit sales
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" /> Collections
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
        <TrendingDown size={14} />
        <span className="font-semibold">
          Collections fell 81% below credit sales on 18 and 25 Oct — follow up on weekend-adjacent dues.
        </span>
      </div>
      <div className="mt-4">
        <FlowChart />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm md:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Credit sales (14 d)</dt>
          <dd className="tabular font-bold">1,504,000.00</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Collections (14 d)</dt>
          <dd className="tabular font-bold">1,521,000.00</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Net change</dt>
          <dd className="tabular font-bold text-success">-17,000.00</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">No-activity days</dt>
          <dd className="tabular font-bold">2 (Fri closures)</dd>
        </div>
      </dl>
    </section>
  );
}