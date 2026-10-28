'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { customers as seed, type Customer } from '@/lib/mockData';
import Toast, { type ToastState } from '@/components/ui/Toast';
import CustomerHeader from './CustomerHeader';
import CustomerSummaryStrip from './CustomerSummaryStrip';
import CustomerFilters, { type CustomerFilterState } from './CustomerFilters';
import CustomerTable from './CustomerTable';
import CustomerDrawer from './CustomerDrawer';
import RecordTransactionModal from './RecordTransactionModal';
import AddCustomerModal from './AddCustomerModal';

export type SortKey = 'name' | 'daysOverdue' | 'lastActivity';

export default function CustomerWorkspace() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Customer[]>(seed);
  const [filters, setFilters] = useState<CustomerFilterState>({
    q: '',
    currency: 'All',
    status: 'Active',
    overdue: 'All',
  });
  const [sortKey, setSortKey] = useState<SortKey>('daysOverdue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [txnFor, setTxnFor] = useState<{ id: string; kind: 'Credit Sale' | 'Payment' } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    // Backend integration: fetch paginated customers + per-currency balances from Supabase (RLS-scoped) here
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const notify = useCallback((message: string, tone: 'success' | 'warning' = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const filtered = useMemo(() => {
    const list = rows.filter((c) => {
      const q = filters.q.trim().toLowerCase();
      const matchQ =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        c.id.toLowerCase().includes(q);
      const matchCur =
        filters.currency === 'All' ||
        c.balances.some((b) => b.currency === filters.currency && b.amount > 0);
      const matchStatus = filters.status === 'All' || c.status === filters.status;
      const matchOver =
        filters.overdue === 'All' ||
        (filters.overdue === 'Overdue 30+' && c.daysOverdue >= 30) ||
        (filters.overdue === 'Overdue 1-29' && c.daysOverdue > 0 && c.daysOverdue < 30) ||
        (filters.overdue === 'Current' && c.daysOverdue === 0);
      return matchQ && matchCur && matchStatus && matchOver;
    });
    const sorted = [...list].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortKey === 'lastActivity') return a.lastActivity.localeCompare(b.lastActivity) * dir;
      return (a.daysOverdue - b.daysOverdue) * dir;
    });
    return sorted;
  }, [rows, filters, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const drawerCustomer = rows.find((c) => c.id === drawerId) ?? null;
  const txnCustomer = rows.find((c) => c.id === txnFor?.id) ?? null;

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(k);
      setSortDir(k === 'name' ? 'asc' : 'desc');
    }
  };

  const archiveSelected = () => {
    setRows((prev) => prev.map((c) => (selected.includes(c.id) ? { ...c, status: 'Archived' } : c)));
    notify(`${selected.length} customer${selected.length > 1 ? 's' : ''} archived — ledger history preserved`);
    setSelected([]);
  };

  return (
    <div className="space-y-5">
      <CustomerHeader onAdd={() => setAddOpen(true)} onExport={() => notify('Customer export queued — CSV protected against formula injection')} />
      <CustomerSummaryStrip rows={rows} />
      <CustomerFilters
        state={filters}
        onChange={(s) => {
          setFilters(s);
          setPage(1);
        }}
      />
      <CustomerTable
        loading={loading}
        rows={pageRows}
        total={filtered.length}
        selected={selected}
        onSelect={setSelected}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        page={safePage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPage={setPage}
        onPageSize={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        onOpen={(id) => setDrawerId(id)}
        onRecord={(id, kind) => setTxnFor({ id, kind })}
        onArchiveSelected={archiveSelected}
        onClearFilters={() => setFilters({ q: '', currency: 'All', status: 'All', overdue: 'All' })}
      />
      <CustomerDrawer
        customer={drawerCustomer}
        onClose={() => setDrawerId(null)}
        onRecord={(id, kind) => setTxnFor({ id, kind })}
      />
      <RecordTransactionModal
        customer={txnCustomer}
        initialKind={txnFor?.kind ?? 'Payment'}
        onClose={() => setTxnFor(null)}
        onPosted={(msg) => {
          setTxnFor(null);
          notify(msg);
        }}
      />
      <AddCustomerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(c) => {
          setRows((prev) => [c, ...prev]);
          setAddOpen(false);
          notify(`${c.name} added to your customers`);
        }}
      />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}