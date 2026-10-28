'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Loader2, UploadCloud, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Expense } from '@/lib/mockData';

interface Values {
  category: string;
  description: string;
  amount: string;
  currency: 'AFN' | 'PKR' | 'USD';
  method: string;
  date: string;
  reference: string;
}

const inputCls =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20';

const MAX_MB = 5;

export default function AddExpenseModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (e: Expense) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      category: 'Transport',
      description: '',
      amount: '',
      currency: 'AFN',
      method: 'Cash',
      date: '2026-10-28',
      reference: '',
    },
  });

  const pickFile = (f: File | null) => {
    setFileError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const okType = ['application/pdf', 'image/jpeg', 'image/png'].includes(f.type);
    if (!okType) {
      setFileError('Only PDF, JPG or PNG receipts are accepted');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`Receipt must be smaller than ${MAX_MB} MB`);
      return;
    }
    setFile(f);
  };

  const onSubmit = async (v: Values) => {
    setLoading(true);
    // Backend integration: request presigned Cloudflare R2 upload URL (after authorization), then insert expense row via server action
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    const created: Expense = {
      id: `exp-${Date.now()}`,
      date: v.date,
      category: v.category,
      description: v.description,
      amount: Number(v.amount),
      currency: v.currency,
      method: v.method,
      recordedBy: 'Zalmai K.',
      hasReceipt: file !== null,
      ref: v.reference || `EXP-24-${String(Math.floor(Math.random() * 900) + 100)}`,
    };
    reset();
    setFile(null);
    onCreated(created);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Add business expense"
      description="Expenses are kept separate from customer debt. Corrections are made with a reversal."
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-input px-4 py-2 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
          >
            Cancel
          </button>
          <button
            form="expense-form"
            type="submit"
            disabled={loading}
            className="flex min-w-32 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Record expense'}
          </button>
        </>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="e-category" className="mb-1.5 block text-sm font-semibold">
              Category
            </label>
            <select id="e-category" className={inputCls} {...register('category')}>
              {['Transport', 'Rent', 'Utilities', 'Salaries', 'Packaging', 'Customs & Duty', 'Other'].map((c) => (
                <option key={`opt-${c}`}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="e-date" className="mb-1.5 block text-sm font-semibold">
              Expense date
            </label>
            <input id="e-date" type="date" className={inputCls} {...register('date', { required: 'Pick a date' })} />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="e-desc" className="mb-1.5 block text-sm font-semibold">
            Description
          </label>
          <input
            id="e-desc"
            placeholder="e.g. Truck hire Kabul → Herat, 3 tons"
            className={inputCls}
            {...register('description', {
              required: 'Describe what the money was spent on',
              minLength: { value: 4, message: 'Add a little more detail' },
            })}
          />
          {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label htmlFor="e-amount" className="mb-1.5 block text-sm font-semibold">
              Amount
            </label>
            <input
              id="e-amount"
              inputMode="decimal"
              dir="ltr"
              placeholder="0.00"
              className={`${inputCls} tabular font-semibold`}
              {...register('amount', {
                required: 'Enter an amount',
                validate: (val) => {
                  const n = Number(val);
                  if (!Number.isFinite(n) || n <= 0) return 'Must be greater than zero';
                  if (!/^\d+(\.\d{1,2})?$/.test(val)) return 'Max 2 decimal places';
                  return true;
                },
              })}
            />
            {errors.amount && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle size={12} /> {errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="e-currency" className="mb-1.5 block text-sm font-semibold">
              Currency
            </label>
            <select id="e-currency" className={inputCls} {...register('currency')}>
              <option value="AFN">AFN</option>
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label htmlFor="e-method" className="mb-1.5 block text-sm font-semibold">
              Payment method
            </label>
            <select id="e-method" className={inputCls} {...register('method')}>
              <option>Cash</option>
              <option>Bank transfer</option>
              <option>Mobile money</option>
              <option>Hawala</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="e-ref" className="mb-1.5 block text-sm font-semibold">
            Reference number <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="e-ref" placeholder="Auto-generated if left empty" className={inputCls} {...register('reference')} />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-semibold">Receipt</p>
          {file ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
              <UploadCloud size={18} className="text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB · uploads to private storage with an unpredictable key
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                aria-label="Remove receipt"
                className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-card active:scale-95"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input px-4 py-6 text-center transition-colors hover:bg-muted/50">
              <UploadCloud size={20} className="text-muted-foreground" />
              <span className="text-sm font-semibold">Attach receipt</span>
              <span className="text-xs text-muted-foreground">PDF, JPG or PNG · max {MAX_MB} MB</span>
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
          {fileError && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle size={12} /> {fileError}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}