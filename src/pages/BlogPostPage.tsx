import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { Calendar, ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post || null))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-2/3" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{isAr ? 'المقال غير موجود' : 'Post not found'}</h2>
        <button
          onClick={() => onNavigate('/blog')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
        >
          {isAr ? 'العودة للمدونة' : 'Back to Blog'}
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/blog')}
          className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1 mb-2"
        >
          {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isAr ? 'العودة للمدونة' : 'Back to Blog'}</span>
        </button>

        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
          {post.category}
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.published_at.split('T')[0]}</span>
          </span>
          <span>·</span>
          <span>{isAr ? 'فريق تحرير بابلي' : 'Bably Editorial'}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={post.cover_image}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      {/* Embedded Product Comparison Table */}
      {post.comparison_table && post.comparison_table.length > 0 && (
        <div className="mt-8 space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'جدول مقارنة المنتجات والبدائل المرشحة' : 'Product Comparison Matrix'}
            </h3>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="p-3 text-start font-bold">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="p-3 text-start font-bold">{isAr ? 'الماركة' : 'Brand'}</th>
                  <th className="p-3 text-start font-bold">{isAr ? 'السعر التقديري' : 'Est. Price'}</th>
                  <th className="p-3 text-start font-bold">{isAr ? 'الخامة' : 'Material'}</th>
                  <th className="p-3 text-start font-bold">{isAr ? 'المقاسات' : 'Sizes'}</th>
                  <th className="p-3 text-start font-bold">{isAr ? 'المتجر' : 'Store'}</th>
                  <th className="p-3 text-start font-bold">{isAr ? 'رابط الشراء' : 'Buy Link'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {post.comparison_table.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{row.product_name}</td>
                    <td className="p-3 text-slate-700">{row.brand}</td>
                    <td className="p-3 font-semibold text-slate-900 tabular-nums">{row.price}</td>
                    <td className="p-3 text-slate-600">{row.material}</td>
                    <td className="p-3 text-slate-600">{row.sizes}</td>
                    <td className="p-3 text-slate-600">{row.store}</td>
                    <td className="p-3">
                      <a
                        href={`/go/${row.affiliate_slug}`}
                        target="_blank"
                        rel="sponsored nofollow"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        <span>{isAr ? 'شراء' : 'Buy'}</span>
                        <ExternalLink className="w-3 h-3 text-amber-400" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200">
          <Tag className="w-4 h-4 text-slate-400" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

    </article>
  );
};
