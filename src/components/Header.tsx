import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, User as UserIcon, Shield, Menu, X, ArrowLeftRight } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    rates,
    user,
    wishlist,
    compareItems,
    setShowAuthModal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isAr = language === 'ar';

  const navLinks = [
    { path: '/', label: isAr ? 'الرئيسية' : 'Home' },
    { path: '/fashion', label: isAr ? 'الأزياء والملابس' : 'Fashion' },
    { path: '/products', label: isAr ? 'المنتجات' : 'Products' },
    { path: '/deals', label: isAr ? 'العروض والتخفيضات' : 'Deals' },
    { path: '/stores', label: isAr ? 'المتاجر العالمية' : 'Stores' },
    { path: '/blog', label: isAr ? 'المدونة والمقارنات' : 'Blog' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar: Exactly 3 Zones per Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 group text-start"
        >
          <span className="text-amber-500 font-extrabold group-hover:scale-105 transition-transform inline-block">✦</span>
          <span>Bably</span>
          <span className="text-slate-400 font-normal text-lg">|</span>
          <span className="text-slate-800 font-medium">بابلي</span>
        </button>

        {/* Zone 2: 4-6 Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`transition-colors hover:text-slate-900 cursor-pointer ${
                  isActive ? 'text-amber-600 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search, Currency, Wishlist, User / Admin) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Button */}
          <button
            onClick={() => onNavigate('/search')}
            title={isAr ? 'البحث في المنتجات' : 'Search'}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Compare Button */}
          <button
            onClick={() => onNavigate('/fashion/compare')}
            title={isAr ? 'مقارنة المنتجات' : 'Compare Products'}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors hidden sm:inline-flex"
          >
            <ArrowLeftRight className="w-5 h-5" />
            {compareItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {compareItems.length}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onNavigate('/saved')}
            title={isAr ? 'المفضلة' : 'Saved Wishlist'}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 tabular-nums"
            >
              <span>{currency}</span>
              <span className="text-[10px] text-slate-500">▼</span>
            </button>
            {currencyDropdownOpen && (
              <div
                className="absolute top-full mt-1 end-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 w-28 text-xs font-medium"
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
              >
                {rates.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => {
                      setCurrency(r.code);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-start px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      currency === r.code ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.code}</span>
                    <span className="text-slate-400">{r.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            className="text-xs font-medium px-2 py-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
          >
            {isAr ? 'EN' : 'عربي'}
          </button>

          {/* User Account / Admin Action */}
          {user ? (
            <div className="flex items-center gap-2">
              {(user.role === 'admin' || user.role === 'editor') && (
                <button
                  onClick={() => onNavigate('/admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'لوحة الإدارة' : 'Admin'}</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('/profile')}
                title={user.username}
                className="p-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-300">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'دخول' : 'Sign In'}</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-start py-2 text-sm font-medium text-slate-700 hover:text-amber-600 border-b border-slate-100"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{isAr ? 'العملة الأساسية: الدينار العراقي' : 'Base: Iraqi Dinar'}</span>
            <button
              onClick={() => {
                onNavigate('/fashion/compare');
                setMobileMenuOpen(false);
              }}
              className="text-amber-600 font-medium"
            >
              {isAr ? 'المقارنات السريعة' : 'Compare'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
