'use client';
import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export interface ToastState {
  id: number;
  message: string;
  tone: 'success' | 'warning';
}

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const Icon = toast.tone === 'success' ? CheckCircle2 : AlertTriangle;
  const color = toast.tone === 'success' ? 'text-success' : 'text-warning';
  return (
    <div className="fixed bottom-5 right-5 z-[60] slide-up" role="status">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <Icon size={18} className={color} />
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={onDismiss}
          className="rounded p-1 text-muted-foreground transition-all hover:bg-muted active:scale-95"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}