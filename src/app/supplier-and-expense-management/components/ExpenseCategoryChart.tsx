'use client';
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Datum {
  category: string;
  total: number;
}

interface TipProps {
  active?: boolean;
  payload?: { value: number; payload: Datum }[];
}

function CategoryTooltip({ active, payload }: TipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold">{payload[0].payload.category}</p>
      <p className="tabular">{payload[0].value.toLocaleString('en-US')} AFN</p>
    </div>
  );
}

export default function ExpenseCategoryChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}K` : `${v}`)}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={78}
          />
          <Tooltip content={<CategoryTooltip />} cursor={{ fill: 'var(--muted)' }} />
          <Bar dataKey="total" fill="var(--primary)" radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}