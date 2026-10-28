'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { copy, demoAccounts, type AuthFormValues, type LangCode } from './authCopy';

type Mode = 'signin' | 'signup' | 'reset';

export default function AuthForm({
  lang,
  form,
}: {
  lang: LangCode;
  form: UseFormReturn<AuthFormValues>;
}) {
  const t = copy[lang];
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values: AuthFormValues) => {
    setAuthError(null);
    setInfo(null);
    setLoading(true);
    // Backend integration: call Supabase Auth (signInWithPassword / signUp / resetPasswordForEmail) via server action here
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    if (mode === 'reset') {
      setInfo(t.resetSent);
      return;
    }
    if (mode === 'signup') {
      setInfo(t.verifySent);
      return;
    }
    const ok = demoAccounts.some((a) => a.email === values.email && a.password === values.password);
    if (!ok) {
      setAuthError(t.invalidCreds);
      return;
    }
    router.push('/');
  };

  const title = mode === 'signin' ? t.welcome : mode === 'signup' ? t.createTitle : t.resetTitle;
  const sub = mode === 'signin' ? t.welcomeSub : mode === 'signup' ? t.createSub : t.resetSub;
  const cta = mode === 'signin' ? t.btnSignIn : mode === 'signup' ? t.btnSignUp : t.btnReset;

  const inputCls =
    'h-11 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20';

  return (
    <div>
      <div className="mb-6 inline-flex rounded-lg bg-muted p-1" role="tablist">
        {(['signin', 'signup', 'reset'] as Mode[]).map((m) => (
          <button
            key={`mode-${m}`}
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setAuthError(null);
              setInfo(null);
            }}
            className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
              mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {m === 'signin' ? t.signIn : m === 'signup' ? t.signUp : t.reset}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>

      {authError && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive fade-in" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{authError}</span>
        </div>
      )}
      {info && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 text-sm text-success fade-in" role="status">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{info}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        {mode === 'signup' && (
          <>
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold">
                {t.fullName}
              </label>
              <input
                id="fullName"
                className={inputCls}
                autoComplete="name"
                {...register('fullName', { required: t.required })}
              />
              {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="businessName" className="mb-1.5 block text-sm font-semibold">
                {t.businessName}
              </label>
              <input
                id="businessName"
                className={inputCls}
                autoComplete="organization"
                {...register('businessName', { required: t.required })}
              />
              {errors.businessName && <p className="mt-1 text-xs text-destructive">{errors.businessName.message}</p>}
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
            {t.email}
          </label>
          <input
            id="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            className={inputCls}
            {...register('email', {
              required: t.required,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.emailInvalid },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>

        {mode !== 'reset' && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold">
                {t.password}
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {t.forgot}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                dir="ltr"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className={`${inputCls} pe-11`}
                {...register('password', {
                  required: t.required,
                  minLength: { value: 8, message: t.pwMin },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-95"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
        )}

        {mode === 'signin' && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              {...register('remember')}
            />
            {t.remember}
          </label>
        )}

        {mode === 'signup' && (
          <div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                {...register('agree', { required: t.agreeReq })}
              />
              <span>{t.agree}</span>
            </label>
            {errors.agree && <p className="mt-1 text-xs text-destructive">{errors.agree.message}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all duration-150 hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : mode === 'reset' ? <Mail size={16} /> : null}
          {loading ? '' : cta}
        </button>
      </form>

      {mode !== 'reset' && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t.or}
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-input bg-card text-sm font-semibold transition-all duration-150 hover:bg-muted active:scale-[0.98]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-bold">
              G
            </span>
            {t.google}
          </button>
        </>
      )}
    </div>
  );
}