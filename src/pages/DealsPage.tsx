import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, Flame, Clock } from 'lucide-react';

interface DealsPageProps {
  onNavigate: (path: string) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onNavigate }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?min_discount=1&sort=discount_desc')
      .then((res) => res.json())
      .then((data) => setDeals(data.products || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Deals Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-10 text-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{isAr ? 'عروض وتخفيضات نشطة وحقيقية' : 'Live Verified Price Drops'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isAr ? 'أقوى الصفقات والخصومات من المتاجر العالمية' : 'Best Verified Discounts & Flash Deals'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-900/80 leading-relaxed">
            {isAr
              ? 'تخفيضات تبدأ من 15% وتصل إلى 35% مع حساب مباشر للسعر بالدينار العراقي وروابط شراء رسمية.'
              : 'Discounts up to 35% across top merchant catalogues with transparent affiliate tracking.'}
          </p>
        </div>

        <div className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/40 text-center shrink-0">
          <div className="text-2xl font-black text-slate-950 tabular-nums">{deals.length}</div>
          <span className="text-xs font-bold text-slate-700">{isAr ? 'صفقة نشطة اليوم' : 'Active Deals'}</span>
        </div>
      </div>

      {/* Grid of Deal Products */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {deals.map((prod) => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      )}

    </div>
  );
};
