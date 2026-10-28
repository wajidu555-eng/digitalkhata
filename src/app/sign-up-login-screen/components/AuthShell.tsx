'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthBrandPanel from './AuthBrandPanel';
import AuthForm from './AuthForm';
import DemoCredentials from './DemoCredentials';
import LanguageSwitcher from './LanguageSwitcher';
import { copy, type LangCode, type AuthFormValues } from './authCopy';

export default function AuthShell() {
  const [lang, setLang] = useState<LangCode>('en');
  const form = useForm<AuthFormValues>({
    defaultValues: { fullName: '', businessName: '', email: '', password: '', remember: true, agree: false },
    mode: 'onSubmit',
  });
  const t = copy[lang];
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <div dir={dir} lang={lang} className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel lang={lang} />
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-end gap-3 px-6 py-4 lg:px-12">
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-10">
          <AuthForm lang={lang} form={form} />
          <DemoCredentials
            title={t.demoTitle}
            roleLabel={t.role}
            emailLabel={t.email}
            useLabel={t.useThis}
            onUse={(email, password) => {
              form.setValue('email', email);
              form.setValue('password', password);
            }}
          />
        </div>
        <p className="px-6 pb-6 text-center text-xs text-muted-foreground lg:px-12">
          {t.footer}
        </p>
      </div>
    </div>
  );
}