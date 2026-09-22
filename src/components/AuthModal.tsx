import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login, language } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google sign-in custom dialog
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const isAr = language === 'ar';

  if (!showAuthModal) return null;

  // Handle standard password login/register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(isAr ? data.error_ar || data.error : data.error);
        setIsRegister(false);
        setError(isAr ? 'تم إنشاء الحساب بنجاح، يرجى تسجيل الدخول' : 'Account created, please sign in');
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(isAr ? data.error_ar || data.error : data.error);
        login(data.user, data.token);
        setShowAuthModal(false);
      }
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ غير متوقع' : 'Unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleAuth = async (googleEmail: string, name?: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          name: name || googleEmail.split('@')[0]
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(isAr ? data.error_ar || data.error : data.error);

      login(data.user, data.token);
      setShowAuthModal(false);
      setShowGooglePrompt(false);
    } catch (err: any) {
      setError(err.message || (isAr ? 'تعذر إتمام الدخول بواسطة Google' : 'Google sign-in failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-extrabold text-lg">✦</span>
            <h3 className="font-bold text-slate-900 text-base">
              {isRegister ? (isAr ? 'إنشاء حساب جديد' : 'Create Account') : (isAr ? 'تسجيل الدخول إلى بابلي' : 'Sign In to Bably')}
            </h3>
          </div>
          <button
            onClick={() => {
              setShowAuthModal(false);
              setShowGooglePrompt(false);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* GOOGLE SIGN IN BUTTON */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowGooglePrompt(true)}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50"
          >
            {/* Google official SVG logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isAr ? 'المتابعة والدخول باستخدام Google' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* GOOGLE ACCOUNT QUICK SELECTOR MODAL */}
        {showGooglePrompt && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                {isAr ? 'اختر حساب Google للمتابعة:' : 'Select Google Account:'}
              </span>
              <button
                type="button"
                onClick={() => setShowGooglePrompt(false)}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>

            {/* Quick Option: frasagaki@gmail.com (Guaranteed Admin) */}
            <button
              type="button"
              onClick={() => handleGoogleAuth('frasagaki@gmail.com', 'Firas')}
              disabled={loading}
              className="w-full p-2.5 bg-white border border-amber-300 hover:border-amber-500 rounded-lg text-start flex items-center justify-between group transition-all shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  F
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block group-hover:text-amber-700">
                    frasagaki@gmail.com
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{isAr ? 'حساب مدير النظام المعتمد (Admin)' : 'Verified Administrator'}</span>
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                {isAr ? 'دخول فوراً ←' : 'Sign in →'}
              </span>
            </button>

            {/* Custom Google Email Option */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {isAr ? 'أو أدخل بريد Google آخر:' : 'Or use another Google email:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => customGoogleEmail && handleGoogleAuth(customGoogleEmail)}
                  disabled={!customGoogleEmail || loading}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 disabled:opacity-40"
                >
                  {isAr ? 'دخول' : 'Go'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 text-[11px]">
              {isAr ? 'أو بواسطة اسم المستخدم وكلمة المرور' : 'Or with password'}
            </span>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم المستخدم' : 'Username'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute start-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. ahmed_iraq"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute start-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="user@example.com"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute start-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="admin@bably.store"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute start-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? (isAr ? 'جارِ المعالجة...' : 'Processing...') : isRegister ? (isAr ? 'إنشاء حساب' : 'Register') : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {isRegister ? (
            <p>
              {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className="text-amber-600 font-semibold hover:underline"
              >
                {isAr ? 'سجل دخولك الآن' : 'Sign in here'}
              </button>
            </p>
          ) : (
            <p>
              {isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className="text-amber-600 font-semibold hover:underline"
              >
                {isAr ? 'أنشئ حساباً مجانياً' : 'Create free account'}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
