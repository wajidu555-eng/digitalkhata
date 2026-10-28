import React from 'react';

export default function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const w = 112;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - 3 - ((v - min) / range) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const areaPts = `0,${h} ${pts} ${w},${h}`;
  const gradId = `spark-grad-${positive ? 'up' : 'down'}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`h-8 w-full ${positive ? 'text-warning' : 'text-success'}`}
      role="img"
      aria-label={positive ? 'Receivable trending up over last 10 days' : 'Receivable trending down over last 10 days'}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill={`url(#${gradId})`} />
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}