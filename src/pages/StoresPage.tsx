import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Store } from '../types';
import { RefreshCw, ExternalLink, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface StoresPageProps {
  onNavigate: (path: string) => void;
}

export const StoresPage: React.FC<StoresPageProps> = ({ onNavigate }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stores')
      .then((res) => res.json())
      .then((data) => setStores(data.stores || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isAr ? 'المتاجر والمنصات العالمية الشريكة' : 'Global Merchant Network'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {isAr
            ? 'نقوم بجمع وفحص ومزامنة العروض من أكبر المتاجر العالمية المعتمدة لضمان حصولك على أفضل سعر رسمي وجودة شحن حقيقية.'
            : 'We aggregate, verify, and continuously sync deals from verified global merchants with authentic affiliate tracking.'}
        </p>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-800 text-sm tracking-wide">
                      {store.name.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{store.name}</h3>
                      <span className="text-[11px] text-slate-400">
                        Affiliate Tracking ID: <span className="font-mono text-slate-600">{store.affiliate_id}</span>
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isAr ? 'متصل ونشط' : 'Active API'}</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-6">
                  <div className="flex items-center justify-between">
                    <span>{isAr ? 'عدد المنتجات المتزامنة:' : 'Synced Products:'}</span>
                    <span className="font-bold text-slate-900 tabular-nums">{store.products_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isAr ? 'تكرار المزامنة التلقائية:' : 'Sync Frequency:'}</span>
                    <span className="font-semibold text-slate-700">{isAr ? `كل ${store.sync_frequency_hours} ساعات` : `Every ${store.sync_frequency_hours}h`}</span>
                  </div>
                  {store.last_synced_at && (
                    <div className="flex items-center justify-between">
                      <span>{isAr ? 'آخر فحص لكتالوج المتجر:' : 'Last Catalog Sync:'}</span>
                      <span className="text-slate-500">{store.last_synced_at.split('T')[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/products?store=${store.slug}`)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isAr ? `تصفح عروض ${store.name}` : `Browse ${store.name} Deals`}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <a
                  href={store.base_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <span>{isAr ? 'زيارة الموقع الرسمي' : 'Official Site'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Network Trust Statement */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p>
          {isAr
            ? 'ملاحظة الأمان والمصداقية: يتم إنشاء جميع روابط الشراء والخصومات عبر القنوات الرسمية (Amazon Associates, AliExpress Portals, eBay Partner Network, CJ Affiliate). لا يقوم متجر بابلي بجمع مدفوعاتك، وإنما تتم كل المعاملات بأمان تام على الموقع الأصلي للمتجر.'
            : 'Security Notice: All purchase links and price records are mapped directly through verified affiliate APIs. Bably never handles payment credentials; transactions execute securely on the merchants official domain.'}
        </p>
      </div>

    </div>
  );
};
