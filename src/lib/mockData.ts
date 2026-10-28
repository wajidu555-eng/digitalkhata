export type CurrencyCode = 'AFN' | 'PKR' | 'USD';

export const currencyMeta: Record<
  CurrencyCode,
  { symbol: string; name: string; decimals: number; locale: string }
> = {
  AFN: { symbol: '؋', name: 'Afghan Afghani', decimals: 2, locale: 'en-US' },
  PKR: { symbol: 'Rs', name: 'Pakistani Rupee', decimals: 2, locale: 'en-US' },
  USD: { symbol: '$', name: 'US Dollar', decimals: 2, locale: 'en-US' },
};

export function formatMoney(amount: number, code: CurrencyCode): string {
  const meta = currencyMeta[code];
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const whole = Math.floor(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const frac = (abs - Math.floor(abs)).toFixed(meta.decimals).slice(2);
  return `${sign}${whole}.${frac} ${code}`;
}

export function formatCompact(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
}

export interface CustomerBalance {
  currency: CurrencyCode;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string;
  balances: CustomerBalance[];
  lastActivity: string;
  daysOverdue: number;
  status: 'Active' | 'Archived';
  createdBy: string;
  hasAttachment: boolean;
}

export const customers: Customer[] = [
  { id: 'cust-0101', name: 'Haji Abdul Wali Traders', phone: '+93 70 412 8831', city: 'Kabul', balances: [{ currency: 'AFN', amount: 482500 }, { currency: 'USD', amount: 1250 }], lastActivity: '2026-10-27', daysOverdue: 41, status: 'Active', createdBy: 'Zalmai K.', hasAttachment: true },
  { id: 'cust-0102', name: 'Noor Mohammad Wholesale', phone: '+93 78 220 5519', city: 'Mazar-i-Sharif', balances: [{ currency: 'AFN', amount: 218300 }], lastActivity: '2026-10-28', daysOverdue: 0, status: 'Active', createdBy: 'Zalmai K.', hasAttachment: false },
  { id: 'cust-0103', name: 'Peshawar Cloth House', phone: '+92 91 285 4410', city: 'Peshawar', balances: [{ currency: 'PKR', amount: 1385000 }, { currency: 'USD', amount: 840 }], lastActivity: '2026-10-25', daysOverdue: 63, status: 'Active', createdBy: 'Bashir A.', hasAttachment: true },
  { id: 'cust-0104', name: 'Mirwais Electronics', phone: '+93 79 301 7742', city: 'Kandahar', balances: [{ currency: 'AFN', amount: 96750 }], lastActivity: '2026-10-26', daysOverdue: 12, status: 'Active', createdBy: 'Zalmai K.', hasAttachment: false },
  { id: 'cust-0105', name: 'Gul Rahman & Sons', phone: '+93 77 118 6620', city: 'Jalalabad', balances: [{ currency: 'AFN', amount: 0 }], lastActivity: '2026-10-22', daysOverdue: 0, status: 'Active', createdBy: 'Bashir A.', hasAttachment: false },
  { id: 'cust-0106', name: 'Khyber Spice Merchants', phone: '+92 92 551 9003', city: 'Landi Kotal', balances: [{ currency: 'PKR', amount: 642800 }], lastActivity: '2026-10-24', daysOverdue: 27, status: 'Active', createdBy: 'Bashir A.', hasAttachment: true },
  { id: 'cust-0107', name: 'Sahar Pharmacy', phone: '+93 72 640 2218', city: 'Herat', balances: [{ currency: 'AFN', amount: 54200 }, { currency: 'USD', amount: 95 }], lastActivity: '2026-10-28', daysOverdue: 0, status: 'Active', createdBy: 'Zalmai K.', hasAttachment: false },
  { id: 'cust-0108', name: 'Dubai Link Trading FZE', phone: '+971 4 331 2290', city: 'Dubai', balances: [{ currency: 'USD', amount: 7420 }], lastActivity: '2026-10-20', daysOverdue: 18, status: 'Active', createdBy: 'Zalmai K.', hasAttachment: true },
  { id: 'cust-0109', name: 'Fatima Zahra Tailoring', phone: '+93 78 904 1175', city: 'Kabul', balances: [{ currency: 'AFN', amount: 12800 }], lastActivity: '2026-10-19', daysOverdue: 9, status: 'Active', createdBy: 'Bashir A.', hasAttachment: false },
  { id: 'cust-0110', name: 'Achakzai Hardware', phone: '+93 70 775 3304', city: 'Spin Boldak', balances: [{ currency: 'AFN', amount: 0 }, { currency: 'PKR', amount: 0 }], lastActivity: '2026-09-02', daysOverdue: 0, status: 'Archived', createdBy: 'Zalmai K.', hasAttachment: false },
];

export interface LedgerRow {
  id: string;
  ref: string;
  customer: string;
  type: 'Credit Sale' | 'Payment' | 'Reversal' | 'Additional Charge' | 'Adjustment';
  amount: number;
  currency: CurrencyCode;
  direction: 'increase' | 'decrease';
  method: string;
  postedBy: string;
  postedAt: string;
  status: 'Posted' | 'Reversed';
}

export const ledgerRows: LedgerRow[] = [
  { id: 'led-9041', ref: 'INV-24-1182', customer: 'Haji Abdul Wali Traders', type: 'Credit Sale', amount: 86500, currency: 'AFN', direction: 'increase', method: '—', postedBy: 'Zalmai K.', postedAt: '2026-10-28 08:41', status: 'Posted' },
  { id: 'led-9040', ref: 'RCP-24-0677', customer: 'Noor Mohammad Wholesale', type: 'Payment', amount: 40000, currency: 'AFN', direction: 'decrease', method: 'Cash', postedBy: 'Bashir A.', postedAt: '2026-10-28 08:12', status: 'Posted' },
  { id: 'led-9039', ref: 'RCP-24-0676', customer: 'Dubai Link Trading FZE', type: 'Payment', amount: 1500, currency: 'USD', direction: 'decrease', method: 'Bank transfer', postedBy: 'Zalmai K.', postedAt: '2026-10-27 17:55', status: 'Posted' },
  { id: 'led-9038', ref: 'INV-24-1181', customer: 'Peshawar Cloth House', type: 'Credit Sale', amount: 320000, currency: 'PKR', direction: 'increase', method: '—', postedBy: 'Bashir A.', postedAt: '2026-10-27 15:20', status: 'Posted' },
  { id: 'led-9037', ref: 'REV-24-0031', customer: 'Mirwais Electronics', type: 'Reversal', amount: 12000, currency: 'AFN', direction: 'decrease', method: '—', postedBy: 'Zalmai K.', postedAt: '2026-10-27 14:02', status: 'Posted' },
  { id: 'led-9036', ref: 'INV-24-1180', customer: 'Sahar Pharmacy', type: 'Credit Sale', amount: 18400, currency: 'AFN', direction: 'increase', method: '—', postedBy: 'Bashir A.', postedAt: '2026-10-27 11:38', status: 'Posted' },
  { id: 'led-9035', ref: 'RCP-24-0675', customer: 'Khyber Spice Merchants', type: 'Payment', amount: 150000, currency: 'PKR', direction: 'decrease', method: 'Cash', postedBy: 'Bashir A.', postedAt: '2026-10-27 10:15', status: 'Posted' },
  { id: 'led-9034', ref: 'INV-24-1179', customer: 'Fatima Zahra Tailoring', type: 'Credit Sale', amount: 6200, currency: 'AFN', direction: 'increase', method: '—', postedBy: 'Zalmai K.', postedAt: '2026-10-26 16:44', status: 'Reversed' },
];

export const dailyFlow = [
  { day: '15 Oct', credit: 182000, collected: 121000 },
  { day: '16 Oct', credit: 96000, collected: 148000 },
  { day: '17 Oct', credit: 0, collected: 0 },
  { day: '18 Oct', credit: 214500, collected: 87000 },
  { day: '19 Oct', credit: 158000, collected: 132500 },
  { day: '20 Oct', credit: 74000, collected: 191000 },
  { day: '21 Oct', credit: 243000, collected: 110000 },
  { day: '22 Oct', credit: 131000, collected: 98500 },
  { day: '23 Oct', credit: 52000, collected: 176000 },
  { day: '24 Oct', credit: 0, collected: 0 },
  { day: '25 Oct', credit: 188000, collected: 64000 },
  { day: '26 Oct', credit: 167500, collected: 143000 },
  { day: '27 Oct', credit: 112000, collected: 209000 },
  { day: '28 Oct', credit: 86500, collected: 40000 },
];

export const currencyExposure = [
  { name: 'AFN', value: 864550, fill: 'var(--primary)' },
  { name: 'PKR', value: 2027800, fill: 'var(--accent)' },
  { name: 'USD', value: 9605, fill: 'var(--success)' },
];

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  city: string;
  category: string;
  owed: { currency: CurrencyCode; amount: number }[];
  lastPayment: string;
  nextDue: string;
  status: 'Current' | 'Due soon' | 'Overdue';
}

