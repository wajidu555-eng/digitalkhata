'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div
        className={`transition-[padding] duration-300 ease-out ${
          collapsed ? 'lg:ps-16' : 'lg:ps-60'
        }`}
      >
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 lg:px-8 xl:px-10 2xl:px-16">
          {children}
        </main>
      </div>
    </div>
  );
}