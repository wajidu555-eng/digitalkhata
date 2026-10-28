import React from 'react';
import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { activity } from '@/lib/mockData';

export default function ActivityFeed() {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team activity</h2>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
        </span>
      </div>
      <ol className="mt-3 space-y-3.5">
        {activity?.map((a) => (
          <li key={a?.id} className="flex gap-3">
            <span className="mt-0.5 shrink-0">
              {a?.tone === 'warning' ? (
                <AlertTriangle size={15} className="text-warning" />
              ) : a?.tone === 'success' ? (
                <CheckCircle2 size={15} className="text-success" />
              ) : (
                <Circle size={15} className="text-muted-foreground" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-snug">
                <span className="font-semibold">{a?.actor}</span> {a?.action}{' '}
                {a?.target && <span className="font-semibold">{a?.target}</span>}
              </p>
              <p className="text-xs text-muted-foreground">{a?.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}