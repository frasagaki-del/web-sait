import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Brand } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { Sparkles, Ruler, ArrowLeftRight, ArrowLeft, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface FashionPageProps {
  onNavigate: (path: string) => void;
  subDepartment?: 'men' | 'women' | 'kids' | 'shoes' | 'sportswear';
}

export const FashionPage: React.FC<FashionPageProps> = ({ onNavigate, subDepartment }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeSub, setActiveSub] = useState<string>(subDepartment || 'all');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subDepartment) setActiveSub(subDepartment);
  }, [subDepartment]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, brandRes] = await Promise.all([
          fetch('/api/products?is_fashion=true'),
          fetch('/api/fashion/brands')
        ]);
        if (prodRes.ok) setProducts((await prodRes.json()).products || []);
        if (brandRes.ok) setBrands((await brandRes.json()).brands || []);
      } catch (e) {
        console.error('Error fetching fashion data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    if (activeSub === 'all') return true;
    if (activeSub === 'men') return p.gender === 'men';
    if (activeSub === 'women') return p.gender === 'women';
    if (activeSub === 'kids') return p.gender === 'kids';
    if (activeSub === 'shoes') return p.category_id === 'cat_shoes' || p.clothing_type?.includes('حذاء');
    if (activeSub === 'sportswear') return p.clothing_type?.includes('رياضي') || p.category_id === 'cat_sportswear';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* Fashion Header Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'عالم الأزياء والموضة العالمية' : 'Global Fashion Boutique'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isAr ? 'قسم الأزياء، الأحذية، والملابس الفاخرة' : 'Fashion, Apparel & Luxury Footwear'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAr
              ? 'مجموعة منتقاة من أشهر العلامات التجارية العالمية (Zara, Nike, Adidas, Levi\'s) مع جداول مقاسات دقيقة ودعم كامل للمقارنة السريعة بين الخامات.'
              : 'Curated apparel, shoes, and timeless wardrobe staples with certified sizing charts and side-by-side material comparisons.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowSizeGuide(true)}
              className="px-4 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <Ruler className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'دليل المقاسات الموحد' : 'Universal Size Guide'}</span>
            </button>

            <button
              onClick={() => onNavigate('/fashion/compare')}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{isAr ? 'أداة مقارنة مواصفات الملابس' : 'Clothing Comparison Matrix'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subcategory Navigation Pills */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto border-b border-slate-200">
        {[
          { id: 'all', label: isAr ? 'جميع الأزياء' : 'All Fashion' },
          { id: 'men', label: isAr ? 'أزياء رجالية' : "Men's" },
          { id: 'women', label: isAr ? 'أزياء نسائية' : "Women's" },
          { id: 'shoes', label: isAr ? 'أحذية وسنيكرز' : 'Shoes & Sneakers' },
          { id: 'kids', label: isAr ? 'أطفال ومواليد' : "Kids' Wear" },
          { id: 'sportswear', label: isAr ? 'ملابس رياضية' : 'Activewear' }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSub(sub.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeSub === sub.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Fashion Brands Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            {isAr ? 'ماركات الأزياء المعتمدة' : 'Fashion Brands'}
          </h2>
          <button
            onClick={() => onNavigate('/brands')}
            className="text-xs text-amber-600 font-semibold hover:underline"
          >
            {isAr ? 'استعراض كل الماركات' : 'View all'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {brands.map((b) => (
            <div
              key={b.id}
              onClick={() => onNavigate(`/products?brand=${b.slug}`)}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-sm transition-all cursor-pointer text-center group"
            >
              <span className="font-extrabold text-sm text-slate-800 group-hover:text-amber-600 block">
                {b.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {b.product_count} {isAr ? 'منتج متاح' : 'products'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {isAr ? 'التشكيلة المختارة' : 'Curated Apparel'}
          </h2>
          <span className="text-xs text-slate-500">
            {filtered.length} {isAr ? 'عنصر' : 'items'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">{isAr ? 'لا توجد عناصر مطابقة في هذا التصنيف' : 'No items found'}</p>
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

    </div>
  );
};
