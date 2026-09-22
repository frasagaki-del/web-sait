import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Brand } from '../types';
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';

interface BrandsPageProps {
  onNavigate: (path: string) => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ onNavigate }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fashion/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isAr ? 'دليل الماركات والعلامات العالمية' : 'Global Brands Directory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {isAr
            ? 'تصفح منتجات أشهر بيوت الأزياء والماركات الرياضية العالمية المعتمدة مع روابط شراء رسمية.'
            : 'Explore premier sports, casual, and luxury fashion brands with authentic product catalogues.'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {b.name}
                  </h3>
                  <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full font-bold text-slate-700 tabular-nums">
                    {b.product_count || 0} {isAr ? 'منتج' : 'items'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {isAr ? b.description : b.description_en}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/products?brand=${b.slug}`)}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isAr ? 'تصفح التشكيلة' : 'View Catalog'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                {b.official_website && (
                  <a
                    href={b.official_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    <span>الموقع الرسمي</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
