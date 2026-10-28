'use client';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'AFN entries', value: 4218, fill: 'var(--primary)' },
  { name: 'PKR entries', value: 1904, fill: 'var(--accent)' },
  { name: 'USD entries', value: 312, fill: 'var(--success)' },
];

interface TipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function ExposureTooltip({ active, payload }: TipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold">{payload[0].name}</p>
      <p className="tabular">{payload[0].value.toLocaleString('en-US')} posted</p>
    </div>
  );
}

export default function ExposureChart() {
  return (
    <div className="relative h-52 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={86}
            paddingAngle={3}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={`cell-${d.name}`} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip content={<ExposureTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="tabular text-2xl font-bold">6,434</p>
        <p className="text-[11px] text-muted-foreground">posted entries</p>
      </div>
    </div>
  );
}