export const suppliers: Supplier[] = [
  { id: 'sup-0201', name: 'Karachi Grain Importers', phone: '+92 21 3456 7710', city: 'Karachi', category: 'Rice & Grains', owed: [{ currency: 'PKR', amount: 2150000 }], lastPayment: '2026-10-18', nextDue: '2026-11-02', status: 'Due soon' },
  { id: 'sup-0202', name: 'Sharjah Tea Co.', phone: '+971 6 552 9081', city: 'Sharjah', category: 'Tea & Spices', owed: [{ currency: 'USD', amount: 4800 }], lastPayment: '2026-10-05', nextDue: '2026-10-25', status: 'Overdue' },
  { id: 'sup-0203', name: 'Kabul Packaging Works', phone: '+93 70 833 2210', city: 'Kabul', category: 'Packaging', owed: [{ currency: 'AFN', amount: 128400 }], lastPayment: '2026-10-24', nextDue: '2026-11-14', status: 'Current' },
  { id: 'sup-0204', name: 'Torkham Freight Services', phone: '+93 77 604 5518', city: 'Torkham', category: 'Freight', owed: [{ currency: 'AFN', amount: 74900 }, { currency: 'PKR', amount: 310000 }], lastPayment: '2026-10-21', nextDue: '2026-10-31', status: 'Due soon' },
  { id: 'sup-0205', name: 'Lahore Edible Oil Mills', phone: '+92 42 3591 2204', city: 'Lahore', category: 'Cooking Oil', owed: [{ currency: 'PKR', amount: 980000 }], lastPayment: '2026-09-29', nextDue: '2026-10-20', status: 'Overdue' },
  { id: 'sup-0206', name: 'Herat Saffron Growers', phone: '+93 72 119 8803', city: 'Herat', category: 'Saffron', owed: [{ currency: 'AFN', amount: 0 }], lastPayment: '2026-10-27', nextDue: '2026-11-27', status: 'Current' },
];

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  method: string;
  recordedBy: string;
  hasReceipt: boolean;
  ref: string;
}

