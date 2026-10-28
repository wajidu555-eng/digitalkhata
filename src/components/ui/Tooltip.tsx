import React from 'react';

export default function Tooltip({
  label,
  children,
  side = 'bottom',
}: {
  label: string;
  children: React.ReactNode;
  side?: 'bottom' | 'right' | 'top';
}) {
  const pos =
    side === 'right' ?'left-full top-1/2 -translate-y-1/2 ms-2'
      : side === 'top' ?'bottom-full left-1/2 -translate-x-1/2 mb-1.5' :'top-full left-1/2 -translate-x-1/2 mt-1.5';
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100 ${pos}`}
      >
        {label}
      </span>
    </span>
  );
}