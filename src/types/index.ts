export interface Variant {
  id: string;
  product_id: string;
  sku: string;
  color_name: string;
  color_hex: string;
  color_image?: string;
  size: string;
  size_system: 'EU' | 'US' | 'UK' | 'Asian';
  material: string;
  price: number;
  previous_price: number;
  is_in_stock: boolean;
  affiliate_link_slug?: string;
}

export interface Product {
  id: string;
  title: string;
  title_en: string;
  slug: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  brand_id?: string;
  brand_name?: string;
  brand_logo?: string;
  current_price: number; // in base IQD
  previous_price: number; // in base IQD
  discount_percent: number;
  currency: string;
  rating: number;
  reviews_count: number;
  is_in_stock: boolean;
  store_id: string;
  store_name?: string;
  store_logo?: string;
  primary_image: string;
  additional_images: string[];
  video_url?: string;
  features: string[];
  description: string;
  description_en: string;
  is_fashion: boolean;
  gender?: 'men' | 'women' | 'kids' | 'unisex';
  clothing_type?: string;
  season?: 'summer' | 'winter' | 'autumn' | 'spring' | 'all-season';
  care_instructions?: string;
  country_of_origin?: string;
  material?: string;
  variants: Variant[];
  last_synced_at: string;
  views_count: number;
  affiliate_link_id: string;
  affiliate_slug?: string;
  affiliate_target_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string;
  icon: string;
  parent_id?: string | null;
  is_fashion: boolean;
}

export interface Brand {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  logo: string;
  description: string;
  description_en: string;
  official_website: string;
  is_featured: boolean;
  product_count?: number;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string;
  affiliate_id: string;
  base_url: string;
  connection_status: 'connected' | 'disconnected' | 'error';
  last_synced_at?: string;
  last_sync_message?: string;
  sync_frequency_hours: number;
  is_active: boolean;
  has_api_key?: boolean;
  has_api_secret?: boolean;
  products_count?: number;
}

export interface AffiliateLink {
  id: string;
  slug: string;
  product_id: string;
  product_title?: string;
  store_id: string;
  store_name?: string;
  target_url: string;
  custom_params?: string;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
}

export interface ClickRecord {
  id: string;
  affiliate_link_id: string;
  product_id: string;
  store_id: string;
  referrer: string;
  user_agent: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  country: string;
  ip_hash: string;
  clicked_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_en: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  comparison_table?: Array<{
    product_name: string;
    brand: string;
    price: string;
    material: string;
    sizes: string;
    rating: string;
    store: string;
    affiliate_slug: string;
  }>;
  seo_title: string;
  meta_description: string;
  status: 'published' | 'draft' | 'scheduled';
  published_at: string;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  code: string;
  name: string;
  name_ar: string;
  symbol: string;
  rate_to_iqd: number;
  is_base: boolean;
  last_updated: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  requires_password_change: boolean;
  created_at?: string;
  last_login?: string;
}

export interface SiteSettings {
  site_name: string;
  site_name_en: string;
  tagline: string;
  logo_url: string;
  primary_color: string;
  accent_color: string;
  base_currency: string;
  default_language: string;
  affiliate_disclosure_ar: string;
  affiliate_disclosure_en: string;
  contact_email: string;
  contact_phone: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  telegram_url: string;
  seo_meta_title: string;
  seo_meta_description: string;
  robots_content: string;
  auto_sync_enabled: boolean;
  sync_interval_hours: number;
  allow_user_registration: boolean;
}