export const expenses: Expense[] = [
  { id: 'exp-3301', date: '2026-10-28', category: 'Transport', description: 'Truck hire Kabul → Mazar, 2 tons', amount: 18500, currency: 'AFN', method: 'Cash', recordedBy: 'Zalmai K.', hasReceipt: true, ref: 'EXP-24-0412' },
  { id: 'exp-3300', date: '2026-10-27', category: 'Rent', description: 'Warehouse rent — Pul-e-Charkhi, Oct', amount: 85000, currency: 'AFN', method: 'Bank transfer', recordedBy: 'Zalmai K.', hasReceipt: true, ref: 'EXP-24-0411' },
  { id: 'exp-3299', date: '2026-10-26', category: 'Utilities', description: 'Generator diesel 180L', amount: 27900, currency: 'AFN', method: 'Cash', recordedBy: 'Bashir A.', hasReceipt: false, ref: 'EXP-24-0410' },
  { id: 'exp-3298', date: '2026-10-25', category: 'Customs & Duty', description: 'Torkham clearance, container TKM-2218', amount: 640, currency: 'USD', method: 'Cash', recordedBy: 'Zalmai K.', hasReceipt: true, ref: 'EXP-24-0409' },
  { id: 'exp-3297', date: '2026-10-24', category: 'Salaries', description: 'Staff wages — week 43', amount: 62000, currency: 'AFN', method: 'Cash', recordedBy: 'Zalmai K.', hasReceipt: false, ref: 'EXP-24-0408' },
  { id: 'exp-3296', date: '2026-10-23', category: 'Transport', description: 'Peshawar delivery van fuel', amount: 14500, currency: 'PKR', method: 'Cash', recordedBy: 'Bashir A.', hasReceipt: false, ref: 'EXP-24-0407' },
  { id: 'exp-3295', date: '2026-10-22', category: 'Packaging', description: 'Polypropylene sacks, 500 pcs', amount: 21500, currency: 'AFN', method: 'Cash', recordedBy: 'Bashir A.', hasReceipt: true, ref: 'EXP-24-0406' },
  { id: 'exp-3294', date: '2026-10-21', category: 'Utilities', description: 'Internet & mobile top-ups', amount: 4800, currency: 'AFN', method: 'Mobile money', recordedBy: 'Zalmai K.', hasReceipt: false, ref: 'EXP-24-0405' },
];

