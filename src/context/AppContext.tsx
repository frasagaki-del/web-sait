import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ExchangeRate, Product, SiteSettings } from '../types';

interface AppContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  currency: string;
  setCurrency: (curr: string) => void;
  rates: ExchangeRate[];
  formatPrice: (iqdAmount: number) => string;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  settings: SiteSettings | null;
  refreshSettings: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showForcedPasswordModal: boolean;
  setShowForcedPasswordModal: (show: boolean) => void;
}

const defaultRates: ExchangeRate[] = [
  { id: 'rate_iqd', code: 'IQD', name: 'دينار عراقي', name_ar: 'دينار عراقي', symbol: 'د.ع', rate_to_iqd: 1, is_base: true, last_updated: '' },
  { id: 'rate_usd', code: 'USD', name: 'US Dollar', name_ar: 'دولار أمريكي', symbol: '$', rate_to_iqd: 1310, is_base: false, last_updated: '' },
  { id: 'rate_eur', code: 'EUR', name: 'Euro', name_ar: 'يورو', symbol: '€', rate_to_iqd: 1410, is_base: false, last_updated: '' },
  { id: 'rate_sar', code: 'SAR', name: 'Saudi Riyal', name_ar: 'ريال سعودي', symbol: 'ر.س', rate_to_iqd: 349, is_base: false, last_updated: '' },
  { id: 'rate_aed', code: 'AED', name: 'UAE Dirham', name_ar: 'درهم إماراتي', symbol: 'د.إ', rate_to_iqd: 356, is_base: false, last_updated: '' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('bably_lang') as 'ar' | 'en') || 'ar';
  });

  const [currency, setCurrencyState] = useState<string>(() => {
    return localStorage.getItem('bably_currency') || 'IQD';
  });

  const [rates, setRates] = useState<ExchangeRate[]>(defaultRates);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('bably_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('bably_compare') || '[]');
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForcedPasswordModal, setShowForcedPasswordModal] = useState(false);

  // Sync dir and lang to HTML
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('bably_lang', language);
  }, [language]);

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem('bably_currency', curr);
  };

  // Fetch initial exchange rates and site settings
  const fetchCurrencies = async () => {
    try {
      const res = await fetch('/api/currencies');
      if (res.ok) {
        const data = await res.json();
        if (data.rates && data.rates.length > 0) {
          setRates(data.rates);
        }
      }
    } catch (e) {
      console.warn('Could not fetch live exchange rates, using fallback', e);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (e) {
      console.warn('Could not fetch settings', e);
    }
  };

  // Check current session
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('bably_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.requires_password_change) {
            setShowForcedPasswordModal(true);
          }
        }
      }
    } catch (e) {
      console.warn('Auth check error', e);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    refreshSettings();
    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('bably_token', token);
    if (userData.requires_password_change) {
      setShowForcedPasswordModal(true);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('bably_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('bably_token');
    setUser(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('bably_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const addToCompare = (product: Product) => {
    setCompareItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length >= 4) {
        alert(language === 'ar' ? 'يمكنك مقارنة 4 منتجات كحد أقصى في وقت واحد' : 'You can compare maximum 4 products at once');
        return prev;
      }
      const next = [...prev, product];
      localStorage.setItem('bably_compare', JSON.stringify(next));
      return next;
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      localStorage.setItem('bably_compare', JSON.stringify(next));
      return next;
    });
  };

  /**
   * Currency conversion helper
   * Base price is stored in IQD.
   */
  const formatPrice = (iqdAmount: number): string => {
    if (!iqdAmount && iqdAmount !== 0) return '0 د.ع';
    const rate = rates.find((r) => r.code === currency);

    if (!rate || rate.code === 'IQD') {
      return `${iqdAmount.toLocaleString('en-US')} د.ع`;
    }

    // Convert from IQD: price_iqd / rate_to_iqd
    const converted = iqdAmount / rate.rate_to_iqd;
    const formattedNum = converted < 10 ? converted.toFixed(2) : converted.toLocaleString('en-US', { maximumFractionDigits: 1 });

    if (currency === 'USD') return `$${formattedNum}`;
    if (currency === 'EUR') return `€${formattedNum}`;
    if (currency === 'SAR') return `${formattedNum} ر.س`;
    if (currency === 'AED') return `${formattedNum} د.إ`;

    return `${formattedNum} ${rate.symbol || rate.code}`;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        rates,
        formatPrice,
        user,
        setUser,
        login,
        logout,
        wishlist,
        toggleWishlist,
        compareItems,
        addToCompare,
        removeFromCompare,
        settings,
        refreshSettings,
        searchQuery,
        setSearchQuery,
        showAuthModal,
        setShowAuthModal,
        showForcedPasswordModal,
        setShowForcedPasswordModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
