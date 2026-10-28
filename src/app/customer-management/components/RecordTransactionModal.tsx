'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Customer } from '@/lib/mockData';

interface TxnForm {
  kind: 'Credit Sale' | 'Payment' | 'Additional Charge' | 'Adjustment';
  currency: 'AFN' | 'PKR' | 'USD';
  amount: string;
  method: string;
  date: string;
  reference: string;
  note: string;
}

const inputCls =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20';

export default function RecordTransactionModal({
  customer,
  initialKind,
  onClose,
  onPosted,
}: {
  customer: Customer | null;
  initialKind: 'Credit Sale' | 'Payment';
  onClose: () => void;
  onPosted: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [idemKey, setIdemKey] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TxnForm>({
    defaultValues: {
      kind: initialKind,
      currency: 'AFN',
      amount: '',
      method: 'Cash',
      date: '2026-10-28',
      reference: '',
      note: '',
    },
  });

  useEffect(() => {
    if (customer) {
      const firstCur = (customer.balances.find((b) => b.amount > 0)?.currency ?? customer.balances[0].currency) as TxnForm['currency'];
      reset({ kind: initialKind, currency: firstCur, amount: '', method: 'Cash', date: '2026-10-28', reference: '', note: '' });
      setIdemKey(`idem-${customer.id}-${Date.now().toString(36)}`);
    }
  }, [customer, initialKind, reset]);

  const kind = watch('kind');
  const currency = watch('currency');
  const amount = watch('amount');
  const currentBal = customer?.balances.find((b) => b.currency === currency)?.amount ?? 0;
  const numeric = Number(amount);
  const delta = Number.isFinite(numeric) ? numeric : 0;
  const decreasing = kind === 'Payment' || kind === 'Adjustment';
  const projected = decreasing ? currentBal - delta : currentBal + delta;

  const onSubmit = async (v: TxnForm) => {
    setLoading(true);
    // Backend integration: call restricted Postgres function post_ledger_entry(idempotency_key, ...) which locks the
    // (business, customer, currency) balance row, inserts the immutable entry and updates the projection atomically.
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onPosted(
      `${v.kind} of ${Number(v.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} ${v.currency} posted for ${customer?.name}`
    );
  };

  return (
    <Modal
      open={customer !== null}
      onClose={onClose}
      title={`Post ${kind.toLowerCase()}`}
      description={customer ? `${customer.name} · ${customer.id}` : undefined}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-input px-4 py-2 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
          >
            Cancel
          </button>
          <button
            form="txn-form"
            type="submit"
            disabled={loading}
            className="flex min-w-36 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Post to ledger'}
          </button>
        </>
      }
    >
      <form id="txn-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="kind" className="mb-1.5 block text-sm font-semibold">
              Transaction type
            </label>
            <select id="kind" className={inputCls} {...register('kind')}>
              <option>Credit Sale</option>
              <option>Payment</option>
              <option>Additional Charge</option>
              <option>Adjustment</option>
            </select>
          </div>
          <div>
            <label htmlFor="currency" className="mb-1.5 block text-sm font-semibold">
              Currency
            </label>
            <select id="currency" className={inputCls} {...register('currency')}>
              <option value="AFN">AFN — Afghan Afghani</option>
              <option value="PKR">PKR — Pakistani Rupee</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-semibold">
            Amount ({currency})
          </label>
          <input
            id="amount"
            inputMode="decimal"
            placeholder="0.00"
            dir="ltr"
            className={`${inputCls} tabular text-base font-semibold`}
            {...register('amount', {
              required: 'Enter the amount to post',
              validate: (val) => {
                const n = Number(val);
                if (!Number.isFinite(n) || n <= 0) return 'Amount must be greater than zero';
                if (!/^\d+(\.\d{1,2})?$/.test(val)) return `${currency} allows at most 2 decimal places`;
                return true;
              },
            })}
          />
          {errors.amount && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle size={12} /> {errors.amount.message}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Server re-validates precision and currency before posting.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="method" className="mb-1.5 block text-sm font-semibold">
              Payment method
            </label>
            <select id="method" className={inputCls} {...register('method')}>
              <option>Cash</option>
              <option>Bank transfer</option>
              <option>Hawala</option>
              <option>Mobile money</option>
              <option>Cheque</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-semibold">
              Transaction date
            </label>
            <input id="date" type="date" className={inputCls} {...register('date', { required: 'Pick a date' })} />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="reference" className="mb-1.5 block text-sm font-semibold">
            Reference number
          </label>
          <input
            id="reference"
            placeholder="e.g. INV-24-1183 or hawala receipt no."
            className={inputCls}
            {...register('reference')}
          />
        </div>

        <div>
          <label htmlFor="note" className="mb-1.5 block text-sm font-semibold">
            Description
          </label>
          <textarea
            id="note"
            rows={2}
            placeholder="Goods, delivery or settlement details"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            {...register('note', { maxLength: { value: 240, message: 'Keep it under 240 characters' } })}
          />
          {errors.note && <p className="mt-1 text-xs text-destructive">{errors.note.message}</p>}
        </div>

        <div className="rounded-lg bg-muted/70 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Current {currency} balance</span>
            <span className="tabular font-semibold">
              {currentBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-muted-foreground">After posting</span>
            <span className={`tabular font-bold ${projected < 0 ? 'text-warning' : ''}`}>
              {projected.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
            </span>
          </div>
          {projected < 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-warning">
              <AlertCircle size={12} /> This leaves the customer in credit — confirm the amount before posting.
            </p>
          )}
        </div>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-success" />
          <span>
            Idempotency key <span className="font-mono font-semibold text-foreground">{idemKey}</span> — retrying this
            request will never create a duplicate entry. Posted entries cannot be edited, only reversed.
          </span>
        </p>
      </form>
    </Modal>
  );
}