export const expenseByCategory = [
  { category: 'Rent', total: 85000 },
  { category: 'Salaries', total: 62000 },
  { category: 'Utilities', total: 32700 },
  { category: 'Packaging', total: 21500 },
  { category: 'Transport', total: 18500 },
  { category: 'Customs', total: 46000 },
];

export interface FxRate {
  id: string;
  pair: string;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  source: string;
  effective: string;
  enteredBy: string;
  stale: boolean;
}

export const fxRates: FxRate[] = [
  { id: 'fx-501', pair: 'USD/AFN', base: 'USD', quote: 'AFN', rate: 70.45, source: 'Manual — Sarai Shahzada', effective: '2026-10-28 07:30', enteredBy: 'Zalmai K.', stale: false },
  { id: 'fx-502', pair: 'USD/PKR', base: 'USD', quote: 'PKR', rate: 281.2, source: 'Manual — Peshawar exchange', effective: '2026-10-28 07:30', enteredBy: 'Zalmai K.', stale: false },
  { id: 'fx-503', pair: 'PKR/AFN', base: 'PKR', quote: 'AFN', rate: 0.2505, source: 'Derived (cross rate)', effective: '2026-10-26 18:00', enteredBy: 'System', stale: true },
];

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  tone: 'default' | 'warning' | 'success';
}

export const activity: ActivityItem[] = [
  { id: 'act-1', actor: 'Zalmai K.', action: 'posted credit sale INV-24-1182 to', target: 'Haji Abdul Wali Traders', time: '19 min ago', tone: 'default' },
  { id: 'act-2', actor: 'Bashir A.', action: 'recorded payment RCP-24-0677 from', target: 'Noor Mohammad Wholesale', time: '48 min ago', tone: 'success' },
  { id: 'act-3', actor: 'System', action: 'flagged overdue 60+ days:', target: 'Peshawar Cloth House', time: '2 h ago', tone: 'warning' },
  { id: 'act-4', actor: 'Zalmai K.', action: 'updated USD/AFN rate to 70.45', target: '', time: '1 h ago', tone: 'default' },
  { id: 'act-5', actor: 'Bashir A.', action: 'attached receipt to expense', target: 'EXP-24-0409', time: '3 h ago', tone: 'default' },
  { id: 'act-6', actor: 'Owner', action: 'invited Rahila S. as Accountant', target: '', time: 'Yesterday', tone: 'default' },
];