import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const popularSearches = ['Nike Air Zoom', 'بدلة رسمية صوف', 'فستان حرير زارا', 'جينز ليفايز 501', 'سنيكرز أديداس'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Search Bar Input */}
      <div className="max-w-3xl mx-auto space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 absolute start-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              performSearch(e.target.value);
            }}
            placeholder={isAr ? 'ابحث عن اسم المنتج، الماركة، الخامة، أو نوع اللباس...' : 'Search by title, brand, fabric, or style...'}
            className="w-full ps-12 pe-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-amber-500 shadow-sm"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute end-4 top-3.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">{isAr ? 'اقتراحات سريعة:' : 'Quick Searches:'}</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                performSearch(term);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-lg transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            {query.trim()
              ? isAr
                ? `نتائج البحث عن "${query}" (${results.length})`
                : `Results for "${query}" (${results.length})`
              : isAr
              ? 'أدخل كلمة البحث أعلاه للبدء'
              : 'Enter a search term above'}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((prod) => (
              <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
            ))}
          </div>
        ) : query.trim() ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-sm text-slate-600">{isAr ? 'لم يتم العثور على منتجات مطابقة' : 'No matching products found'}</p>
            <p className="text-xs text-slate-400">{isAr ? 'جرب البحث بكلمات عامة كاسم الماركة (Nike, Zara) أو نوع الملابس' : 'Try searching for brand names or categories'}</p>
          </div>
        ) : null}
      </div>

    </div>
  );
};
