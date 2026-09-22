import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ArrowLeftRight, Trash2, ExternalLink, Plus, Star, CheckCircle, XCircle } from 'lucide-react';

interface FashionComparePageProps {
  onNavigate: (path: string) => void;
}

export const FashionComparePage: React.FC<FashionComparePageProps> = ({ onNavigate }) => {
  const { compareItems, removeFromCompare, formatPrice, language } = useApp();
  const isAr = language === 'ar';

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { addToCompare } = useApp();

  useEffect(() => {
    fetch('/api/products?is_fashion=true')
      .then((res) => res.json())
      .then((data) => setAvailableProducts(data.products || []))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <span>{isAr ? 'أداة المقارنة الفنية للأزياء والملابس' : 'Fashion Comparison Suite'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'مقارنة مواصفات المنتجات والخامات' : 'Side-by-Side Product Comparison'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'قارن الأسعار الحقيقية، الخامات، المقاسات، والتقييمات لاختيار أفضل صفقة شراء'
              : 'Compare prices, fabrics, sizing systems, and ratings to make an informed decision.'}
          </p>
        </div>

        {compareItems.length < 4 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إضافة منتج للمقارنة' : 'Add Product'}</span>
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ArrowLeftRight className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isAr ? 'لم تختر أي منتجات للمقارنة بعد' : 'No items in comparison list'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isAr
              ? 'تصفح تشكيلة الملابس والأحذية وانقر على زر المقارنة (⇄) في بطاقة أي منتج لإضافته هنا.'
              : 'Browse our fashion catalog and click the compare icon (⇄) on any product to compare specifications.'}
          </p>
          <button
            onClick={() => onNavigate('/products')}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors shadow-sm"
          >
            {isAr ? 'تصفح الأزياء والمنتجات الآن' : 'Browse Catalog'}
          </button>
        </div>
      ) : (
        /* The Detailed Comparison Matrix */
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-xs text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-start font-bold text-slate-500 w-48 min-w-[160px]">
                  {isAr ? 'المعيار / المنتج' : 'Feature / Product'}
                </th>
                {compareItems.map((prod) => (
                  <th key={prod.id} className="p-4 text-start font-semibold text-slate-900 w-64 min-w-[220px]">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        title={isAr ? 'إزالة من المقارنة' : 'Remove'}
                        className="absolute top-0 end-0 p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
                        <img
                          src={prod.primary_image}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {isAr ? prod.title : prod.title_en}
                      </div>

                      <div className="text-base font-extrabold text-slate-900 tabular-nums">
                        {formatPrice(prod.current_price)}
                      </div>

                      <a
                        href={`/go/${prod.affiliate_slug || prod.slug}`}
                        target="_blank"
                        rel="sponsored nofollow"
                        className="w-full py-2 px-3 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>{isAr ? `شراء من ${prod.store_name}` : `Buy at ${prod.store_name}`}</span>
                        <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Row: Brand */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'الماركة والعلامة' : 'Brand'}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-slate-900">{p.brand_name || '—'}</td>
                ))}
              </tr>

              {/* Row: Store */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'المتجر الأصلي' : 'Original Merchant'}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">{p.store_name || '—'}</td>
                ))}
              </tr>

              {/* Row: Material */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'الخامة والقماش' : 'Material / Fabric'}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-medium">{p.material || '—'}</td>
                ))}
              </tr>

              {/* Row: Clothing Type & Gender */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'نوع القطعة والفئة' : 'Type & Gender'}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    <span>{p.clothing_type || '—'}</span>
                    <span className="block text-[11px] text-slate-400 capitalize">{p.gender}</span>
                  </td>
                ))}
              </tr>

              {/* Row: Supported Sizes */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'المقاسات المتوفرة' : 'Available Sizes'}</td>
                {compareItems.map((p) => {
                  const sizes = Array.from(new Set((p.variants || []).map((v) => v.size)));
                  return (
                    <td key={p.id} className="p-4">
                      {sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sizes.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">قياسي</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Available Colors */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'الألوان المتاحة' : 'Colors'}</td>
                {compareItems.map((p) => {
                  const colors = Array.from(new Map((p.variants || []).map((v) => [v.color_name, v])).values());
                  return (
                    <td key={p.id} className="p-4">
                      {colors.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {colors.map((c) => (
                            <span
                              key={c.color_name}
                              title={c.color_name}
                              className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: c.color_hex }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Rating */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'التقييم والمراجعات' : 'Customer Rating'}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-1 text-amber-600 font-bold tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{p.rating} / 5</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">({p.reviews_count} {isAr ? 'تقييم' : 'reviews'})</span>
                  </td>
                ))}
              </tr>

              {/* Row: Stock */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700">{isAr ? 'حالة التوفر' : 'Availability'}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.is_in_stock ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? 'متوفر بالمخزن' : 'In Stock'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? 'غير متوفر' : 'Out of Stock'}</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {isAr ? 'اختر منتجاً لإضافته إلى المقارنة' : 'Select a Product to Compare'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                إغلاق
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 py-2 flex-1 space-y-1">
              {availableProducts
                .filter((p) => !compareItems.some((ci) => ci.id === p.id))
                .map((p) => (
                  <div key={p.id} className="py-2 px-1 flex items-center justify-between hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={p.primary_image} alt={p.title} referrerPolicy="no-referrer" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{p.title}</h4>
                        <span className="text-[11px] font-bold text-slate-600 tabular-nums">{formatPrice(p.current_price)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCompare(p);
                        setShowAddModal(false);
                      }}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                    >
                      {isAr ? 'اختيار' : 'Select'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
