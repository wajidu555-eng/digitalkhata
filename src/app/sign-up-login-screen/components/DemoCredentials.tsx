'use client';
import React, { useState } from 'react';
import { Copy, Check, KeyRound } from 'lucide-react';
import { demoAccounts } from './authCopy';

export default function DemoCredentials({
  title,
  roleLabel,
  emailLabel,
  useLabel,
  onUse,
}: {
  title: string;
  roleLabel: string;
  emailLabel: string;
  useLabel: string;
  onUse: (email: string, password: string) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyPw = async (id: string, pw: string) => {
    try {
      await navigator.clipboard.writeText(pw);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mt-8 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <KeyRound size={14} className="text-accent" />
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="px-4 py-2 text-start font-semibold">{roleLabel}</th>
            <th className="px-2 py-2 text-start font-semibold">{emailLabel}</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {demoAccounts.map((a) => (
            <tr key={a.id} className="transition-colors hover:bg-muted/50">
              <td className="px-4 py-2.5 font-semibold">{a.role}</td>
              <td className="px-2 py-2.5 text-xs text-muted-foreground" dir="ltr">
                {a.email}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => copyPw(a.id, a.password)}
                    aria-label={`Copy password for ${a.role}`}
                    className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-95"
                  >
                    {copied === a.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => onUse(a.email, a.password)}
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground transition-all duration-150 hover:bg-primary hover:text-primary-foreground active:scale-95"
                  >
                    {useLabel}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}