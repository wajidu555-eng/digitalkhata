'use client';
import React, { useState } from 'react';
import { Menu, Search, Bell, Globe2, ChevronDown, Command } from 'lucide-react';

const langs = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
  { code: 'ps', label: 'پښتو' },
];

export default function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const [lang, setLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur lg:px-8">
      <button
        className="rounded-md p-2 text-muted-foreground transition-all duration-150 hover:bg-muted active:scale-95 lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative max-w-md flex-1">
        <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search customers, refs, phone…"
          aria-label="Global search"
          className="h-10 w-full rounded-lg border border-input bg-background ps-9 pe-16 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        <kbd className="pointer-events-none absolute end-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
          <Command size={10} /> K
        </kbd>
      </div>

      <div className="ms-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success md:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Synced 08:57
        </span>

        <div className="relative">
          <button
            onClick={() => {
              setLangOpen(!langOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-input px-3 py-2 text-sm font-medium transition-all duration-150 hover:bg-muted active:scale-95"
            aria-haspopup="menu"
            aria-expanded={langOpen}
          >
            <Globe2 size={16} />
            <span className="hidden sm:inline">{langs.find((l) => l.code === lang)?.label}</span>
            <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div className="absolute end-0 mt-2 w-40 rounded-lg border border-border bg-card p-1 shadow-lg modal-in" role="menu">
              {langs.map((l) => (
                <button
                  key={`lang-${l.code}`}
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                    lang === l.code ? 'font-semibold text-primary' : ''
                  }`}
                  role="menuitem"
                >
                  {l.label}
                  <span className="text-xs uppercase text-muted-foreground">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setLangOpen(false);
            }}
            className="relative rounded-lg border border-input p-2.5 transition-all duration-150 hover:bg-muted active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              3
            </span>
          </button>
          {notifOpen && (
            <div className="absolute end-0 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg modal-in">
              <p className="border-b border-border px-4 py-3 text-sm font-semibold">Needs attention</p>
              <ul className="divide-y divide-border text-sm">
                <li className="px-4 py-3">
                  <p className="font-medium">Peshawar Cloth House is 63 days overdue</p>
                  <p className="text-xs text-muted-foreground">PKR 1,385,000.00 + USD 840.00 outstanding</p>
                </li>
                <li className="px-4 py-3">
                  <p className="font-medium">PKR/AFN rate is stale</p>
                  <p className="text-xs text-muted-foreground">Last updated 2 days ago</p>
                </li>
                <li className="px-4 py-3">
                  <p className="font-medium">Sharjah Tea Co. payment overdue</p>
                  <p className="text-xs text-muted-foreground">USD 4,800.00 due 25 Oct</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ps-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            ZK
          </span>
          <span className="hidden leading-tight xl:block">
            <span className="block text-sm font-semibold">Zalmai Khan</span>
            <span className="block text-xs text-muted-foreground">Owner</span>
          </span>
        </div>
      </div>
    </header>
  );
}