import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ForcedPasswordChangeModal } from './components/ForcedPasswordChangeModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FashionPage } from './pages/FashionPage';
import { FashionComparePage } from './pages/FashionComparePage';
import { StoresPage } from './pages/StoresPage';
import { BrandsPage } from './pages/BrandsPage';
import { DealsPage } from './pages/DealsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { SearchPage } from './pages/SearchPage';
import { StaticPages } from './pages/StaticPages';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search));
  const { language, settings } = useApp();

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const [pathname, search] = path.split('?');
    window.history.pushState({}, '', path);
    setCurrentPath(pathname);
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync document title
  useEffect(() => {
    const siteTitle = language === 'ar' ? 'Bably | متجر الأزياء والتسوق العالمي' : 'Bably | Global Fashion & Affiliate Store';
    document.title = siteTitle;
  }, [language, settings]);

  // Route Resolver
  const renderCurrentRoute = () => {
    // Single product: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Single blog post: /blog/:slug
    if (currentPath.startsWith('/blog/') && currentPath !== '/blog') {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    // Fashion subdepartments
    if (currentPath === '/fashion/men') return <FashionPage subDepartment="men" onNavigate={navigate} />;
    if (currentPath === '/fashion/women') return <FashionPage subDepartment="women" onNavigate={navigate} />;
    if (currentPath === '/fashion/kids') return <FashionPage subDepartment="kids" onNavigate={navigate} />;
    if (currentPath === '/fashion/shoes') return <FashionPage subDepartment="shoes" onNavigate={navigate} />;
    if (currentPath === '/fashion/sportswear') return <FashionPage subDepartment="sportswear" onNavigate={navigate} />;
    if (currentPath === '/fashion/compare') return <FashionComparePage onNavigate={navigate} />;
    if (currentPath === '/fashion') return <FashionPage onNavigate={navigate} />;

    // Main tabs
    if (currentPath === '/products') {
      return (
        <ProductsPage
          onNavigate={navigate}
          initialCategory={searchParams.get('category') || undefined}
          initialBrand={searchParams.get('brand') || undefined}
          initialGender={searchParams.get('gender') || undefined}
        />
      );
    }
    if (currentPath === '/deals') return <DealsPage onNavigate={navigate} />;
    if (currentPath === '/stores') return <StoresPage onNavigate={navigate} />;
    if (currentPath === '/brands') return <BrandsPage onNavigate={navigate} />;
    if (currentPath === '/blog') return <BlogPage onNavigate={navigate} />;
    if (currentPath === '/search') return <SearchPage initialQuery={searchParams.get('q') || ''} onNavigate={navigate} />;

    // Static & User pages
    if (currentPath === '/about') return <StaticPages pageType="about" onNavigate={navigate} />;
    if (currentPath === '/contact') return <StaticPages pageType="contact" onNavigate={navigate} />;
    if (currentPath === '/disclosure') return <StaticPages pageType="disclosure" onNavigate={navigate} />;
    if (currentPath === '/privacy') return <StaticPages pageType="privacy" onNavigate={navigate} />;
    if (currentPath === '/terms') return <StaticPages pageType="terms" onNavigate={navigate} />;
    if (currentPath === '/saved') return <StaticPages pageType="saved" onNavigate={navigate} />;
    if (currentPath === '/profile') return <StaticPages pageType="profile" onNavigate={navigate} />;

    // Admin Panel
    if (currentPath === '/admin') return <AdminPage onNavigate={navigate} />;

    // Default: Home
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Bar Navigation */}
      <Header currentPath={currentPath} onNavigate={navigate} />

      {/* Main Content Body */}
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Modals */}
      <AuthModal />
      <ForcedPasswordChangeModal />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
