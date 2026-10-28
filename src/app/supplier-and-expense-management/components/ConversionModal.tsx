'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { fxRates, type CurrencyCode } from '@/lib/mockData';

interface Values {
  from: CurrencyCode;
  to: CurrencyCode;
  amount: string;
  rate: string;
  fee: string;
  note: string;
  confirm: boolean;
}

const inputCls =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20';

function lookupRate(from: CurrencyCode, to: CurrencyCode): number | null {
  const direct = fxRates.find((r) => r.base === from && r.quote === to);
  if (direct) return direct.rate;
  const inverse = fxRates.find((r) => r.base === to && r.quote === from);
  if (inverse) return Number((1 / inverse.rate).toFixed(4));
  return null;
}

export default function ConversionModal({
  open,
  onClose,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  onPosted: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [idemKey, setIdemKey] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: { from: 'USD', to: 'AFN', amount: '', rate: '70.45', fee: '0', note: '', confirm: false },
  });

  const from = watch('from');
  const to = watch('to');
  const amount = Number(watch('amount')) || 0;
  const rate = Number(watch('rate')) || 0;
  const fee = Number(watch('fee')) || 0;

  useEffect(() => {
    if (open) setIdemKey(`conv-${Date.now().toString(36)}`);
  }, [open]);

  useEffect(() => {
    const r = lookupRate(from, to);
    if (r !== null && from !== to) setValue('rate', r.toString());
  }, [from, to, setValue]);

  const gross = useMemo(() => Math.round(amount * rate * 100) / 100, [amount, rate]);
  const net = Math.max(0, Math.round((gross - fee) * 100) / 100);
  const referenceRate = lookupRate(from, to);
  const drift =
    referenceRate && rate > 0 ? Math.abs(((rate - referenceRate) / referenceRate) * 100) : 0;

  const onSubmit = async (v: Values) => {
    setLoading(true);
    // Backend integration: call restricted Postgres function post_currency_conversion(idempotency_key, ...) which
    // atomically posts both related ledger movements with a shared conversion reference.
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onPosted(
      `Converted ${Number(v.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} ${v.from} → ${net.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${v.to} at ${v.rate}`
    );
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Convert between currencies"
      description="Conversions are explicit, auditable and never happen silently when posting ordinary payments."
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-input px-4 py-2 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
          >
            Cancel
          </button>
          <button
            form="conversion-form"
            type="submit"
            disabled={loading}
            className="flex min-w-40 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Post conversion'}
          </button>
        </>
      }
    >
      <form id="conversion-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <label htmlFor="cv-from" className="mb-1.5 block text-sm font-semibold">
              From currency
            </label>
            <select id="cv-from" className={inputCls} {...register('from')}>
              <option value="USD">USD</option>
              <option value="PKR">PKR</option>
              <option value="AFN">AFN</option>
            </select>
          </div>
          <ArrowRight size={18} className="mb-3 hidden text-muted-foreground md:block rtl:rotate-180" />
          <div>
            <label htmlFor="cv-to" className="mb-1.5 block text-sm font-semibold">
              To currency
            </label>
            <select
              id="cv-to"
              className={inputCls}
              {...register('to', { validate: (val) => val !== from || 'Choose a different target currency' })}
            >
              <option value="AFN">AFN</option>
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
            </select>
            {errors.to && <p className="mt-1 text-xs text-destructive">{errors.to.message}</p>}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label htmlFor="cv-amount" className="mb-1.5 block text-sm font-semibold">
              Source amount ({from})
            </label>
            <input
              id="cv-amount"
              dir="ltr"
              inputMode="decimal"
              placeholder="0.00"
              className={`${inputCls} tabular font-semibold`}
              {...register('amount', {
                required: 'Enter the amount to convert',
                validate: (val) => (Number(val) > 0 ? true : 'Must be greater than zero'),
              })}
            />
            {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>}
          </div>
          <div>
            <label htmlFor="cv-rate" className="mb-1.5 block text-sm font-semibold">
              Rate (1 {from} = ? {to})
            </label>
            <input
              id="cv-rate"
              dir="ltr"
              inputMode="decimal"
              className={`${inputCls} tabular font-semibold`}
              {...register('rate', {
                required: 'A rate is required',
                validate: (val) => (Number(val) > 0 ? true : 'Rate must be positive'),
              })}
            />
            {errors.rate && <p className="mt-1 text-xs text-destructive">{errors.rate.message}</p>}
          </div>
          <div>
            <label htmlFor="cv-fee" className="mb-1.5 block text-sm font-semibold">
              Fee ({to})
            </label>
            <input
              id="cv-fee"
              dir="ltr"
              inputMode="decimal"
              className={`${inputCls} tabular font-semibold`}
              {...register('fee', { validate: (val) => (Number(val) >= 0 ? true : 'Fee cannot be negative') })}
            />
            {errors.fee && <p className="mt-1 text-xs text-destructive">{errors.fee.message}</p>}
          </div>
        </div>

        {drift > 2 && (
          <p className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            Rate differs {drift.toFixed(1)}% from the stored {from}/{to} reference ({referenceRate}). Double-check before
            posting.
          </p>
        )}

        <div className="rounded-lg bg-muted/70 p-4">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Gross converted</dt>
              <dd className="tabular font-semibold">
                {gross.toLocaleString('en-US', { minimumFractionDigits: 2 })} {to}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Fee</dt>
              <dd className="tabular font-semibold">
                −{fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} {to}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-semibold">Net received</dt>
              <dd className="tabular text-lg font-bold">
                {net.toLocaleString('en-US', { minimumFractionDigits: 2 })} {to}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <label htmlFor="cv-note" className="mb-1.5 block text-sm font-semibold">
            Note
          </label>
          <input
            id="cv-note"
            placeholder="e.g. Sarai Shahzada exchange, receipt no. 4471"
            className={inputCls}
            {...register('note')}
          />
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              {...register('confirm', { required: 'Confirm the rate and amounts before posting' })}
            />
            <span>I confirm the rate, fee and amounts above are correct. This conversion cannot be edited after posting.</span>
          </label>
          {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm.message}</p>}
        </div>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-success" />
          <span>
            Idempotency key <span className="font-mono font-semibold text-foreground">{idemKey}</span> · both ledger
            movements commit together or not at all.
          </span>
        </p>
      </form>
    </Modal>
  );
}