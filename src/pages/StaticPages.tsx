import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, Mail, MapPin, Phone, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

interface StaticPageProps {
  pageType: 'about' | 'contact' | 'disclosure' | 'privacy' | 'terms' | 'saved' | 'profile';
  onNavigate: (path: string) => void;
}

export const StaticPages: React.FC<StaticPageProps> = ({ pageType, onNavigate }) => {
  const { language, settings, wishlist, user, logout } = useApp();
  const isAr = language === 'ar';

  // Saved Wishlist products
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Profile password change state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  useEffect(() => {
    if (pageType === 'saved' && wishlist.length > 0) {
      setLoadingSaved(true);
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          const matched = (data.products || []).filter((p: Product) => wishlist.includes(p.id));
          setSavedProducts(matched);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoadingSaved(false));
    }
  }, [pageType, wishlist]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currPass,
          new_password: newPass
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(isAr ? data.error_ar || data.error : data.error);
      setPassSuccess(true);
      setCurrPass('');
      setNewPass('');
    } catch (err: any) {
      setPassError(err.message);
    }
  };

  // 1. SAVED WISHLIST
  if (pageType === 'saved') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-amber-500 fill-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'قائمة المنتجات المحفوظة في المفضلة' : 'Saved Wishlist'} ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-500 text-sm">{isAr ? 'لم تحفظ أي منتجات في قائمتك المفضلة حتى الآن' : 'Your wishlist is currently empty'}</p>
            <button
              onClick={() => onNavigate('/products')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              {isAr ? 'استعراض المنتجات' : 'Browse Products'}
            </button>
          </div>
        ) : loadingSaved ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. USER PROFILE
  if (pageType === 'profile') {
    if (!user) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-sm text-slate-600">{isAr ? 'يرجى تسجيل الدخول لعرض الملف الشخصي' : 'Please sign in to view your profile'}</p>
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
          >
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">{isAr ? 'الملف الشخصي والحساب' : 'Account Profile'}</h1>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{user.username}</h3>
              <span className="text-xs text-slate-500">{user.email}</span>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full uppercase">
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">{isAr ? 'جلسة تسجيل الدخول الحالية نشطة' : 'Active Session'}</span>
            <button
              onClick={() => {
                logout();
                onNavigate('/');
              }}
              className="px-4 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
            >
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Change password card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h3>

          {passSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'تم تحديث كلمة المرور بنجاح' : 'Password changed successfully'}</span>
            </div>
          )}

          {passError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                required
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
            >
              {isAr ? 'حفظ كلمة المرور' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. AFFILIATE DISCLOSURE
  if (pageType === 'disclosure') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
          <ShieldCheck className="w-4 h-4" />
          <span>{isAr ? 'الشفافية والإفصاح القانوني' : 'Legal & Compliance'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isAr ? 'إفصاح روابط التسويق بالعمولة (Affiliate Disclosure)' : 'Affiliate Disclosure'}
        </h1>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            {isAr
              ? 'تلتزم منصة Bably | بابلي بأعلى معايير الشفافية والمصداقية مع متابعيها وزوارها. نود إحاطتكم علماً بأن بابلي يشارك في برامج التسويق بالعمولة الرسمية المقدمة من المتاجر العالمية المعتمدة، بما في ذلك:'
              : 'Bably participates in official affiliate programs with certified global retailers, including:'}
          </p>

          <ul className="list-disc list-inside space-y-1 text-slate-600 ps-2">
            <li>Amazon Associates Program</li>
            <li>AliExpress Portals Affiliate Program</li>
            <li>eBay Partner Network (EPN)</li>
            <li>CJ Affiliate Network (Commission Junction)</li>
          </ul>

          <h3 className="font-bold text-slate-900 text-sm pt-2">
            {isAr ? 'ماذا يعني ذلك بالنسبة لك كمشتري؟' : 'What does this mean for you?'}
          </h3>

          <p>
            {isAr
              ? 'عند النقر على أي رابط شراء خارجي (/go/...) وإتمام عملية شراء على موقع المتجر الأصلي، قد يحصل متجر بابلي على عمولة مالية رمزية كتعويض عن التوجيه والإحالة. هذه العمولة لا تؤثر مطلقاً على السعر الذي تدفعه، ولن تتحمل أي تكاليف أو رسوم إضافية، بل إن الأسعار المعروضة مطابقة تماماً لأسعار المتجر الأصلي أو قد تكون مدعومة بكوبونات حصرية.'
              : 'When you click an outbound link (/go/...) and make a purchase on the merchant site, Bably may receive a small referral commission. This incurs NO additional cost to you. The price remains identical to the standard retailer price.'}
          </p>

          <h3 className="font-bold text-slate-900 text-sm pt-2">
            {isAr ? 'استقلالية التقييم والمقارنة' : 'Editorial Independence'}
          </h3>

          <p>
            {isAr
              ? 'جميع تقييمات المنتجات وجداول المقارنة والأدلة التحريرية تُعد بشكل مستقل وبناءً على مواصفات المنتجات الحقيقية، والخامات المستخدمة، ومراجعات المشترين الفعليين، بغض النظر عن نسبة العمولة.'
              : 'Our product comparisons, fabric breakdowns, and size conversion guides are authored independently based on authentic product specifications and verified buyer feedback.'}
          </p>
        </div>
      </div>
    );
  }

  // 4. ABOUT US
  if (pageType === 'about') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isAr ? 'عن متجر ومنصة Bably | بابلي' : 'About Bably'}
        </h1>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            {isAr
              ? 'بابلي (Bably) هي منصة التسوق والأفلييت المتطورة المصممة خصيصاً لتوفير تجربة تسوق عالمية ذكية بالدينار العراقي. نقوم بربطك مباشرة بأضخم المتاجر العالمية مثل Amazon و AliExpress و eBay و CJ Affiliate مع تحديث دوري للأسعار وتحويل فوري لأسعار الصرف.'
              : 'Bably is an innovative affiliate e-commerce aggregator designed to provide seamless access to international fashion and lifestyle products converted directly to Iraqi Dinar (IQD).'}
          </p>
          <p>
            {isAr
              ? 'نتميز بقسم متفرد للأزياء والموضة يقدم أدوات متقدمة لمقارنة خامات الملابس (قطن، صوف، حرير، دنيم) وجداول تحويل المقاسات بين الأنظمة العالمية (EU, US, UK, Asian) لتجربة شراء مريحة وخالية من المفاجآت.'
              : 'Our dedicated fashion hub features comprehensive size conversion matrices and side-by-side fabric comparisons.'}
          </p>
        </div>
      </div>
    );
  }

  // 5. CONTACT US
  if (pageType === 'contact') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAr ? 'نسعد باستقبال استفساراتك واقتراحات المتاجر والمنتجات' : 'We welcome your inquiries, feedback, and merchant suggestions'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-xs text-slate-600">
            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
                <span>{settings?.contact_email || 'support@bably.store'}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">{isAr ? 'خدمة العملاء' : 'Customer Support'}</span>
                <span className="tabular-nums">{settings?.contact_phone || '+964 770 000 0000'}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">{isAr ? 'المقر' : 'Headquarters'}</span>
                <span>بغداد - شارع المنصور، العراق</span>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleContactSubmit} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            {contactSent && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'تم استلام رسالتك وسنرد عليك قريباً' : 'Message received! We will reply shortly.'}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'الرسالة أو الاستفسار' : 'Message'}</label>
              <textarea
                required
                rows={3}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              {isAr ? 'إرسال الرسالة' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 6. PRIVACY & TERMS
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
        {pageType === 'privacy' ? (isAr ? 'سياسة الخصوصية' : 'Privacy Policy') : (isAr ? 'الشروط والأحكام' : 'Terms & Conditions')}
      </h1>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          {isAr
            ? 'نحن في بابلي نحترم خصوصيتك بالكامل. لا نقوم بتخزين تفاصيل بطاقات الدفع أو البيانات المصرفية السرية الخاصة بك، حيث تجري جميع المعاملات على صفحات المتاجر الرسمية الموثوقة.'
            : 'At Bably, we respect your privacy. We do not store payment card information or banking secrets.'}
        </p>
        <p>
          {isAr
            ? 'يتم استخدام الكوكيز ومعرفات التتبع لتحسين تجربة التصفح وتوجيه الروابط إلى المتاجر الأصلية بصورة صحيحة وبما يضمن حقوق التتبع.'
            : 'Cookies are utilized solely to enhance your browsing experience and record clean affiliate referral attribution.'}
        </p>
      </div>
    </div>
  );
};
