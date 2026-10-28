'use client';
import React from 'react';
import { Globe2 } from 'lucide-react';
import type { LangCode } from './authCopy';

const options: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
  { code: 'ps', label: 'پښتو' },
];

export default function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: LangCode;
  onChange: (l: LangCode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Globe2 size={16} className="text-muted-foreground" />
      <div className="inline-flex rounded-lg border border-input bg-card p-0.5" role="group" aria-label="Language">
        {options.map((o) => (
          <button
            key={`auth-lang-${o.code}`}
            onClick={() => onChange(o.code)}
            aria-pressed={lang === o.code}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
              lang === o.code
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}