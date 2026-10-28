import React from 'react';
import { ArrowLeftRight, Plus, Receipt, Truck } from 'lucide-react';

export default function PayablesHeader({
  tab,
  onAddExpense,
  onConvert,
  onAddSupplier,
}: {
  tab: 'suppliers' | 'expenses' | 'fx';
  onAddExpense: () => void;
  onConvert: () => void;
  onAddSupplier: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Suppliers &amp; Expenses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What you owe, what you spent, and the exchange rates used when currencies are explicitly converted.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onConvert}
          className="flex items-center gap-2 rounded-lg border border-input bg-card px-3.5 py-2 text-sm font-semibold transition-all duration-150 hover:bg-muted active:scale-95"
        >
          <ArrowLeftRight size={15} /> Convert currency
        </button>
        {tab === 'suppliers' && (
          <button
            onClick={onAddSupplier}
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:opacity-95 active:scale-95"
          >
            <Truck size={15} /> Add supplier
          </button>
        )}
        {tab !== 'suppliers' && (
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:opacity-95 active:scale-95"
          >
            {tab === 'expenses' ? <Receipt size={15} /> : <Plus size={15} />} Add expense
          </button>
        )}
      </div>
    </div>
  );
}