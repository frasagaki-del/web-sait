import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Store, Brand, Category, AffiliateLink, ClickRecord, Review, BlogPost, ExchangeRate, User } from '../types';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Store as StoreIcon,
  Link2,
  BookOpen,
  MessageSquare,
  DollarSign,
  Users,
  Shield,
  Settings,
  HardDriveDownload,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  MousePointerClick
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, language, formatPrice, settings, refreshSettings } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'fashion' | 'stores' | 'affiliate' | 'blog' | 'reviews' | 'currencies' | 'users' | 'backups' | 'settings'
  >('overview');

  // Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [backups, setBackups] = useState<any[]>([]);

  // Action status states
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdTitleEn, setNewProdTitleEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdPrevPrice, setNewProdPrevPrice] = useState('');
  const [newProdStoreId, setNewProdStoreId] = useState('');
  const [newProdCatId, setNewProdCatId] = useState('');
  const [newProdBrandId, setNewProdBrandId] = useState('');
  const [newProdImage, setNewProdImage] = useState('/src/assets/images/fashion_mens_jacket_1790113956536.jpg');
  const [newProdTargetUrl, setNewProdTargetUrl] = useState('');
  const [newProdIsFashion, setNewProdIsFashion] = useState(true);
  const [newProdGender, setNewProdGender] = useState<'men' | 'women' | 'kids' | 'unisex'>('men');
  const [newProdClothingType, setNewProdClothingType] = useState('بليزر وبدل رسمية');
  const [newProdMaterial, setNewProdMaterial] = useState('100% صوف ناعم كشمير');
  const [newProdSeason, setNewProdSeason] = useState<'summer' | 'winter' | 'autumn' | 'spring' | 'all-season'>('winter');
  const [newProdDescription, setNewProdDescription] = useState('بليزر فاخر بخياطة يدوية دقيقة وقصة كلاسيكية مريحة.');

  // Store Edit Modal State
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [storeAffId, setStoreAffId] = useState('');
  const [storeApiKey, setStoreApiKey] = useState('');
  const [storeApiSecret, setStoreApiSecret] = useState('');
  const [storeSyncFreq, setStoreSyncFreq] = useState('6');

  // Load everything on mount
  const loadAll = async () => {
    const token = localStorage.getItem('bably_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const [dashRes, prodRes, storeRes, brandRes, catRes, affRes, blogRes, currRes, userRes, bakRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }),
        fetch('/api/products'),
        fetch('/api/stores'),
        fetch('/api/brands'),
        fetch('/api/categories'),
        fetch('/api/affiliate/links', { headers }),
        fetch('/api/blog'),
        fetch('/api/currencies'),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/backups', { headers })
      ]);

      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (prodRes.ok) setProducts((await prodRes.json()).products || []);
      if (storeRes.ok) setStores((await storeRes.json()).stores || []);
      if (brandRes.ok) setBrands((await brandRes.json()).brands || []);
      if (catRes.ok) setCategories((await catRes.json()).categories || []);
      if (affRes.ok) setAffiliateLinks((await affRes.json()).links || []);
      if (blogRes.ok) setBlogPosts((await blogRes.json()).posts || []);
      if (currRes.ok) setRates((await currRes.json()).rates || []);
      if (userRes.ok) setUsersList((await userRes.json()).users || []);
      if (bakRes.ok) setBackups((await bakRes.json()).backups || []);
    } catch (e) {
      console.error('Error loading admin panel', e);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Require login & admin/editor role
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          {isAr ? 'منطقة محظورة: يلزم صلاحية مدير للوصول' : 'Access Restricted'}
        </h2>
        <p className="text-xs text-slate-500">
          {isAr ? 'يرجى تسجيل الدخول بحساب مسؤول للوصول إلى لوحة التحكم' : 'Please sign in with administrator credentials'}
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
      </div>
    );
  }

  // Trigger Live Auto Sync for a store
  const handleTriggerSync = async (storeId: string) => {
    setSyncingStoreId(storeId);
    setActionSuccess(null);
    setActionError(null);
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch(`/api/stores/${storeId}/sync`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(data.message);
        loadAll();
      } else {
        setActionError(data.error);
      }
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setSyncingStoreId(null);
    }
  };

  // Test Store Connection
  const handleTestConnection = async (storeId: string) => {
    setActionSuccess(null);
    setActionError(null);
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch(`/api/stores/${storeId}/test-connection`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(data.message);
        loadAll();
      } else {
        setActionError(data.error);
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  // Update Store API Credentials
  const handleSaveStore = async () => {
    if (!editingStore) return;
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch(`/api/stores/${editingStore.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          affiliate_id: storeAffId,
          api_key: storeApiKey || undefined,
          api_secret: storeApiSecret || undefined,
          sync_frequency_hours: Number(storeSyncFreq)
        })
      });
      if (res.ok) {
        setActionSuccess(isAr ? 'تم حفظ وتشفير مفاتيح المتجر بنجاح' : 'Store API credentials encrypted and saved');
        setEditingStore(null);
        loadAll();
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  // Create Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newProdTitle,
          title_en: newProdTitleEn || newProdTitle,
          current_price: Number(newProdPrice),
          previous_price: Number(newProdPrevPrice || newProdPrice),
          store_id: newProdStoreId || stores[0]?.id,
          category_id: newProdCatId || categories[0]?.id,
          brand_id: newProdBrandId || undefined,
          primary_image: newProdImage,
          target_url: newProdTargetUrl,
          is_fashion: newProdIsFashion,
          gender: newProdGender,
          clothing_type: newProdClothingType,
          material: newProdMaterial,
          season: newProdSeason,
          description: newProdDescription,
          description_en: newProdDescription,
          features: ['جودة تصنيع أصلية معتمدة', 'خامة مريحة وأنيقة', 'شحن موثوق مع المتجر الأصلي']
        })
      });

      if (res.ok) {
        setActionSuccess(isAr ? 'تمت إضافة المنتج ورابط الأفلييت بنجاح' : 'Product & affiliate link created');
        setShowProductModal(false);
        setNewProdTitle('');
        setNewProdPrice('');
        loadAll();
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setActionSuccess(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted');
        loadAll();
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  // Create Backup Snapshot
  const handleCreateBackup = async () => {
    try {
      const token = localStorage.getItem('bably_token');
      const res = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description: 'نسخة احتياطية لقاعدة بيانات بابلي' })
      });
      if (res.ok) {
        setActionSuccess(isAr ? 'تم إنشاء النسخة الاحتياطية بنجاح' : 'Backup snapshot created');
        loadAll();
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Admin Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isAr ? 'لوحة إدارة وتشغيل Bably | بابلي' : 'Bably Admin Engine'}
            </h1>
            <span className="text-xs text-slate-500">
              {isAr ? 'المسؤول الحالي: ' : 'Admin: '}
              <strong className="text-slate-800">{user.username}</strong> ({user.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            {isAr ? 'عرض المتجر' : 'Live Store'}
          </button>
          <button
            onClick={() => handleCreateBackup()}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'أخذ نسخة احتياطية' : 'Create Backup'}</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {[
          { id: 'overview', label: isAr ? 'نظرة عامة والتحليلات' : 'Analytics', icon: LayoutDashboard },
          { id: 'products', label: isAr ? 'المنتجات' : 'Products', icon: Package },
          { id: 'fashion', label: isAr ? 'قسم الأزياء والمقاسات' : 'Fashion Hub', icon: Sparkles },
          { id: 'stores', label: isAr ? 'المتاجر والمزامنة الحية' : 'Stores & Sync', icon: StoreIcon },
          { id: 'affiliate', label: isAr ? 'محرك روابط الأفلييت' : 'Affiliate Links', icon: Link2 },
          { id: 'blog', label: isAr ? 'المدونة والمقارنات' : 'Blog CMS', icon: BookOpen },
          { id: 'currencies', label: isAr ? 'أسعار الصرف (IQD)' : 'Currencies', icon: DollarSign },
          { id: 'users', label: isAr ? 'المستخدمين والصلاحيات' : 'Users', icon: Users },
          { id: 'backups', label: isAr ? 'النسخ الاحتياطية' : 'Backups', icon: HardDriveDownload }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActionSuccess(null);
                setActionError(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold block">{isAr ? 'إجمالي المنتجات' : 'Products'}</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">{dashboardData.metrics.total_products}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold block">{isAr ? 'إجمالي المشاهدات' : 'Views'}</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">{dashboardData.metrics.total_views}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold block">{isAr ? 'نقرات روابط الأفلييت (/go/...)' : 'Affiliate Clicks'}</span>
              <div className="text-2xl font-black text-amber-600 tabular-nums mt-1">{dashboardData.metrics.total_clicks}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold block">{isAr ? 'معدل التحويل (CTR)' : 'Average CTR'}</span>
              <div className="text-2xl font-black text-emerald-600 tabular-nums mt-1">{dashboardData.metrics.average_ctr}%</div>
            </div>
          </div>

          {/* Traffic Breakdown & Stores Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Device breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">{isAr ? 'توزيع الأجهزة والمستخدمين' : 'Device Distribution'}</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{isAr ? 'هواتف ذكية (Mobile)' : 'Mobile'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{dashboardData.deviceBreakdown.mobile} نقرة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{isAr ? 'حواسيب مكتبية (Desktop)' : 'Desktop'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{dashboardData.deviceBreakdown.desktop} نقرة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{isAr ? 'أجهزة لوحية (Tablet)' : 'Tablet'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{dashboardData.deviceBreakdown.tablet} نقرة</span>
                </div>
              </div>
            </div>

            {/* Top Stores by Clicks */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">{isAr ? 'أداء المتاجر الشريكة' : 'Stores Performance'}</h3>
              <div className="space-y-2 text-xs">
                {dashboardData.topStores.map((st: any) => (
                  <div key={st.id} className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{st.name}</span>
                    <span className="font-bold text-amber-600 tabular-nums">{st.clicks} نقرة إحالة</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">{isAr ? 'المنتجات الأكثر مشاهدة' : 'Top Products'}</h3>
              <div className="space-y-2 text-xs">
                {dashboardData.topProducts.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-slate-700 truncate max-w-[180px]">{p.title}</span>
                    <span className="font-bold text-slate-900 tabular-nums">{p.views} مشاهدة</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Live Clicks Stream Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">{isAr ? 'سجل النقرات المباشرة لروابط الأفلييت' : 'Recent Clickstream'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="p-2.5 text-start font-bold">{isAr ? 'الوقت' : 'Time'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'الجهاز' : 'Device'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'الدولة' : 'Country'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'المصدر' : 'Referrer'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData.recentClicks.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-500 tabular-nums">{c.clicked_at.replace('T', ' ').substring(0, 19)}</td>
                      <td className="p-2.5 font-semibold text-slate-800 capitalize">{c.device_type}</td>
                      <td className="p-2.5 text-slate-700">{c.country}</td>
                      <td className="p-2.5 text-slate-500 truncate max-w-xs">{c.referrer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{isAr ? 'إدارة كتالوج المنتجات' : 'Products Catalog'} ({products.length})</h2>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'إضافة منتج جديد' : 'Add Product'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="p-3 text-start font-bold">{isAr ? 'الصورة والمنتج' : 'Product'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'المتجر والماركة' : 'Store & Brand'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'السعر بالدينار' : 'Price (IQD)'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'رابط الأفلييت' : 'Affiliate Slug'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'المشاهدات' : 'Views'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.primary_image} alt={p.title} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1">{p.title}</span>
                            <span className="text-[10px] text-slate-400">{p.is_fashion ? 'أزياء' : 'عام'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 block">{p.store_name}</span>
                        <span className="text-[11px] text-slate-500">{p.brand_name || '—'}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 tabular-nums">
                        {p.current_price.toLocaleString('en-US')} د.ع
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          /go/{p.affiliate_slug || p.slug}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 tabular-nums">{p.views_count}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate(`/product/${p.slug}`)}
                            title={isAr ? 'معاينة' : 'Preview'}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            title={isAr ? 'حذف' : 'Delete'}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: FASHION HUB MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'fashion' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">{isAr ? 'مواصفات قسم الأزياء المتخصصة' : 'Fashion Attribute Hub'}</h3>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'يحتوي هذا القسم على مواصفات الخامات (قطن، صوف، حرير، دنيم) والأنظمة المقاسية (EU, US, UK, Asian) ودليل المقاسات الموحد.'
                : 'Manage fabrics, sizing systems, and unified measurement matrix.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-1">{isAr ? 'أنظمة المقاسات المعتمدة' : 'Supported Systems'}</span>
                <span className="text-xs text-slate-600">EU (أوروبي) · US (أمريكي) · UK (بريطاني) · Asian (آسيوي)</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-1">{isAr ? 'أنواع الأقمشة الرئيسية' : 'Fabrics & Textiles'}</span>
                <span className="text-xs text-slate-600">Wool (صوف) · Cotton (قطن) · Silk (حرير) · Denim (دنيم)</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-1">{isAr ? 'الأقسام الفرعية' : 'Sub-departments'}</span>
                <span className="text-xs text-slate-600">رجالي · نسائي · أحذية وسنيكرز · أطفال · ملابس رياضية</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: STORES & AUTO SYNC ENGINE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{isAr ? 'المتاجر العالمية الشريكة ومحرك المزامنة' : 'Stores & Background Sync'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-base">{store.name}</h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{isAr ? 'متصل بنجاح' : 'Connected'}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Affiliate ID:</span>
                      <span className="font-mono font-bold text-slate-800">{store.affiliate_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{isAr ? 'معدل المزامنة:' : 'Frequency:'}</span>
                      <span className="font-semibold text-slate-800">{isAr ? `كل ${store.sync_frequency_hours} ساعات` : `Every ${store.sync_frequency_hours}h`}</span>
                    </div>
                    {store.last_synced_at && (
                      <div className="flex items-center justify-between">
                        <span>{isAr ? 'آخر مزامنة:' : 'Last Synced:'}</span>
                        <span className="text-slate-500 tabular-nums">{store.last_synced_at.replace('T', ' ').substring(0, 19)}</span>
                      </div>
                    )}
                    {store.last_sync_message && (
                      <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-600">
                        {store.last_sync_message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTriggerSync(store.id)}
                    disabled={syncingStoreId === store.id}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${syncingStoreId === store.id ? 'animate-spin' : ''}`} />
                    <span>{syncingStoreId === store.id ? (isAr ? 'جارِ المزامنة...' : 'Syncing...') : (isAr ? 'مزامنة فورية الآن' : 'Run Sync Now')}</span>
                  </button>

                  <button
                    onClick={() => handleTestConnection(store.id)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    {isAr ? 'فحص الاتصال API' : 'Test API'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingStore(store);
                      setStoreAffId(store.affiliate_id);
                      setStoreSyncFreq(String(store.sync_frequency_hours));
                      setStoreApiKey('');
                      setStoreApiSecret('');
                    }}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium"
                  >
                    {isAr ? 'تعديل المفاتيح' : 'Edit Keys'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: AFFILIATE ENGINE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'affiliate' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">{isAr ? 'محرك روابط الأفلييت والتوجيه النظيف' : 'Affiliate Redirects Engine'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{isAr ? 'جميع الروابط الموجهة النظيفة /go/:slug مع عدادات النقرات' : 'All clean /go/:slug redirects and click counts'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="p-3 text-start font-bold">{isAr ? 'رابط بابلي النظيف' : 'Clean URL'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'المنتج المرتبط' : 'Associated Product'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'المتجر الأصلي' : 'Merchant'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'إجمالي النقرات' : 'Clicks'}</th>
                    <th className="p-3 text-start font-bold">{isAr ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {affiliateLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">
                        /go/{link.slug}
                      </td>
                      <td className="p-3 font-medium text-slate-900">{link.product_title || 'منتج عام'}</td>
                      <td className="p-3 text-slate-600">{link.store_name}</td>
                      <td className="p-3 font-bold text-slate-900 tabular-nums">{link.total_clicks}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          {link.is_active ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 6: BLOG CMS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{isAr ? 'مقالات وأدلة الشراء' : 'Blog Posts'} ({blogPosts.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase mb-1 block">{post.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{post.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{post.published_at.split('T')[0]}</span>
                  <button
                    onClick={() => onNavigate(`/blog/${post.slug}`)}
                    className="text-amber-600 font-semibold hover:underline"
                  >
                    {isAr ? 'عرض المقال' : 'Preview'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 7: CURRENCIES & EXCHANGE RATES */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'currencies' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isAr ? 'أسعار الصرف مقابل الدينار العراقي (IQD)' : 'Exchange Rates (Base: IQD)'}</h3>
                <p className="text-xs text-slate-500">{isAr ? 'يتم استخدام هذه الأسعار لتحويل وعرض المنتجات بالدولار واليورو والريال' : 'Rates used for instant live conversion'}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="p-2.5 text-start font-bold">{isAr ? 'العملة' : 'Currency'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'الرمز' : 'Symbol'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'سعر الصرف (1 وحدة = دينار عراقي)' : 'Rate to IQD'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'النوع' : 'Type'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rates.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{r.code} - {r.name_ar}</td>
                      <td className="p-2.5 text-slate-700 font-bold">{r.symbol}</td>
                      <td className="p-2.5 font-bold text-slate-900 tabular-nums">
                        {r.rate_to_iqd.toLocaleString('en-US')} د.ع
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.is_base ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                          {r.is_base ? 'العملة الأساسية' : 'مُحولة'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 8: USERS & RBAC */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">{isAr ? 'إدارة المستخدمين والأدوار' : 'Users & Access Control'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="p-2.5 text-start font-bold">{isAr ? 'اسم المستخدم' : 'Username'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'الدور والصلاحية' : 'Role'}</th>
                    <th className="p-2.5 text-start font-bold">{isAr ? 'تغيير إجباري لكلمة المرور' : 'Forced Password Change'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{u.username}</td>
                      <td className="p-2.5 text-slate-600">{u.email}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600">
                        {u.requires_password_change ? (
                          <span className="text-amber-600 font-bold">نعم (مطلوب عند الدخول القادم)</span>
                        ) : (
                          <span className="text-slate-400">مكتمل</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 9: BACKUPS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{isAr ? 'النسخ الاحتياطية لقاعدة البيانات' : 'Database Backups'}</h3>
                <p className="text-xs text-slate-500">{isAr ? 'يمكنك إنشاء لقطات كاملة وتنزيلها بصيغة JSON' : 'Export and download database snapshots'}</p>
              </div>
              <button
                onClick={handleCreateBackup}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                {isAr ? 'أخذ لقطة جديدة الآن' : 'Create Snapshot'}
              </button>
            </div>

            <div className="space-y-2">
              {backups.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{b.filename}</span>
                    <span className="text-slate-400">{b.created_at} · {(b.size_bytes / 1024).toFixed(1)} KB</span>
                  </div>
                  <a
                    href={`/api/admin/backups/${b.id}/download`}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
                  >
                    {isAr ? 'تنزيل JSON' : 'Download'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {isAr ? 'إضافة منتج جديد مع رابط الأفلييت' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-700 text-xs">
                إغلاق
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'عنوان المنتج (عربي)' : 'Title (AR)'}</label>
                  <input
                    type="text"
                    required
                    value={newProdTitle}
                    onChange={(e) => setNewProdTitle(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'العنوان بالإنجليزية' : 'Title (EN)'}</label>
                  <input
                    type="text"
                    value={newProdTitleEn}
                    onChange={(e) => setNewProdTitleEn(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'السعر الحالي (IQD)' : 'Price'}</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'السعر السابق (IQD)' : 'Previous Price'}</label>
                  <input
                    type="number"
                    value={newProdPrevPrice}
                    onChange={(e) => setNewProdPrevPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'المتجر الشريك' : 'Store'}</label>
                  <select
                    value={newProdStoreId}
                    onChange={(e) => setNewProdStoreId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'التصنيف' : 'Category'}</label>
                  <select
                    value={newProdCatId}
                    onChange={(e) => setNewProdCatId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'الماركة' : 'Brand'}</label>
                  <select
                    value={newProdBrandId}
                    onChange={(e) => setNewProdBrandId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="">{isAr ? 'اختر ماركة' : 'Select brand'}</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'رابط الإحالة الأصلي (Target URL)' : 'Target Merchant URL'}</label>
                <input
                  type="url"
                  placeholder="https://www.amazon.com/dp/B08N5WRWNW?tag=bably-20"
                  value={newProdTargetUrl}
                  onChange={(e) => setNewProdTargetUrl(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                />
              </div>

              {/* Fashion specific toggle and inputs */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFashion"
                    checked={newProdIsFashion}
                    onChange={(e) => setNewProdIsFashion(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="isFashion" className="font-bold text-slate-800">
                    {isAr ? 'منتج يتبع قسم الأزياء والملابس (تفعيل المقاسات والخامات)' : 'Fashion & Clothing Product'}
                  </label>
                </div>

                {newProdIsFashion && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">{isAr ? 'الجنس' : 'Gender'}</label>
                      <select
                        value={newProdGender}
                        onChange={(e) => setNewProdGender(e.target.value as any)}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      >
                        <option value="men">رجالي</option>
                        <option value="women">نسائي</option>
                        <option value="kids">أطفال</option>
                        <option value="unisex">للجنسين</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">{isAr ? 'الخامة والقماش' : 'Material'}</label>
                      <input
                        type="text"
                        value={newProdMaterial}
                        onChange={(e) => setNewProdMaterial(e.target.value)}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">{isAr ? 'الموسم' : 'Season'}</label>
                      <select
                        value={newProdSeason}
                        onChange={(e) => setNewProdSeason(e.target.value as any)}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      >
                        <option value="all-season">كل الفصول</option>
                        <option value="winter">شتوي</option>
                        <option value="summer">صيفي</option>
                        <option value="spring">ربيعي</option>
                        <option value="autumn">خريفي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">{isAr ? 'نوع القطعة' : 'Type'}</label>
                      <input
                        type="text"
                        value={newProdClothingType}
                        onChange={(e) => setNewProdClothingType(e.target.value)}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'الوصف' : 'Description'}</label>
                <textarea
                  rows={2}
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
                >
                  {isAr ? 'حفظ وإضافة للمتجر' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STORE KEYS MODAL */}
      {editingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              {isAr ? `تعديل مفاتيح ${editingStore.name} API المشفرة` : `Edit ${editingStore.name} Credentials`}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Affiliate Tracking ID</label>
                <input
                  type="text"
                  value={storeAffId}
                  onChange={(e) => setStoreAffId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">API Key (AES-256 مشفر)</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={storeApiKey}
                  onChange={(e) => setStoreApiKey(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">API Secret (AES-256 مشفر)</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={storeApiSecret}
                  onChange={(e) => setStoreApiSecret(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'تكرار المزامنة التلقائية (بالساعات)' : 'Sync Frequency (hours)'}</label>
                <input
                  type="number"
                  value={storeSyncFreq}
                  onChange={(e) => setStoreSyncFreq(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingStore(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveStore}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
              >
                {isAr ? 'حفظ وتشفير' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
