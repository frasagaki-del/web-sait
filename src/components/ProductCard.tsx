import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, ArrowLeftRight, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { formatPrice, language, wishlist, toggleWishlist, addToCompare } = useApp();
  const isAr = language === 'ar';

  const isSaved = wishlist.includes(product.id);
  const affiliateUrl = `/go/${product.affiliate_slug || product.slug}`;

  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      
      {/* 65%-75% Clean Image Container with Neutral Backdrop */}
      <div className="relative aspect-[4/3] bg-slate-100/80 overflow-hidden">
        <img
          src={product.primary_image}
          alt={isAr ? product.title : product.title_en}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            // Elegant CSS fallback container on image error
            (e.currentTarget as HTMLElement).style.display = 'none';
            (e.currentTarget.parentElement as HTMLElement).classList.add('bg-slate-200', 'flex', 'items-center', 'justify-center');
          }}
        />

        {/* Single subtle tag: Discount or In-stock */}
        {product.discount_percent > 0 && (
          <div className="absolute top-2.5 start-2.5 bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded shadow-sm">
            {isAr ? `خصم ${product.discount_percent}%` : `-${product.discount_percent}%`}
          </div>
        )}

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-2.5 end-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isAr ? 'حفظ في المفضلة' : 'Save to wishlist'}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isSaved ? 'bg-amber-500 text-slate-950' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            title={isAr ? 'إضافة إلى المقارنة' : 'Compare product'}
            className="p-1.5 rounded-full bg-white/80 text-slate-700 hover:bg-white backdrop-blur-sm transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Brand & Category in Quiet Unboxed Text */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <span>{product.brand_name || (isAr ? 'ماركة معتمدة' : 'Brand')}</span>
            <span aria-hidden="true">·</span>
            <span>{product.store_name || 'Store'}</span>
            {product.rating > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-amber-600 font-semibold tabular-nums">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                </span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onNavigate(`/product/${product.slug}`)}
            className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer leading-snug mb-2"
          >
            {isAr ? product.title : product.title_en}
          </h3>

          {/* Fashion Attribute Snippet if applicable */}
          {product.is_fashion && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
              {product.clothing_type && <span>{product.clothing_type}</span>}
              {product.material && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="truncate">{product.material}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Buy CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatPrice(product.current_price)}
              </span>
              {product.previous_price > product.current_price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatPrice(product.previous_price)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {product.is_in_stock ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out of stock')}
            </span>
          </div>

          {/* Required Clear Buy CTA pointing to Affiliate Link */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate(`/product/${product.slug}`)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              {isAr ? 'التفاصيل' : 'Details'}
            </button>
            
            <a
              href={affiliateUrl}
              target="_blank"
              rel="sponsored nofollow"
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <span>{isAr ? `شراء من ${product.store_name || 'المتجر'}` : `Buy at ${product.store_name || 'Store'}`}</span>
              <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
            </a>
          </div>

        </div>

      </div>

    </article>
  );
};
