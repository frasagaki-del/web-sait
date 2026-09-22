import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, Store, Brand } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, X, RefreshCw, Check } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
  initialBrand?: string;
  initialGender?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigate,
  initialCategory,
  initialBrand,
  initialGender
}) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || '');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>(initialGender || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [minDiscount, setMinDiscount] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync initial props
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialGender) setSelectedGender(initialGender);
  }, [initialCategory, initialBrand, initialGender]);

  // Load auxiliary data
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, storeRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/stores'),
          fetch('/api/brands')
        ]);
        if (catRes.ok) setCategories((await catRes.json()).categories || []);
        if (storeRes.ok) setStores((await storeRes.json()).stores || []);
        if (brandRes.ok) setBrands((await brandRes.json()).brands || []);
      } catch (e) {
        console.error('Error fetching metadata', e);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch filtered products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (selectedStore) params.append('store', selectedStore);
      if (selectedGender) params.append('gender', selectedGender);
      if (selectedSize) params.append('size', selectedSize);
      if (selectedMaterial) params.append('material', selectedMaterial);
      if (selectedSeason) params.append('season', selectedSeason);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (minRating) params.append('min_rating', minRating);
      if (minDiscount) params.append('min_discount', minDiscount);
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Error fetching products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    selectedCategory,
    selectedBrand,
    selectedStore,
    selectedGender,
    selectedSize,
    selectedMaterial,
    selectedSeason,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    sortBy
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedStore('');
    setSelectedGender('');
    setSelectedSize('');
    setSelectedMaterial('');
    setSelectedSeason('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMinDiscount('');
    setSortBy('featured');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    selectedStore,
    selectedGender,
    selectedSize,
    selectedMaterial,
    selectedSeason,
    minPrice,
    maxPrice,
    minRating,
    minDiscount
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Page Title & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'كتالوج المنتجات والعروض' : 'Products & Deals Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? `عرض ${products.length} منتج مفحوص ومطابق مع المتاجر الأصلية`
              : `Showing ${products.length} verified products with direct merchant links`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl flex items-center gap-2 text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'الفلاتر والتصفية' : 'Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">{isAr ? 'الترتيب حسب:' : 'Sort by:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm cursor-pointer"
            >
              <option value="featured">{isAr ? 'الأكثر تميزاً وشعبية' : 'Featured'}</option>
              <option value="price_asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price_desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="discount_desc">{isAr ? 'أعلى نسبة خصم %' : 'Highest Discount %'}</option>
              <option value="rating_desc">{isAr ? 'أعلى تقييم للعملاء' : 'Highest Rating'}</option>
              <option value="newest">{isAr ? 'أحدث العروض المضافة' : 'Newest'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto block'
              : 'hidden'
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 lg:hidden">
              <span className="font-bold text-slate-900">{isAr ? 'تصفية النتائج' : 'Filters'}</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'الفلاتر النشطة' : 'Active Filters'}</span>
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  {isAr ? 'مسح الكل' : 'Clear all'}
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'التصنيف والفئة' : 'Category'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
              >
                <option value="">{isAr ? 'جميع الفئات' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {isAr ? c.name : c.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'المتجر الأصلي' : 'Original Store'}
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
              >
                <option value="">{isAr ? 'جميع المتاجر (Amazon, AliExpress, eBay...)' : 'All Stores'}</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'الماركة والعلامة التجارية' : 'Brand'}
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
              >
                <option value="">{isAr ? 'جميع الماركات' : 'All Brands'}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fashion: Gender Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'الجنس والنوع' : 'Gender'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: '', label: isAr ? 'الكل' : 'All' },
                  { id: 'men', label: isAr ? 'رجالي' : 'Men' },
                  { id: 'women', label: isAr ? 'نسائي' : 'Women' },
                  { id: 'kids', label: isAr ? 'أطفال' : 'Kids' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
                      selectedGender === g.id
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fashion: Size Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'المقاس' : 'Size'}
              </label>
              <div className="flex flex-wrap gap-1">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '42', '43', '44'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      selectedSize === sz
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fashion: Material */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'الخامة والقماش' : 'Material / Fabric'}
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
              >
                <option value="">{isAr ? 'جميع الخامات' : 'All Materials'}</option>
                <option value="Cotton">Cotton / قطن</option>
                <option value="Wool">Wool / صوف</option>
                <option value="Silk">Silk / حرير</option>
                <option value="Denim">Denim / دنيم وجينز</option>
                <option value="Mesh">Mesh / شبكي رياضي</option>
              </select>
            </div>

            {/* Price Filter (in IQD) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'نطاق السعر (بالدينار العراقي)' : 'Price Range (IQD)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={isAr ? 'الحد الأدنى' : 'Min'}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 tabular-nums focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={isAr ? 'الحد الأعلى' : 'Max'}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 tabular-nums focus:outline-none"
                />
              </div>
            </div>

            {/* Minimum Discount % */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {isAr ? 'الحد الأدنى للخصم' : 'Minimum Discount'}
              </label>
              <div className="flex gap-2">
                {['', '10', '20', '30'].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setMinDiscount(disc)}
                    className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                      minDiscount === disc
                        ? 'bg-amber-50 border-amber-500 text-amber-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {disc ? `${disc}%+` : isAr ? 'الكل' : 'Any'}
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                {isAr ? 'عرض النتائج المحددة' : 'Apply Filters'}
              </button>
            )}

          </div>
        </aside>

        {/* Products Results List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {isAr ? 'لم نعثر على منتجات تطابق هذه الفلاتر' : 'No products matched your filters'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {isAr ? 'جرب تقليل الفلاتر المحددة أو توسيع نطاق السعر والبحث للحصول على نتائج أوسع.' : 'Try relaxing some filters or clearing your criteria to see more products.'}
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isAr ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
