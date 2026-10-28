export type LangCode = 'en' | 'ur' | 'ps';

export interface AuthFormValues {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
  remember: boolean;
  agree: boolean;
}

export interface AuthCopy {
  tagline: string;
  headline: string;
  sub: string;
  signIn: string;
  signUp: string;
  reset: string;
  welcome: string;
  welcomeSub: string;
  createTitle: string;
  createSub: string;
  resetTitle: string;
  resetSub: string;
  fullName: string;
  businessName: string;
  email: string;
  password: string;
  remember: string;
  forgot: string;
  agree: string;
  btnSignIn: string;
  btnSignUp: string;
  btnReset: string;
  or: string;
  google: string;
  demoTitle: string;
  role: string;
  useThis: string;
  footer: string;
  invalidCreds: string;
  required: string;
  emailInvalid: string;
  pwMin: string;
  agreeReq: string;
  resetSent: string;
  verifySent: string;
}

export const copy: Record<LangCode, AuthCopy> = {
  en: {
    tagline: 'Multi-currency ledger for traders',
    headline: 'Every afghani, rupee and dollar — accounted for.',
    sub: 'Post credit sales and payments per customer, per currency. Balances stay reconciled even when your whole team posts at once.',
    signIn: 'Sign in',
    signUp: 'Create account',
    reset: 'Reset password',
    welcome: 'Welcome back',
    welcomeSub: 'Sign in to open your business ledger.',
    createTitle: 'Create your business workspace',
    createSub: 'Free for the first 100 ledger entries per month.',
    resetTitle: 'Reset your password',
    resetSub: 'We will email a secure reset link to your verified address.',
    fullName: 'Full name',
    businessName: 'Business name',
    email: 'Email address',
    password: 'Password',
    remember: 'Keep me signed in on this device',
    forgot: 'Forgot password?',
    agree: 'I agree to the Terms of Service and Privacy Policy',
    btnSignIn: 'Sign in to ledger',
    btnSignUp: 'Create workspace',
    btnReset: 'Send reset link',
    or: 'or',
    google: 'Continue with Google',
    demoTitle: 'Demo accounts — click a row to autofill',
    role: 'Role',
    useThis: 'Use',
    footer: '© 2026 DigitalKhata · Data encrypted at rest · Tenant isolated',
    invalidCreds: 'Invalid credentials — use the demo accounts below to sign in',
    required: 'This field is required',
    emailInvalid: 'Enter a valid email address',
    pwMin: 'Password must be at least 8 characters',
    agreeReq: 'You must accept the terms to continue',
    resetSent: 'Reset link sent. Check your inbox.',
    verifySent: 'Verification email sent. Confirm your address to continue.',
  },
  ur: {
    tagline: 'تاجروں کے لیے کثیر کرنسی کھاتہ',
    headline: 'ہر افغانی، روپیہ اور ڈالر کا مکمل حساب۔',
    sub: 'ہر گاہک اور ہر کرنسی کے لیے ادھار اور ادائیگی درج کریں۔ پوری ٹیم ایک ساتھ اندراج کرے تب بھی بیلنس درست رہتا ہے۔',
    signIn: 'سائن اِن',
    signUp: 'اکاؤنٹ بنائیں',
    reset: 'پاسورڈ ری سیٹ',
    welcome: 'خوش آمدید',
    welcomeSub: 'اپنا کاروباری کھاتہ کھولنے کے لیے سائن اِن کریں۔',
    createTitle: 'اپنا کاروباری ورک اسپیس بنائیں',
    createSub: 'ہر ماہ پہلے 100 اندراجات مفت۔',
    resetTitle: 'پاسورڈ ری سیٹ کریں',
    resetSub: 'ہم آپ کے تصدیق شدہ ای میل پر محفوظ لنک بھیجیں گے۔',
    fullName: 'پورا نام',
    businessName: 'کاروبار کا نام',
    email: 'ای میل ایڈریس',
    password: 'پاسورڈ',
    remember: 'اس ڈیوائس پر سائن اِن رکھیں',
    forgot: 'پاسورڈ بھول گئے؟',
    agree: 'میں شرائط اور پرائیویسی پالیسی سے متفق ہوں',
    btnSignIn: 'کھاتے میں داخل ہوں',
    btnSignUp: 'ورک اسپیس بنائیں',
    btnReset: 'ری سیٹ لنک بھیجیں',
    or: 'یا',
    google: 'گوگل کے ساتھ جاری رکھیں',
    demoTitle: 'ڈیمو اکاؤنٹس — خودکار بھرنے کے لیے قطار پر کلک کریں',
    role: 'کردار',
    useThis: 'استعمال',
    footer: '© 2026 ڈیجیٹل کھاتہ · ڈیٹا محفوظ · ہر کاروبار الگ',
    invalidCreds: 'غلط اسناد — نیچے دیے گئے ڈیمو اکاؤنٹس استعمال کریں',
    required: 'یہ خانہ ضروری ہے',
    emailInvalid: 'درست ای میل درج کریں',
    pwMin: 'پاسورڈ کم از کم 8 حروف کا ہونا چاہیے',
    agreeReq: 'جاری رکھنے کے لیے شرائط قبول کریں',
    resetSent: 'ری سیٹ لنک بھیج دیا گیا۔ ان باکس چیک کریں۔',
    verifySent: 'تصدیقی ای میل بھیج دی گئی۔ جاری رکھنے کے لیے تصدیق کریں۔',
  },
  ps: {
    tagline: 'د سوداګرو لپاره څو اسعارو کتاب',
    headline: 'هر افغانۍ، روپۍ او ډالر بشپړ حساب شوی.',
    sub: 'د هر پېرودونکي او هر اسعارو لپاره پور او تادیه ثبت کړئ. که ټوله ډله یو ځای ثبت کړي، بیلانس سم پاتې کېږي.',
    signIn: 'ننوتل',
    signUp: 'حساب جوړول',
    reset: 'پاسورډ بیا تنظیمول',
    welcome: 'ښه راغلاست',
    welcomeSub: 'د خپل سوداګریز کتاب د پرانیستو لپاره ننوځئ.',
    createTitle: 'خپل سوداګریز کاري ځای جوړ کړئ',
    createSub: 'په میاشت کې لومړي 100 ثبتونه وړیا.',
    resetTitle: 'پاسورډ بیا تنظیم کړئ',
    resetSub: 'موږ به ستاسو تایید شوي بریښنالیک ته خوندي لینک ولېږو.',
    fullName: 'بشپړ نوم',
    businessName: 'د سوداګرۍ نوم',
    email: 'بریښنالیک پته',
    password: 'پاسورډ',
    remember: 'پدې وسیله کې ننوتلی وساتئ',
    forgot: 'پاسورډ مو هیر شو؟',
    agree: 'زه له شرایطو او د محرمیت تګلارې سره موافق یم',
    btnSignIn: 'کتاب ته ننوتل',
    btnSignUp: 'کاري ځای جوړول',
    btnReset: 'د بیا تنظیم لینک ولېږئ',
    or: 'یا',
    google: 'د ګوګل سره دوام ورکړئ',
    demoTitle: 'ډیمو حسابونه — د ډکولو لپاره قطار کلیک کړئ',
    role: 'رول',
    useThis: 'کارول',
    footer: '© 2026 ډیجیټل کتاب · معلومات خوندي · هر سوداګري جلا',
    invalidCreds: 'ناسم اسناد — لاندې ډیمو حسابونه وکاروئ',
    required: 'دا ډګر اړین دی',
    emailInvalid: 'سم بریښنالیک ولیکئ',
    pwMin: 'پاسورډ باید لږ تر لږه 8 توري وي',
    agreeReq: 'د دوام لپاره شرایط ومنئ',
    resetSent: 'د بیا تنظیم لینک ولېږل شو. خپل ان‌باکس وګورئ.',
    verifySent: 'د تایید بریښنالیک ولېږل شو. د دوام لپاره تایید کړئ.',
  },
};

export const demoAccounts = [
  { id: 'demo-owner', role: 'Owner', email: 'owner@walitrading.af', password: 'Khata#Owner2026' },
  { id: 'demo-accountant', role: 'Accountant', email: 'rahila.s@walitrading.af', password: 'Khata#Acct2026' },
  { id: 'demo-staff', role: 'Staff', email: 'bashir.a@walitrading.af', password: 'Khata#Staff2026' },
];