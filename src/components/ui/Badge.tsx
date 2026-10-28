import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const toneMap: Record<Tone, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-destructive/10 text-destructive',
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-primary/10 text-primary',
};

export default function Badge({
  tone = 'neutral',
  children,
  dot = true,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneMap[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}