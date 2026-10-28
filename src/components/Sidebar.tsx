'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Truck,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Settings,
  LogOut,
  Building2,
  ChevronsUpDown,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Tooltip from '@/components/ui/Tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Ledger',
    items: [
      { href: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { href: '/customer-management', label: 'Customers', icon: <Users size={18} />, badge: '4' },
    ],
  },
  {
    title: 'Payables',
    items: [
      { href: '/supplier-and-expense-management', label: 'Suppliers & Expenses', icon: <Truck size={18} />, badge: '2' },
    ],
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  const content = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className={`flex items-center gap-2 px-4 py-4 ${isCollapsed ? 'justify-center' : ''}`}>
        <AppLogo size={36} />
        {!isCollapsed && <span className="text-lg font-bold tracking-tight">DigitalKhata</span>}
      </div>

      {!isCollapsed && (
        <div className="px-3 pb-3">
          <button className="flex w-full items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2 text-start transition-all duration-150 hover:bg-primary-foreground/15 active:scale-[0.99]">
            <Building2 size={16} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Wali Trading Co.</span>
              <span className="block text-[11px] text-primary-foreground/70">Owner · Kabul</span>
            </span>
            <ChevronsUpDown size={14} className="text-primary-foreground/70" />
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {groups.map((g) => (
          <div key={`grp-${g.title}`}>
            {!isCollapsed && (
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/60">
                {g.title}
              </p>
            )}
            <ul className="space-y-1">
              {g.items.map((item) => {
                const active = pathname === item.href;
                const link = (
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-primary-foreground text-primary'
                        : 'text-primary-foreground/85 hover:bg-primary-foreground/10'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
                return (
                  <li key={`nav-${item.href}`}>
                    {isCollapsed ? (
                      <Tooltip label={item.label} side="right">
                        {link}
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-primary-foreground/15 p-3">
        {!isCollapsed && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2">
            <ShieldCheck size={16} className="text-accent" />
            <p className="text-xs leading-tight text-primary-foreground/85">
              RLS tenant isolation <span className="font-semibold">active</span>
            </p>
          </div>
        )}
        <Link
          href="/sign-up-login-screen"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/85 transition-all duration-150 hover:bg-primary-foreground/10 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign out</span>}
        </Link>
        <button
          className={`hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/85 transition-all duration-150 hover:bg-primary-foreground/10 active:scale-[0.99] lg:flex ${
            isCollapsed ? 'justify-center' : ''
          }`}
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 pt-1 text-xs text-primary-foreground/60">
            <Settings size={12} /> v1.8.2 · Asia/Kabul
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 start-0 z-30 hidden transition-[width] duration-300 ease-out lg:block ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {content(collapsed)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden fade-in">
          <button aria-label="Close menu" className="absolute inset-0 bg-foreground/50" onClick={onCloseMobile} />
          <aside className="absolute inset-y-0 start-0 w-64 slide-up">{content(false)}</aside>
        </div>
      )}
    </>
  );
}