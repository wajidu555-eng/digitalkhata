'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Truck, Receipt, ArrowLeftRight } from 'lucide-react';
import Toast, { type ToastState } from '@/components/ui/Toast';
import { expenses as seedExpenses, type Expense } from '@/lib/mockData';
import PayablesHeader from './PayablesHeader';
import SuppliersPanel from './SuppliersPanel';
import ExpensesPanel from './ExpensesPanel';
import FxRatesPanel from './FxRatesPanel';
import AddExpenseModal from './AddExpenseModal';
import ConversionModal from './ConversionModal';

const tabs = [
  { key: 'suppliers', label: 'Suppliers', icon: <Truck size={16} /> },
  { key: 'expenses', label: 'Expenses', icon: <Receipt size={16} /> },
  { key: 'fx', label: 'FX rates & conversion', icon: <ArrowLeftRight size={16} /> },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function PayablesWorkspace() {
  const [tab, setTab] = useState<TabKey>('suppliers');
  const [loading, setLoading] = useState(true);
  const [expenseRows, setExpenseRows] = useState<Expense[]>(seedExpenses);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [convOpen, setConvOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    // Backend integration: load suppliers, expenses and exchange rates from Supabase (RLS-scoped) here
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const notify = useCallback((message: string, tone: 'success' | 'warning' = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  return (
    <div className="space-y-5">
      <PayablesHeader
        tab={tab}
        onAddExpense={() => setExpenseOpen(true)}
        onConvert={() => setConvOpen(true)}
        onAddSupplier={() => notify('Supplier form opens in the next release — use import for now', 'warning')}
      />

      <div className="flex gap-1 border-b border-border" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="fade-in" key={`panel-${tab}`}>
        {tab === 'suppliers' && <SuppliersPanel loading={loading} onPay={(n) => notify(`Payment dialog for ${n} queued`)} />}
        {tab === 'expenses' && (
          <ExpensesPanel
            loading={loading}
            rows={expenseRows}
            onAdd={() => setExpenseOpen(true)}
            onDelete={(id) => {
              setExpenseRows((prev) => prev.filter((e) => e.id !== id));
              notify('Expense reversed — original record kept in the audit log', 'warning');
            }}
          />
        )}
        {tab === 'fx' && <FxRatesPanel loading={loading} onConvert={() => setConvOpen(true)} onRateSaved={() => notify('Rate saved with timestamp and your user ID')} />}
      </div>

      <AddExpenseModal
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        onCreated={(e) => {
          setExpenseRows((prev) => [e, ...prev]);
          setExpenseOpen(false);
          setTab('expenses');
          notify(`Expense ${e.ref} recorded — ${e.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${e.currency}`);
        }}
      />
      <ConversionModal
        open={convOpen}
        onClose={() => setConvOpen(false)}
        onPosted={(msg) => {
          setConvOpen(false);
          notify(msg);
        }}
      />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}