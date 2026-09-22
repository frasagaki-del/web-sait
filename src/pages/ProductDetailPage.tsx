import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Review, Variant } from '../types';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Heart,
  Share2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Ruler,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Clock
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { formatPrice, language, wishlist, toggleWishlist, addToCompare } = useApp();
  const isAr = language === 'ar';

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [authorName, setAuthorName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setReviews(data.reviews || []);
          setSimilarProducts(data.similarProducts || []);
          setSelectedImage(data.product.primary_image);
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        }
      } catch (e) {
        console.error('Error fetching product details', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          author_name: authorName,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      if (res.ok) {
        const d = await res.json();
        setReviews([d.review, ...reviews]);
        setReviewSuccess(true);
        setAuthorName('');
        setReviewComment('');
      }
    } catch (e) {
      console.error('Error submitting review', e);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{isAr ? 'عذراً، المنتج غير موجود أو تم نقله' : 'Product not found'}</h2>
        <button
          onClick={() => onNavigate('/products')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          {isAr ? 'العودة لكتالوج المنتجات' : 'Back to Catalog'}
        </button>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const affiliateUrl = `/go/${product.affiliate_slug || product.slug}`;
  const allImages = [product.primary_image, ...(product.additional_images || [])];

  // Distinct colors and sizes from variants
  const distinctColors = Array.from(
    new Map((product.variants || []).map((v) => [v.color_name, v])).values()
  );
  const distinctSizes = Array.from(new Set((product.variants || []).map((v) => v.size)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* Breadcrumb Path */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900">
          {isAr ? 'الرئيسية' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={() => onNavigate('/products')} className="hover:text-slate-900">
          {isAr ? 'المنتجات' : 'Products'}
        </button>
        {product.category_name && (
          <>
            <span>/</span>
            <span className="text-slate-700">{product.category_name}</span>
          </>
        )}
      </nav>

      {/* Product Hero Section: Image Gallery + Buy Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left: Gallery (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
            <img
              src={selectedImage}
              alt={isAr ? product.title : product.title_en}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.discount_percent > 0 && (
              <div className="absolute top-4 start-4 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-md shadow-md">
                {isAr ? `خصم خاص ${product.discount_percent}%` : `-${product.discount_percent}% OFF`}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Sync Time & Trust Bar */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {isAr ? 'آخر فحص وتحديث للأسعار: اليوم' : 'Last verified & synced: Today'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'رابط تسوق رسمي معتمد' : 'Verified Merchant Link'}</span>
            </div>
          </div>
        </div>

        {/* Right: Buy Desk & Fashion Specs (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {product.brand_name || 'Bably Select'}
              </span>
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <span>{isAr ? 'متجر الشراء:' : 'Merchant:'}</span>
                <span className="font-bold text-slate-900">{product.store_name}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {isAr ? product.title : product.title_en}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-2.5 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold tabular-nums">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                {product.reviews_count} {isAr ? 'تقييم موثق من المشترين' : 'verified buyer reviews'}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-semibold">
                {product.is_in_stock ? (isAr ? 'متوفر بالمخزون' : 'In Stock') : (isAr ? 'نفد من المخزن' : 'Out of Stock')}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                {formatPrice(selectedVariant ? selectedVariant.price : product.current_price)}
              </div>
              {product.previous_price > product.current_price && (
                <div className="text-xs text-slate-400 line-through mt-0.5 tabular-nums">
                  {formatPrice(selectedVariant ? selectedVariant.previous_price : product.previous_price)}
                </div>
              )}
            </div>
            <div className="text-end">
              <span className="text-[11px] text-slate-500 block">
                {isAr ? 'السعر الأصلي معفى من الضرائب المخفية' : 'Estimated checkout total'}
              </span>
            </div>
          </div>

          {/* FASHION VARIANTS: COLORS & SIZES */}
          {product.is_fashion && (
            <div className="space-y-4 pt-2">
              
              {/* Color Swatches */}
              {distinctColors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                    <span>{isAr ? 'اللون المتاح:' : 'Color:'}</span>
                    <span className="text-amber-600 font-bold">{selectedVariant?.color_name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {distinctColors.map((v) => (
                      <button
                        key={v.color_name}
                        onClick={() => setSelectedVariant(v)}
                        title={v.color_name}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          selectedVariant?.color_name === v.color_name
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.color_hex }}
                        />
                        <span>{v.color_name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes & Size Guide Button */}
              {distinctSizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                    <span>{isAr ? 'المقاس:' : 'Size:'}</span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 text-xs"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{isAr ? 'دليل المقاسات (EU / US / UK)' : 'Size Guide'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {distinctSizes.map((sz) => {
                      const isSelected = selectedVariant?.size === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => {
                            const matched = product.variants.find((v) => v.size === sz);
                            if (matched) setSelectedVariant(matched);
                          }}
                          className={`w-12 h-10 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fabric & Material Quick Info */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {product.material && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'الخامة والقماش' : 'Material'}</span>
                    <span className="font-semibold text-slate-800">{product.material}</span>
                  </div>
                )}
                {product.season && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'الموسم الملائم' : 'Season'}</span>
                    <span className="font-semibold text-slate-800 capitalize">{product.season}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* AFFILIATE BUY BUTTON (PRIMARY ACTION) */}
          <div className="pt-4 space-y-3">
            <a
              href={affiliateUrl}
              target="_blank"
              rel="sponsored nofollow"
              className="w-full py-4 px-6 text-sm sm:text-base font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>
                {isAr
                  ? `الانتقال إلى ${product.store_name || 'المتجر'} وإتمام الشراء`
                  : `Buy Now at ${product.store_name || 'Merchant'}`}
              </span>
              <ExternalLink className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Quick action buttons: Wishlist & Compare */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isSaved ? (isAr ? 'محفوظ في المفضلة' : 'Saved') : (isAr ? 'حفظ في المفضلة' : 'Save')}</span>
              </button>

              <button
                onClick={() => addToCompare(product)}
                className="py-2.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                <span>{isAr ? 'إضافة إلى المقارنة' : 'Compare'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Features & Detailed Specs Tabs */}
      <div className="border-t border-slate-200 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {isAr ? 'وصف المنتج ومميزاته' : 'Product Description'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {isAr ? product.description : product.description_en}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                {isAr ? 'أهم المواصفات والخصائص' : 'Key Highlights'}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Care Instructions & Country */}
          {(product.care_instructions || product.country_of_origin) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              {product.care_instructions && (
                <p>
                  <strong className="text-slate-800">{isAr ? 'إرشادات العناية والغسيل: ' : 'Care: '}</strong>
                  {product.care_instructions}
                </p>
              )}
              {product.country_of_origin && (
                <p>
                  <strong className="text-slate-800">{isAr ? 'بلد المنشأ والتصنيع: ' : 'Country of Origin: '}</strong>
                  {product.country_of_origin}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer Reviews & Submission */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'آراء المشترين' : 'Reviews'} ({reviews.length})
            </h3>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating} / 5</span>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{rev.author_name}</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block">{rev.created_at.split('T')[0]}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">{isAr ? 'كن أول من يكتب مراجعة لهذا المنتج' : 'Be the first to review'}</p>
            )}
          </div>

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">
              {isAr ? 'أضف تقييمك وتجربتك' : 'Add your review'}
            </h4>

            {reviewSuccess && (
              <div className="p-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'شكراً لك، تم نشر تقييمك بنجاح' : 'Thank you for your review!'}</span>
              </div>
            )}

            <div>
              <input
                type="text"
                required
                placeholder={isAr ? 'اسمك' : 'Your name'}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {isAr ? 'التقييم (1-5 نجوم)' : 'Rating'}
              </label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value={5}>★★★★★ (5 نجوم - ممتاز)</option>
                <option value={4}>★★★★☆ (4 نجوم - جيد جداً)</option>
                <option value={3}>★★★☆☆ (3 نجوم - متوسط)</option>
                <option value={2}>★★☆☆☆ (نجمتان - دون المتوقع)</option>
                <option value={1}>★☆☆☆☆ (نجمة واحدة - سيئ)</option>
              </select>
            </div>

            <div>
              <textarea
                required
                rows={2}
                placeholder={isAr ? 'اكتب رأيك الصادق في الخامة والمقاس وجودة الشحن...' : 'Write your review...'}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {submittingReview ? (isAr ? 'جارِ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال التقييم' : 'Submit Review')}
            </button>
          </form>
        </div>

      </div>

      {/* Similar Recommended Products */}
      {similarProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-10">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            {isAr ? 'منتجات مشابهة قد تهمك' : 'Similar Products You May Like'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onNavigate(`/product/${p.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden mb-2">
                  <img src={p.primary_image} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">{p.title}</h4>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 tabular-nums">{formatPrice(p.current_price)}</span>
                  <span className="text-[10px] text-slate-400">{p.store_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

    </div>
  );
};
