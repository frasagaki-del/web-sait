import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ExternalLink, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, settings } = useApp();
  const isAr = language === 'ar';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <span className="text-amber-500 font-extrabold">✦</span>
              <span>Bably | بابلي</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'منصة التسوق والأفلييت المتخصصة في تجميع وتتبع أفضل عروض الأزياء والمنتجات من المتاجر العالمية الموثوقة مع تحديث فوري لأسعار الصرف بالدينار العراقي.'
                : 'Your trusted global affiliate shopping aggregator, comparing premier fashion and lifestyle deals with instant local currency rates.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'روابط رسمية ومباشرة 100%' : '100% Verified Merchant Links'}</span>
            </div>
          </div>

          {/* Col 2: Fashion Department */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">
              {isAr ? 'قسم الأزياء والموضة' : 'Fashion Hub'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/fashion/men')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'ملابس رجالية وبدل رسمية' : "Men's Clothing & Suits"}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/fashion/women')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'ملابس نسائية وفساتين سهرة' : "Women's Fashion & Dresses"}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/fashion/shoes')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'أحذية رياضية وسنيكرز' : 'Sneakers & Shoes'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/fashion/kids')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'ملابس أطفال ومواليد' : "Kids' Apparel"}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/fashion/compare')} className="hover:text-amber-400 transition-colors text-amber-500 font-medium">
                  {isAr ? 'مقارنة مواصفات الملابس' : 'Clothing Comparison Table'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Global Stores */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">
              {isAr ? 'المتاجر والشبكات' : 'Stores & Networks'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/stores')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'متجر Amazon العالمي' : 'Amazon Global'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stores')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'علي إكسبرس AliExpress' : 'AliExpress Direct'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stores')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'إيباي eBay' : 'eBay Deals'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stores')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'شبكة CJ Affiliate' : 'CJ Affiliate Network'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/brands')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'الماركات العالمية (Nike, Zara, Adidas)' : 'Global Brands Directory'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">
              {isAr ? 'السياسات والمعلومات' : 'Company & Legal'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'من نحن' : 'About Bably'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'اتصل بنا' : 'Contact Us'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/disclosure')} className="hover:text-amber-400 transition-colors text-amber-400">
                  {isAr ? 'إفصاح الأفلييت والتسويق' : 'Affiliate Disclosure'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'الشروط والأحكام' : 'Terms of Service'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Notice Box */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed mb-8 flex items-start gap-3">
          <Globe className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            {isAr
              ? (settings?.affiliate_disclosure_ar ||
                'إفصاح قانوني: قد يحصل متجر بابلي على عمولة تسويقية عند إتمام عملية شراء من خلال بعض الروابط الموجودة في الموقع، دون أي تكلفة إضافية على المشتري. نهدف دائماً لتقديم مقارنات مستقلة وتحديث دوري لأسعار المتاجر العالمية.')
              : (settings?.affiliate_disclosure_en ||
                'Affiliate Disclosure: Bably may receive an affiliate commission if you purchase products through links on our site, with zero additional cost to you. We provide independent price comparisons and continuous sync with merchant catalogues.')}
          </p>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Bably | بابلي. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <span className="tabular-nums">{isAr ? 'العملة الأساسية: IQD الدينار العراقي' : 'Base Currency: IQD'}</span>
            <span>·</span>
            <button onClick={() => onNavigate('/admin')} className="text-slate-400 hover:text-amber-400 transition-colors">
              {isAr ? 'بوابة الإدارة' : 'Admin Portal'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
