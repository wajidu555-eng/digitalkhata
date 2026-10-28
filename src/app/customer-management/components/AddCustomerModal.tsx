'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Customer } from '@/lib/mockData';

interface Values {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

const inputCls =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20';

export default function AddCustomerModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (c: Customer) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [dup, setDup] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { name: '', phone: '', city: '', address: '', notes: '' } });

  const onSubmit = async (v: Values) => {
    if (v.name.toLowerCase().includes('noor mohammad') && !dup) {
      setDup('A customer named "Noor Mohammad Wholesale" already exists. Submit again to create anyway.');
      return;
    }
    setLoading(true);
    // Backend integration: insert into customers (RLS: membership + permission check) via server action
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const created: Customer = {
      id: `cust-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`,
      name: v.name,
      phone: v.phone,
      city: v.city || '—',
      balances: [{ currency: 'AFN', amount: 0 }],
      lastActivity: '2026-10-28',
      daysOverdue: 0,
      status: 'Active',
      createdBy: 'Zalmai K.',
      hasAttachment: false,
    };
    reset();
    setDup(null);
    onCreated(created);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setDup(null);
        onClose();
      }}
      title="Add customer"
      description="A zero balance is opened in AFN. Other currency balances are created on first transaction."
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-input px-4 py-2 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
          >
            Cancel
          </button>
          <button
            form="add-customer-form"
            type="submit"
            disabled={loading}
            className="flex min-w-32 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create customer'}
          </button>
        </>
      }
    >
      <form id="add-customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {dup && (
          <p className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning">
            {dup}
          </p>
        )}
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">
            Full name or shop name
          </label>
          <input id="c-name" className={inputCls} {...register('name', { required: 'Customer name is required' })} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold">
              Phone number
            </label>
            <input
              id="c-phone"
              dir="ltr"
              placeholder="+93 70 000 0000"
              className={inputCls}
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^\+?[0-9\s-]{8,18}$/, message: 'Enter a valid phone number' },
              })}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="c-city" className="mb-1.5 block text-sm font-semibold">
              City
            </label>
            <input id="c-city" className={inputCls} {...register('city')} />
          </div>
        </div>
        <div>
          <label htmlFor="c-address" className="mb-1.5 block text-sm font-semibold">
            Address
          </label>
          <input id="c-address" placeholder="Street, market, district" className={inputCls} {...register('address')} />
        </div>
        <div>
          <label htmlFor="c-notes" className="mb-1.5 block text-sm font-semibold">
            Internal notes
          </label>
          <textarea
            id="c-notes"
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            {...register('notes')}
          />
        </div>
      </form>
    </Modal>
  );
}