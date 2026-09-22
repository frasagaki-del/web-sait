import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ForcedPasswordChangeModal: React.FC = () => {
  const { showForcedPasswordModal, setShowForcedPasswordModal, user, setUser, language } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAr = language === 'ar';

  if (!showForcedPasswordModal || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(isAr ? 'يجب ألا تقل كلمة المرور عن 8 أحرف وأرقام' : 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(isAr ? data.error_ar || data.error : data.error);

      // Update local user state to clear flag
      setUser({ ...user, requires_password_change: false });
      setShowForcedPasswordModal(false);
    } catch (err: any) {
      setError(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-500">
        
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {isAr ? 'إجراء أمني إلزامي: تعيين كلمة مرور جديدة' : 'Mandatory Security Action: Set New Password'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'يرجى تغيير كلمة المرور المؤقتة لمتابعة استخدام الحساب' : 'Please change your initial temporary password'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'كلمة المرور الجديدة (8 أحرف على الأقل)' : 'New Password (min 8 chars)'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute start-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
            </label>
            <div className="relative">
              <CheckCircle2 className="w-4 h-4 absolute start-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (isAr ? 'جارِ الحفظ والتأمين...' : 'Saving...') : isAr ? 'تأكيد وحفظ كلمة المرور' : 'Confirm & Save Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
