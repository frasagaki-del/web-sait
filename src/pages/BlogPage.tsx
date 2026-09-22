import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { BookOpen, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'المدونة وأدلة الشراء الذكي' : 'Editorial & Shopping Guides'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isAr ? 'أدلة الأزياء، مقارنة المقاسات، ونصائح التسوق' : 'Fashion Guides & Size Conversion Insights'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {isAr
            ? 'مقالات تحريرية متخصصة تشمل جداول مقارنة بين الماركات العالمية لتساعدك على اختيار المقاس والخامة الأنسب.'
            : 'In-depth reviews and side-by-side product charts to help you buy with confidence.'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 block">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.comparison_table && post.comparison_table.length > 0 && (
                    <div className="mt-4 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-semibold inline-flex items-center gap-1.5 border border-amber-200">
                      <span>✓</span>
                      <span>{isAr ? 'يتضمن جدول مقارنة منتجات تفصيلي' : 'Includes comparison matrix'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.published_at.split('T')[0]}</span>
                </span>
                <span className="text-slate-900 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>{isAr ? 'قراءة المقال' : 'Read Article'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
