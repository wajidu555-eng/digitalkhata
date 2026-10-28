import React from 'react';
import { Download, UserPlus, Printer } from 'lucide-react';

export default function CustomerHeader({
  onAdd,
  onExport,
}: {
  onAdd: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every customer carries a separate balance per currency. Posted entries are immutable — corrections are made
          with reversals.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-input bg-card px-3.5 py-2 text-sm font-semibold transition-all duration-150 hover:bg-muted active:scale-95">
          <Printer size={15} /> Print statements
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg border border-input bg-card px-3.5 py-2 text-sm font-semibold transition-all duration-150 hover:bg-muted active:scale-95"
        >
          <Download size={15} /> Export CSV
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:opacity-95 active:scale-95"
        >
          <UserPlus size={15} /> Add customer
        </button>
      </div>
    </div>
  );
}