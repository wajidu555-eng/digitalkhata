'use client';
import React from 'react';
import { Search, X } from 'lucide-react';

export interface CustomerFilterState {
  q: string;
  currency: 'All' | 'AFN' | 'PKR' | 'USD';
  status: 'All' | 'Active' | 'Archived';
  overdue: 'All' | 'Overdue 30+' | 'Overdue 1-29' | 'Current';
}

function Seg<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="inline-flex rounded-lg border border-input bg-card p-0.5" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={`${label}-${o}`}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150 active:scale-95 ${
              value === o ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CustomerFilters({
  state,
  onChange,
}: {
  state: CustomerFilterState;
  onChange: (s: CustomerFilterState) => void;
}) {
  const dirty = state.q !== '' || state.currency !== 'All' || state.status !== 'Active' || state.overdue !== 'All';
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="relative min-w-60 flex-1">
        <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={state.q}
          onChange={(e) => onChange({ ...state, q: e.target.value })}
          placeholder="Search name, phone or customer ID"
          aria-label="Search customers"
          className="h-10 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm outline-none transition-all duration-150 focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>
      <Seg
        label="Currency"
        options={['All', 'AFN', 'PKR', 'USD'] as const}
        value={state.currency}
        onChange={(v) => onChange({ ...state, currency: v })}
      />
      <Seg
        label="Aging"
        options={['All', 'Overdue 30+', 'Overdue 1-29', 'Current'] as const}
        value={state.overdue}
        onChange={(v) => onChange({ ...state, overdue: v })}
      />
      <Seg
        label="Status"
        options={['All', 'Active', 'Archived'] as const}
        value={state.status}
        onChange={(v) => onChange({ ...state, status: v })}
      />
      {dirty && (
        <button
          onClick={() => onChange({ q: '', currency: 'All', status: 'Active', overdue: 'All' })}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <X size={12} /> Reset
        </button>
      )}
    </div>
  );
}