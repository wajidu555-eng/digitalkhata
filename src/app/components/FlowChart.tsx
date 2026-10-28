'use client';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { dailyFlow } from '@/lib/mockData';

interface TipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
}

function FlowTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const credit = payload.find((p) => p.dataKey === 'credit')?.value ?? 0;
  const collected = payload.find((p) => p.dataKey === 'collected')?.value ?? 0;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      <p className="flex justify-between gap-6">
        <span className="text-muted-foreground">Credit sales</span>
        <span className="tabular font-bold">{credit.toLocaleString('en-US')} AFN</span>
      </p>
      <p className="flex justify-between gap-6">
        <span className="text-muted-foreground">Collections</span>
        <span className="tabular font-bold">{collected.toLocaleString('en-US')} AFN</span>
      </p>
    </div>
  );
}

export default function FlowChart() {
  return (
    <div className="h-72 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyFlow} barGap={2} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}K` : `${v}`)}
            width={44}
          />
          <Tooltip content={<FlowTooltip />} cursor={{ fill: 'var(--muted)' }} />
          <Bar dataKey="credit" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={18} />
          <Bar dataKey="collected" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}