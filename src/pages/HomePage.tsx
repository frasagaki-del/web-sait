import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Store, Brand, BlogPost } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Sparkles, TrendingUp, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, Zap } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language, formatPrice } = useApp();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'men' | 'women' | 'shoes' | 'deals'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, storeRes, brandRes, blogRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/stores'),
          fetch('/api/brands'),
          fetch('/api/blog')
        ]);

        if (prodRes.ok) {
          const d = await prodRes.json();
          setProducts(d.products || []);
        }
        if (storeRes.ok) {
          const d = await storeRes.json();
          setStores(d.stores || []);
        }
        if (brandRes.ok) {
          const d = await brandRes.json();
          setBrands(d.brands || []);
        }
        if (blogRes.ok) {
          const d = await blogRes.json();
          setPosts(d.posts || []);
        }
      } catch (e) {
        console.error('Error fetching home data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedTab === 'deals') return p.discount_percent > 0;
    if (selectedTab === 'men') return p.gender === 'men';
    if (selectedTab === 'women') return p.gender === 'women';
    if (selectedTab === 'shoes') return p.category_id === 'cat_shoes' || p.clothing_type?.includes('حذاء');
    return true;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO CAMPAIGN SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_fashion_bably_1790113945298.jpg"
            alt="Bably Fashion Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center flex flex-col items-center">
          
          {/* Quiet Trust Marker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-4 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'منصة تجميع العروض والأزياء العالمية بالدينار العراقي' : 'Global Affiliate Aggregator & Fashion Hub'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight mb-4 text-balance">
            {isAr
              ? 'تسوّق أرقى الأزياء والماركات العالمية بأفضل الأسعار الموثوقة'
              : 'Discover & Compare Premier Global Fashion Brands at True Market Rates'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
            {isAr
              ? 'نقوم بتتبع ومقارنة الأسعار من Amazon و AliExpress و eBay و CJ Affiliate مع تحويل مباشر بالدينار العراقي وروابط شراء رسمية مضمونة.'
              : 'Continuous price sync across top merchant catalogues with transparent affiliate tracking and size guides.'}
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl flex items-center bg-white p-1.5 rounded-2xl shadow-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute start-4 top-3 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={isAr ? 'ابحث عن "حذاء جري Nike", "فستان حرير", "بليزر صوف", "جينز"...' : 'Search for sneakers, silk dress, blazer, jeans...'}
                className="w-full ps-12 pe-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              {isAr ? 'بحث فوري' : 'Search'}
            </button>
          </form>

          {/* Search Suggestion Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-300">
            <span className="text-slate-400">{isAr ? 'الأكثر بحثاً:' : 'Trending:'}</span>
            {['Nike Air Zoom', 'بدل رسمية Zara', 'فساتين سهرة', 'جينز Levi\'s', 'أحذية رياضية'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
                className="hover:text-amber-400 underline decoration-slate-600 underline-offset-4 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. STORES TICKER & TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-6 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {isAr ? 'مزامنة أسعار حية ومباشرة' : 'Live Auto-Sync Engine'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'تحديث دوري مستمر للأسعار وتوفر المقاسات والخصومات' : 'Continuous catalogue sync every 6 hours'}
              </p>
            </div>
          </div>

          {/* Store Logos */}
          <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto py-1">
            {stores.map((st) => (
              <button
                key={st.id}
                onClick={() => onNavigate(`/stores`)}
                className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
                title={st.name}
              >
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">{st.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/stores')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0"
          >
            <span>{isAr ? 'عرض كل المتاجر' : 'All Stores'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & FASHION HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Segmented Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isAr ? 'أحدث المنتجات والعروض المختارة' : 'Curated Products & Live Deals'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'تم التحقق من الأسعار والروابط وتوفر المقاسات في المخزن' : 'Verified affiliate deals with direct store checkout'}
            </p>
          </div>

          {/* Interactive Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: 'all', label: isAr ? 'الكل' : 'All' },
              { id: 'deals', label: isAr ? 'العروض الأكثر خصماً' : 'Hot Deals' },
              { id: 'men', label: isAr ? 'رجالي' : 'Men' },
              { id: 'women', label: isAr ? 'نسائي' : 'Women' },
              { id: 'shoes', label: isAr ? 'أحذية' : 'Shoes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm text-slate-500">{isAr ? 'لا توجد منتجات ضمن هذا التصنيف حالياً' : 'No products found in this category'}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('/products')}
            className="px-6 py-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>{isAr ? 'استعراض كتالوج المنتجات كاملاً' : 'Browse Full Catalog'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </section>

      {/* 4. FASHION SPECIALIZED HIGHLIGHT: CLOTHING & SHOES COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>{isAr ? 'جديد قسم الأزياء المتخصص' : 'Fashion Comparison Suite'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
              {isAr ? 'قارن خامات ومقاسات الملابس والأحذية قبل الشراء' : 'Compare Fabrics, Sizing & Real Merchant Prices'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'استخدم أداة مقارنة بابلي الذكية للمفاضلة بين الماركات (Zara, Nike, Adidas, Levi\'s)، مع جدول تفصيلي يوضح نوع القماش (صوف، قطن، حرير، دنيم) والتقييم الحقيقي.'
                : 'Side-by-side product comparisons evaluating fabric composition, size standards (EU vs US), customer ratings, and lowest verified merchant price.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/fashion/compare')}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors shadow-sm"
              >
                {isAr ? 'فتح جدول المقارنات الآن' : 'Launch Comparison Tool'}
              </button>
              <button
                onClick={() => onNavigate('/fashion')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                {isAr ? 'زيارة قسم الأزياء' : 'Explore Fashion Hub'}
              </button>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isAr ? 'مقارنة سريعة شائعة' : 'Quick Popular Match'}
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-semibold">Nike Air Zoom Runner</span>
                <span className="font-bold text-amber-400 tabular-nums">155,000 د.ع</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-semibold">Zara Tailored Blazer</span>
                <span className="font-bold text-amber-400 tabular-nums">125,000 د.ع</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Levi's 501 Original</span>
                <span className="font-bold text-amber-400 tabular-nums">88,000 د.ع</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TOP BRANDS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isAr ? 'الماركات العالمية الرائدة' : 'Featured Brands'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{isAr ? 'تسوّق من أفضل بيوت الأزياء والموضة العالمية' : 'Curated authentic brand collections'}</p>
          </div>
          <button
            onClick={() => onNavigate('/brands')}
            className="text-xs font-semibold text-amber-600 hover:underline"
          >
            {isAr ? 'جميع الماركات' : 'View All'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map((br) => (
            <div
              key={br.id}
              onClick={() => onNavigate(`/products?brand=${br.slug}`)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <span className="text-lg font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                {br.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'تصفح التشكيلة' : 'View Collection'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BLOG & BUYING GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isAr ? 'المدونة وأدلة التسوق الذكية' : 'Guides & Editorial'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{isAr ? 'مقالات تفصيلية وجداول مقارنة للمقاسات والخامات' : 'In-depth reviews and size conversion charts'}</p>
          </div>
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-amber-600 hover:underline"
          >
            {isAr ? 'كل المقالات' : 'All Articles'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0, 2).map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-600 block mb-1">{post.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{post.published_at.split('T')[0]}</span>
                  <span className="text-slate-900 font-medium group-hover:translate-x-1 transition-transform">
                    {isAr ? 'قراءة الدليل ←' : 'Read Guide →'}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
};
