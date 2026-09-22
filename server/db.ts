import fs from 'fs';
import path from 'path';
import { hashPassword, encryptSecret } from './security';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bably_db.json');

// Interface definitions
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  salt: string;
  role: 'admin' | 'editor' | 'user';
  requires_password_change: boolean;
  created_at: string;
  last_login?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string;
  affiliate_id: string;
  api_key_encrypted: string;
  api_secret_encrypted: string;
  base_url: string;
  connection_status: 'connected' | 'disconnected' | 'error';
  last_synced_at?: string;
  last_sync_message?: string;
  sync_frequency_hours: number;
  is_active: boolean;
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
}

export interface Variant {
  id: string;
  product_id: string;
  sku: string;
  color_name: string;
  color_hex: string;
  color_image?: string;
  size: string; // XS, S, M, L, XL, XXL, etc.
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
  brand_id?: string;
  current_price: number; // in IQD base
  previous_price: number; // in IQD base
  discount_percent: number;
  currency: string;
  rating: number;
  reviews_count: number;
  is_in_stock: boolean;
  store_id: string;
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
  created_at: string;
}

export interface AffiliateLink {
  id: string;
  slug: string; // e.g. "nike-zoom-runner-2026"
  product_id: string;
  store_id: string;
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
  rate_to_iqd: number; // e.g. 1 IQD = 1 IQD, 1 USD = 1310 IQD -> to convert IQD to USD: price_iqd / rate_to_iqd
  is_base: boolean;
  last_updated: string;
}

export interface AdminLog {
  id: string;
  user_id: string;
  username: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface BackupRecord {
  id: string;
  filename: string;
  size_bytes: number;
  description: string;
  created_at: string;
  data_snapshot: string;
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

export interface DatabaseSchema {
  users: User[];
  stores: Store[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  affiliate_links: AffiliateLink[];
  clicks: ClickRecord[];
  reviews: Review[];
  blog_posts: BlogPost[];
  exchange_rates: ExchangeRate[];
  admin_logs: AdminLog[];
  backups: BackupRecord[];
  settings: SiteSettings;
}

// Memory cache
let dbCache: DatabaseSchema | null = null;

// Default initial data
function createInitialDatabase(): DatabaseSchema {
  const adminSalted = hashPassword('Admin@Bably2026!');
  const editorSalted = hashPassword('Editor@Bably2026!');

  const initialUsers: User[] = [
    {
      id: 'usr_owner_frasagaki',
      username: 'frasagaki',
      email: 'frasagaki@gmail.com',
      password_hash: adminSalted.hash,
      salt: adminSalted.salt,
      role: 'admin',
      requires_password_change: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_admin_1',
      username: 'admin',
      email: 'admin@bably.store',
      password_hash: adminSalted.hash,
      salt: adminSalted.salt,
      role: 'admin',
      requires_password_change: true, // Forces password change on initial login!
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_editor_1',
      username: 'editor',
      email: 'editor@bably.store',
      password_hash: editorSalted.hash,
      salt: editorSalted.salt,
      role: 'editor',
      requires_password_change: false,
      created_at: new Date().toISOString()
    }
  ];

  const initialStores: Store[] = [
    {
      id: 'store_amazon',
      name: 'Amazon',
      slug: 'amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      affiliate_id: 'bably0a-20',
      api_key_encrypted: encryptSecret('AMZN_PAAPI_MOCK_PROD_KEY_9841'),
      api_secret_encrypted: encryptSecret('AMZN_PAAPI_SECRET_KEY_PROD_582103'),
      base_url: 'https://www.amazon.com',
      connection_status: 'connected',
      sync_frequency_hours: 6,
      last_synced_at: new Date().toISOString(),
      last_sync_message: 'مزامنة ناجحة لجميع المنتجات والعروض',
      is_active: true
    },
    {
      id: 'store_aliexpress',
      name: 'AliExpress',
      slug: 'aliexpress',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Aliexpress_logo.svg',
      affiliate_id: 'bably_ali_aff_99',
      api_key_encrypted: encryptSecret('ALI_PORTALS_APP_KEY_77412'),
      api_secret_encrypted: encryptSecret('ALI_PORTALS_SECRET_44109'),
      base_url: 'https://www.aliexpress.com',
      connection_status: 'connected',
      sync_frequency_hours: 12,
      last_synced_at: new Date().toISOString(),
      last_sync_message: 'مزامنة المخزون وتحديث الأسعار التنافسية',
      is_active: true
    },
    {
      id: 'store_ebay',
      name: 'eBay',
      slug: 'ebay',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
      affiliate_id: 'epn_bably_store_53',
      api_key_encrypted: encryptSecret('EBAY_APP_CLIENT_ID_8832'),
      api_secret_encrypted: encryptSecret('EBAY_CLIENT_SECRET_99214'),
      base_url: 'https://www.ebay.com',
      connection_status: 'connected',
      sync_frequency_hours: 24,
      last_synced_at: new Date().toISOString(),
      last_sync_message: 'مزامنة المنتجات النشطة وعروض المزادات',
      is_active: true
    },
    {
      id: 'store_cj',
      name: 'CJ Affiliate',
      slug: 'cj',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/CJ_Affiliate_Logo.png',
      affiliate_id: 'cj_pub_bably_3184',
      api_key_encrypted: encryptSecret('CJ_REST_TOKEN_V2_9011'),
      api_secret_encrypted: encryptSecret('CJ_REST_SECRET_V2_4821'),
      base_url: 'https://www.cj.com',
      connection_status: 'connected',
      sync_frequency_hours: 24,
      last_synced_at: new Date().toISOString(),
      last_sync_message: 'مزامنة شبكة البراندات المعتمدة',
      is_active: true
    }
  ];

  const initialCategories: Category[] = [
    // Fashion Categories
    { id: 'cat_men', name: 'ملابس رجالية', name_en: "Men's Clothing", slug: 'men', description: 'أحدث صيحات الموضة والأزياء الرجالية الكاجوال والرسمية', icon: 'Shirt', is_fashion: true },
    { id: 'cat_women', name: 'ملابس نسائية', name_en: "Women's Clothing", slug: 'women', description: 'تشكيلة أنيقة من الفساتين، العبايات، والأزياء العصرية', icon: 'Sparkles', is_fashion: true },
    { id: 'cat_kids', name: 'ملابس أطفال', name_en: "Kids' Clothing", slug: 'kids', description: 'ملابس مريحة وعملية للأولاد والبنات بجميع الأعمار', icon: 'Baby', is_fashion: true },
    { id: 'cat_shoes', name: 'أحذية', name_en: 'Shoes', slug: 'shoes', description: 'أحذية رياضية، رسمية، وصنادل بجودة عالية', icon: 'Footprints', is_fashion: true },
    { id: 'cat_sportswear', name: 'ملابس رياضية', name_en: 'Sportswear', slug: 'sportswear', description: 'ملابس وأطقم التدريب والأنشطة الرياضية المقاومة للتعرق', icon: 'Trophy', is_fashion: true },
    { id: 'cat_winter', name: 'ملابس شتوية', name_en: 'Winter Wear', slug: 'winter', description: 'معاطف، جواكيت صوفية، وسترات شتوية دافئة', icon: 'CloudSnow', is_fashion: true },
    { id: 'cat_summer', name: 'ملابس صيفية', name_en: 'Summer Wear', slug: 'summer', description: 'تيشيرتات خفيفة، شورتات، وملابس قطنية منعشة', icon: 'Sun', is_fashion: true },
    { id: 'cat_formal', name: 'ملابس رسمية', name_en: 'Formal Wear', slug: 'formal', description: 'بدل رجالية وفساتين سهرة راقية للمناسبات الخاصة', icon: 'Briefcase', is_fashion: true },
    { id: 'cat_casual', name: 'ملابس كاجوال', name_en: 'Casual Wear', slug: 'casual', description: 'إطلالات يومية عملية ومريحة للتنقل والعمل', icon: 'Smile', is_fashion: true },
    { id: 'cat_bags', name: 'حقائب وإكسسوارات', name_en: 'Bags & Accessories', slug: 'bags', description: 'حقائب يد، حقائب ظهر، ساعات ونظارات مميزة', icon: 'ShoppingBag', is_fashion: true },
    { id: 'cat_modest', name: 'ملابس محجبات', name_en: 'Modest Wear', slug: 'modest', description: 'أزياء محتشمة وعبايات عصرية بأرقى التصاميم', icon: 'HeartHandshake', is_fashion: true },
    // General Electronics & Tech
    { id: 'cat_electronics', name: 'إلكترونيات وهواتف', name_en: 'Electronics', slug: 'electronics', description: 'أجهزة ذكية وسماعات وملحقات تقنية أصلية', icon: 'Laptop', is_fashion: false }
  ];

  const initialBrands: Brand[] = [
    { id: 'brand_nike', name: 'Nike', name_en: 'Nike', slug: 'nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', description: 'العلامة الرائدة عالمياً في الأزياء والأحذية والمعدات الرياضية.', description_en: 'World leading sports apparel and footwear company.', official_website: 'https://www.nike.com', is_featured: true },
    { id: 'brand_adidas', name: 'Adidas', name_en: 'Adidas', slug: 'adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', description: 'تصاميم ألمانية مبتكرة للأحذية والملابس الرياضية والأزياء العصرية.', description_en: 'Iconic German athletic footwear and apparel brand.', official_website: 'https://www.adidas.com', is_featured: true },
    { id: 'brand_zara', name: 'Zara', name_en: 'Zara', slug: 'zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg', description: 'الموضة السريعة والأزياء الراقية الأسبوعية من إسبانيا.', description_en: 'Spanish fast-fashion brand known for luxury trends.', official_website: 'https://www.zara.com', is_featured: true },
    { id: 'brand_hm', name: 'H&M', name_en: 'H&M', slug: 'hm', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg', description: 'أزياء مستدامة ومريحة لجميع أفراد العائلة بأسعار مناسبة.', description_en: 'Swedish multinational clothing retail company.', official_website: 'https://www2.hm.com', is_featured: true },
    { id: 'brand_levis', name: 'Levi\'s', name_en: 'Levi\'s', slug: 'levis', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg', description: 'أعرق ماركة دنيم وبنطلونات جينز أصلية متينة ومريحة.', description_en: 'Classic American denim brand established in 1853.', official_website: 'https://www.levi.com', is_featured: true }
  ];

  const initialExchangeRates: ExchangeRate[] = [
    { id: 'rate_iqd', code: 'IQD', name: 'دينار عراقي', name_ar: 'دينار عراقي', symbol: 'د.ع', rate_to_iqd: 1, is_base: true, last_updated: new Date().toISOString() },
    { id: 'rate_usd', code: 'USD', name: 'US Dollar', name_ar: 'دولار أمريكي', symbol: '$', rate_to_iqd: 1310, is_base: false, last_updated: new Date().toISOString() },
    { id: 'rate_eur', code: 'EUR', name: 'Euro', name_ar: 'يورو', symbol: '€', rate_to_iqd: 1410, is_base: false, last_updated: new Date().toISOString() },
    { id: 'rate_sar', code: 'SAR', name: 'Saudi Riyal', name_ar: 'ريال سعودي', symbol: 'ر.س', rate_to_iqd: 349, is_base: false, last_updated: new Date().toISOString() },
    { id: 'rate_aed', code: 'AED', name: 'UAE Dirham', name_ar: 'درهم إماراتي', symbol: 'د.إ', rate_to_iqd: 356, is_base: false, last_updated: new Date().toISOString() }
  ];

  // Affiliate Links
  const initialAffLinks: AffiliateLink[] = [
    {
      id: 'aff_1',
      slug: 'nike-air-zoom-runner-pro',
      product_id: 'prod_1',
      store_id: 'store_amazon',
      target_url: 'https://www.amazon.com/dp/B09XYZ1234?tag=bably0a-20',
      custom_params: 'subid=bably_iq_campaign',
      is_active: true,
      total_clicks: 142,
      created_at: new Date().toISOString()
    },
    {
      id: 'aff_2',
      slug: 'mens-tailored-wool-blazer',
      product_id: 'prod_2',
      store_id: 'store_aliexpress',
      target_url: 'https://www.aliexpress.com/item/10050064210.html?aff_fcid=bably_ali_aff_99',
      is_active: true,
      total_clicks: 89,
      created_at: new Date().toISOString()
    },
    {
      id: 'aff_3',
      slug: 'emerald-silk-evening-dress',
      product_id: 'prod_3',
      store_id: 'store_ebay',
      target_url: 'https://www.ebay.com/itm/385912401824?campid=533812001',
      is_active: true,
      total_clicks: 210,
      created_at: new Date().toISOString()
    },
    {
      id: 'aff_4',
      slug: 'levis-501-original-fit-jeans',
      product_id: 'prod_4',
      store_id: 'store_amazon',
      target_url: 'https://www.amazon.com/dp/B07TEST881?tag=bably0a-20',
      is_active: true,
      total_clicks: 76,
      created_at: new Date().toISOString()
    },
    {
      id: 'aff_5',
      slug: 'zara-oversized-cotton-hoodie',
      product_id: 'prod_5',
      store_id: 'store_cj',
      target_url: 'https://www.anrdoezrs.net/click-3184-zara-hoodie-cotton',
      is_active: true,
      total_clicks: 115,
      created_at: new Date().toISOString()
    }
  ];

  // Products with high fidelity generated image paths
  const initialProducts: Product[] = [
    {
      id: 'prod_1',
      title: 'حذاء الجري Nike Air Zoom Runner بتصميم ديناميكي',
      title_en: 'Nike Air Zoom Runner Aerodynamic Road Shoes',
      slug: 'nike-air-zoom-runner-pro',
      category_id: 'cat_shoes',
      brand_id: 'brand_nike',
      current_price: 155000, // IQD (~$118)
      previous_price: 195000, // IQD (~$148)
      discount_percent: 21,
      currency: 'IQD',
      rating: 4.8,
      reviews_count: 324,
      is_in_stock: true,
      store_id: 'store_amazon',
      primary_image: '/src/assets/images/fashion_sneakers_runner_1790113977704.jpg',
      additional_images: [
        '/src/assets/images/fashion_sneakers_runner_1790113977704.jpg',
        '/src/assets/images/hero_fashion_bably_1790113945298.jpg'
      ],
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      features: [
        'وسادة هوائية من تقنية Zoom Air لامتصاص الصدمات',
        'نسيج شبكي علوي قابل للتهوية ومقاوم للرطوبة',
        'نعل سفلي من المطاط عالي الثبات على كافة المسارات',
        'تصميم خفيف الوزن يمنح راحة استثنائية طوال اليوم'
      ],
      description: 'حذاء ركض احترافي يجمع بين القوة والمرونة لتوفير أقصى درجات الثبات والسرعة أثناء التدريبات الرياضية المكثفة والارتداء اليومي.',
      description_en: 'High-performance road running shoes engineered with responsive Zoom Air cushioning and breathable engineered mesh.',
      is_fashion: true,
      gender: 'men',
      clothing_type: 'حذاء رياضي',
      season: 'all-season',
      material: 'Synthetic Mesh & Rubber',
      care_instructions: 'تنظيف يدوي بقطعة قماش مبللة، لا يوضع في الغسالة',
      country_of_origin: 'Vietnam',
      variants: [
        { id: 'var_1_1', product_id: 'prod_1', sku: 'NK-RUN-BLK-42', color_name: 'أسود فحمي', color_hex: '#111827', size: '42', size_system: 'EU', material: 'Mesh', price: 155000, previous_price: 195000, is_in_stock: true, affiliate_link_slug: 'nike-air-zoom-runner-pro' },
        { id: 'var_1_2', product_id: 'prod_1', sku: 'NK-RUN-BLK-43', color_name: 'أسود فحمي', color_hex: '#111827', size: '43', size_system: 'EU', material: 'Mesh', price: 155000, previous_price: 195000, is_in_stock: true, affiliate_link_slug: 'nike-air-zoom-runner-pro' },
        { id: 'var_1_3', product_id: 'prod_1', sku: 'NK-RUN-BLK-44', color_name: 'أسود فحمي', color_hex: '#111827', size: '44', size_system: 'EU', material: 'Mesh', price: 155000, previous_price: 195000, is_in_stock: true, affiliate_link_slug: 'nike-air-zoom-runner-pro' },
        { id: 'var_1_4', product_id: 'prod_1', sku: 'NK-RUN-AMB-43', color_name: 'عنبري ملكي', color_hex: '#F59E0B', size: '43', size_system: 'EU', material: 'Mesh', price: 165000, previous_price: 195000, is_in_stock: true, affiliate_link_slug: 'nike-air-zoom-runner-pro' }
      ],
      last_synced_at: new Date().toISOString(),
      views_count: 1420,
      affiliate_link_id: 'aff_1',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod_2',
      title: 'بليزر رجالي فخم من الصوف الإيطالي بقصة عصرية',
      title_en: 'Men Italian Tailored Wool Minimalist Blazer',
      slug: 'mens-tailored-wool-blazer',
      category_id: 'cat_formal',
      brand_id: 'brand_zara',
      current_price: 125000, // IQD (~$95)
      previous_price: 170000, // IQD
      discount_percent: 26,
      currency: 'IQD',
      rating: 4.7,
      reviews_count: 189,
      is_in_stock: true,
      store_id: 'store_aliexpress',
      primary_image: '/src/assets/images/fashion_mens_jacket_1790113956536.jpg',
      additional_images: [
        '/src/assets/images/fashion_mens_jacket_1790113956536.jpg',
        '/src/assets/images/hero_fashion_bably_1790113945298.jpg'
      ],
      features: [
        'مزيج من الصوف الإيطالي الفاخر بنسبة 80% مع ألياف الحرير',
        'بطانة داخلية ساتان ناعمة مريحة للحركة',
        'ياقة بيك كلاسيكية وزرّان للإغلاق الأمامي',
        'جيوب داخلية مخصصة للمحفظة والهاتف'
      ],
      description: 'بليزر مصمم بعناية ليمنحك إطلالة رسمية راقية في لقاءات العمل والمناسبات الرسمية والأمسيات الفاخرة.',
      description_en: 'Italian blend wool tailored blazer crafted with refined lapels and structured modern silhouette.',
      is_fashion: true,
      gender: 'men',
      clothing_type: 'بليزر رسمي',
      season: 'winter',
      material: 'Wool Blend',
      care_instructions: 'تنظيف جاف فقط (Dry Clean Only)',
      country_of_origin: 'Italy',
      variants: [
        { id: 'var_2_1', product_id: 'prod_2', sku: 'ZR-BLZ-CHR-M', color_name: 'رمادي فحمي', color_hex: '#334155', size: 'M', size_system: 'EU', material: 'Wool', price: 125000, previous_price: 170000, is_in_stock: true, affiliate_link_slug: 'mens-tailored-wool-blazer' },
        { id: 'var_2_2', product_id: 'prod_2', sku: 'ZR-BLZ-CHR-L', color_name: 'رمادي فحمي', color_hex: '#334155', size: 'L', size_system: 'EU', material: 'Wool', price: 125000, previous_price: 170000, is_in_stock: true, affiliate_link_slug: 'mens-tailored-wool-blazer' },
        { id: 'var_2_3', product_id: 'prod_2', sku: 'ZR-BLZ-CHR-XL', color_name: 'رمادي فحمي', color_hex: '#334155', size: 'XL', size_system: 'EU', material: 'Wool', price: 125000, previous_price: 170000, is_in_stock: true, affiliate_link_slug: 'mens-tailored-wool-blazer' },
        { id: 'var_2_4', product_id: 'prod_2', sku: 'ZR-BLZ-NVY-L', color_name: 'أزرق كحلي', color_hex: '#0F172A', size: 'L', size_system: 'EU', material: 'Wool', price: 125000, previous_price: 170000, is_in_stock: true, affiliate_link_slug: 'mens-tailored-wool-blazer' }
      ],
      last_synced_at: new Date().toISOString(),
      views_count: 980,
      affiliate_link_id: 'aff_2',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod_3',
      title: 'فستان ميدي فاخر من الحرير الطبيعي بلون زمردي أخاذ',
      title_en: 'Emerald Green Silk Midi Cocktail Dress',
      slug: 'emerald-silk-evening-dress',
      category_id: 'cat_women',
      brand_id: 'brand_zara',
      current_price: 142000, // IQD
      previous_price: 210000, // IQD
      discount_percent: 32,
      currency: 'IQD',
      rating: 4.9,
      reviews_count: 412,
      is_in_stock: true,
      store_id: 'store_ebay',
      primary_image: '/src/assets/images/fashion_womens_dress_1790113967309.jpg',
      additional_images: [
        '/src/assets/images/fashion_womens_dress_1790113967309.jpg'
      ],
      features: [
        'حرير طبيعي 100% بانسيابية استثنائية ولمعان جذاب',
        'قصة خصر محددة مع تنورة منسدلة بأناقة',
        'طول ميدي محتشم ومثالي لجميع الحفلات والمناسبات',
        'حزام خصر قماشي أنيق قابل للتعديل'
      ],
      description: 'فستان ساحر يجمع بين الحشمة والأنوثة الطاغية بخامة حريرية لا تبهت وسهلة التنسيق مع المجوهرات الذهبية.',
      description_en: 'Graceful emerald silk midi dress tailored to perfection with fluid movement and opulent natural luster.',
      is_fashion: true,
      gender: 'women',
      clothing_type: 'فستان سهرة',
      season: 'all-season',
      material: '100% Pure Silk',
      care_instructions: 'غسيل يدوي بماء بارد ومسحوق حرير خاص',
      country_of_origin: 'France',
      variants: [
        { id: 'var_3_1', product_id: 'prod_3', sku: 'EM-DRS-GRN-S', color_name: 'أخضر زمردي', color_hex: '#059669', size: 'S', size_system: 'EU', material: 'Silk', price: 142000, previous_price: 210000, is_in_stock: true, affiliate_link_slug: 'emerald-silk-evening-dress' },
        { id: 'var_3_2', product_id: 'prod_3', sku: 'EM-DRS-GRN-M', color_name: 'أخضر زمردي', color_hex: '#059669', size: 'M', size_system: 'EU', material: 'Silk', price: 142000, previous_price: 210000, is_in_stock: true, affiliate_link_slug: 'emerald-silk-evening-dress' },
        { id: 'var_3_3', product_id: 'prod_3', sku: 'EM-DRS-GRN-L', color_name: 'أخضر زمردي', color_hex: '#059669', size: 'L', size_system: 'EU', material: 'Silk', price: 142000, previous_price: 210000, is_in_stock: true, affiliate_link_slug: 'emerald-silk-evening-dress' }
      ],
      last_synced_at: new Date().toISOString(),
      views_count: 2310,
      affiliate_link_id: 'aff_3',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod_4',
      title: 'بنطلون جينز كلاسيكي Levi\'s 501 Original Fit أصلي',
      title_en: 'Levi\'s 501 Original Fit Classic Denim Jeans',
      slug: 'levis-501-original-fit-jeans',
      category_id: 'cat_casual',
      brand_id: 'brand_levis',
      current_price: 88000, // IQD
      previous_price: 115000, // IQD
      discount_percent: 23,
      currency: 'IQD',
      rating: 4.8,
      reviews_count: 670,
      is_in_stock: true,
      store_id: 'store_amazon',
      primary_image: '/src/assets/images/hero_fashion_bably_1790113945298.jpg',
      additional_images: [
        '/src/assets/images/hero_fashion_bably_1790113945298.jpg'
      ],
      features: [
        'دنيم قطني نقي 100% مع أزرار الإغلاق التاريخية الأصلية',
        'قصة مستقيمة مريحة من الحوض إلى الكاحل',
        'خياطة متينة ومقاومة للتآكل بعد مئات الغسلات',
        'شعار ليفايز الجلدي الشهير على الجيب الخلفي'
      ],
      description: 'الجينز الأكثر شهرة عالمياً منذ عام 1873، خيار يومي دائم للأناقة والعملية.',
      description_en: 'The authentic original straight-fit button-fly denim jeans that defined casual style.',
      is_fashion: true,
      gender: 'men',
      clothing_type: 'جينز',
      season: 'all-season',
      material: '100% Heavy Cotton Denim',
      care_instructions: 'غسيل بالغسالة مقلوباً مع ألوان مشابهة',
      country_of_origin: 'USA',
      variants: [
        { id: 'var_4_1', product_id: 'prod_4', sku: 'LV-501-BLU-32', color_name: 'أزرق كلاسيكي', color_hex: '#1D4ED8', size: '32', size_system: 'US', material: 'Denim', price: 88000, previous_price: 115000, is_in_stock: true, affiliate_link_slug: 'levis-501-original-fit-jeans' },
        { id: 'var_4_2', product_id: 'prod_4', sku: 'LV-501-BLU-34', color_name: 'أزرق كلاسيكي', color_hex: '#1D4ED8', size: '34', size_system: 'US', material: 'Denim', price: 88000, previous_price: 115000, is_in_stock: true, affiliate_link_slug: 'levis-501-original-fit-jeans' },
        { id: 'var_4_3', product_id: 'prod_4', sku: 'LV-501-BLK-32', color_name: 'أسود خام', color_hex: '#000000', size: '32', size_system: 'US', material: 'Denim', price: 88000, previous_price: 115000, is_in_stock: true, affiliate_link_slug: 'levis-501-original-fit-jeans' }
      ],
      last_synced_at: new Date().toISOString(),
      views_count: 1750,
      affiliate_link_id: 'aff_4',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod_5',
      title: 'هودي قطني ثقيل بقصة Oversized كاجوال مريحة',
      title_en: 'Heavyweight French Terry Oversized Hoodie',
      slug: 'zara-oversized-cotton-hoodie',
      category_id: 'cat_casual',
      brand_id: 'brand_hm',
      current_price: 52000, // IQD
      previous_price: 75000, // IQD
      discount_percent: 30,
      currency: 'IQD',
      rating: 4.6,
      reviews_count: 145,
      is_in_stock: true,
      store_id: 'store_cj',
      primary_image: '/src/assets/images/hero_fashion_bably_1790113945298.jpg',
      additional_images: ['/src/assets/images/hero_fashion_bably_1790113945298.jpg'],
      features: [
        'قطن فرنسي تيري ثقيل بوزن 450 جرام/م²',
        'بطانة داخلية مريحة ودافئة بدون وبر زائد',
        'قبعة مزدوجة الطبقات مع رباط متين مخفي',
        'جيب كنغر أمامي واسع لتدفئة اليدين'
      ],
      description: 'هودي كاجوال مميز مناسب للأيام الباردة والأنشطة الجامعية والخروجات السريعة بألوان ترابية جذابة.',
      description_en: 'Premium heavyweight French terry cotton hoodie featuring dropped shoulders and relaxed boxy cut.',
      is_fashion: true,
      gender: 'unisex',
      clothing_type: 'هودي وسويت شيرت',
      season: 'winter',
      material: '100% French Terry Cotton',
      care_instructions: 'غسيل بماء معتدل وتجفيف بالهواء',
      country_of_origin: 'Portugal',
      variants: [
        { id: 'var_5_1', product_id: 'prod_5', sku: 'HM-HD-BEG-M', color_name: 'بيج رملي', color_hex: '#D7C4A5', size: 'M', size_system: 'EU', material: 'Cotton', price: 52000, previous_price: 75000, is_in_stock: true, affiliate_link_slug: 'zara-oversized-cotton-hoodie' },
        { id: 'var_5_2', product_id: 'prod_5', sku: 'HM-HD-BEG-L', color_name: 'بيج رملي', color_hex: '#D7C4A5', size: 'L', size_system: 'EU', material: 'Cotton', price: 52000, previous_price: 75000, is_in_stock: true, affiliate_link_slug: 'zara-oversized-cotton-hoodie' },
        { id: 'var_5_3', product_id: 'prod_5', sku: 'HM-HD-BLK-L', color_name: 'أسود ليلي', color_hex: '#18181B', size: 'L', size_system: 'EU', material: 'Cotton', price: 52000, previous_price: 75000, is_in_stock: true, affiliate_link_slug: 'zara-oversized-cotton-hoodie' }
      ],
      last_synced_at: new Date().toISOString(),
      views_count: 890,
      affiliate_link_id: 'aff_5',
      created_at: new Date().toISOString()
    }
  ];

  const initialReviews: Review[] = [
    {
      id: 'rev_1',
      product_id: 'prod_1',
      author_name: 'عمر القيسي - بغداد',
      rating: 5,
      comment: 'الحذاء أصلي 100% ووصلني من أمازون بحالة ممتازة، مريح جداً في الجري وامتصاص الصدمات ممتاز على الطرقات.',
      is_verified_purchase: true,
      status: 'approved',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'rev_2',
      product_id: 'prod_2',
      author_name: 'أحمد البصري',
      rating: 5,
      comment: 'خامة الصوف فاخرة جداً والتفصيل متقن، المقاس الأوروبي L ناسبني تماماً كأنها مفصلة خصوصاً لي.',
      is_verified_purchase: true,
      status: 'approved',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'rev_3',
      product_id: 'prod_3',
      author_name: 'سارة العبيدي - أربيل',
      rating: 5,
      comment: 'لون الفستان الزمردي على الطبيعة أجمل بكثير من الصور، الحرير انسيابي وخفيف على الجسم وراقي جداً.',
      is_verified_purchase: true,
      status: 'approved',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ];

  const initialClicks: ClickRecord[] = [
    { id: 'clk_1', affiliate_link_id: 'aff_1', product_id: 'prod_1', store_id: 'store_amazon', referrer: 'https://bably.store/fashion', user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', device_type: 'mobile', country: 'Iraq', ip_hash: 'a1b2c3d4', clicked_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'clk_2', affiliate_link_id: 'aff_3', product_id: 'prod_3', store_id: 'store_ebay', referrer: 'https://bably.store/products', user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', device_type: 'desktop', country: 'Iraq', ip_hash: 'e5f6g7h8', clicked_at: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 'clk_3', affiliate_link_id: 'aff_2', product_id: 'prod_2', store_id: 'store_aliexpress', referrer: 'https://bably.store/deals', user_agent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B)', device_type: 'mobile', country: 'United Arab Emirates', ip_hash: 'i9j0k1l2', clicked_at: new Date(Date.now() - 3600000 * 8).toISOString() }
  ];

  const initialBlogPosts: BlogPost[] = [
    {
      id: 'post_1',
      title: 'دليل مقاسات الملابس العالمية: كيف تختار مقاسك بين EU و US و UK بدقة وبدون أخطاء؟',
      title_en: 'International Size Guide: How to convert EU, US and UK sizes accurately',
      slug: 'international-clothing-size-guide-2026',
      excerpt: 'تعرف على الفروقات الدقيقة بين المقاسات الأوروبية والأمريكية والآسيوية وتجنب إرجاع الشحنات عند التسوق عبر الإنترنت.',
      cover_image: '/src/assets/images/hero_fashion_bably_1790113945298.jpg',
      category: 'نصائح التسوق والأزياء',
      tags: ['دليل المقاسات', 'أزياء', 'تسوق إلكتروني', 'أحذية', 'نصائح'],
      content: `## مشكلة اختلاف المقاسات عند الشراء من المتاجر العالمية

عند التسوق عبر المتاجر العالمية مثل Amazon أو AliExpress أو eBay، فإن أكثر ما يربك المتسوق العربي هو اختلاف أنظمة القياس. فالمقاس M في المتاجر الآسيوية يعادل عادةً XS أو S في النظام الأوروبي أو الأمريكي.

### 1. المقاسات الأوروبية (EU) مقابل الأمريكية (US)
تعتمد المقاسات الأوروبية في الملابس العلوية على قياس نصف محيط الصدر بالسنتيمتر، بينما يعتمد النظام الأمريكي على البوصة (Inches). 

### 2. جدول مقارنة المقاسات العلوية للرجال والنساء:
نوصي دائماً بأخذ شريط القياس وقياس محيط الصدر والخصر، ومقارنته بالجدول قبل إتمام الطلب من المتجر الأصلي.`,
      comparison_table: [
        { product_name: 'بليزر صوف إيطالي', brand: 'Zara', price: '125,000 د.ع', material: 'صوف', sizes: 'M, L, XL (EU)', rating: '4.7 / 5', store: 'AliExpress', affiliate_slug: 'mens-tailored-wool-blazer' },
        { product_name: 'هودي تيري قطني', brand: 'H&M', price: '52,000 د.ع', material: 'قطن 100%', sizes: 'S, M, L, XL', rating: '4.6 / 5', store: 'CJ', affiliate_slug: 'zara-oversized-cotton-hoodie' },
        { product_name: 'جينز 501 كلاسيك', brand: 'Levi\'s', price: '88,000 د.ع', material: 'دنيم ثقيل', sizes: '30, 32, 34, 36 (US)', rating: '4.8 / 5', store: 'Amazon', affiliate_slug: 'levis-501-original-fit-jeans' }
      ],
      seo_title: 'دليل مقاسات الملابس العالمية وكيفية التحويل بدقة | مدونة بابلي',
      meta_description: 'شرح مفصل لطريقة قياس واختيار المقاسات الأوروبية والأمريكية والآسيوية في المتاجر العالمية مع جدول مقارنة عملي.',
      status: 'published',
      published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'post_2',
      title: 'مقارنة أفضل الأحذية الرياضية لعام 2026: Nike Air Zoom ضد أحذية Adidas الرائدة',
      title_en: 'Best Running Shoes 2026: Nike Air Zoom vs Adidas Flagship Review',
      slug: 'nike-vs-adidas-running-shoes-2026-comparison',
      excerpt: 'مقارنة فنية عميقة للمتانة، وسائد امتصاص الصدمات، والأسعار الحقيقية بالدينار العراقي على المتاجر المعتمدة.',
      cover_image: '/src/assets/images/fashion_sneakers_runner_1790113977704.jpg',
      category: 'مقارنات المنتجات',
      tags: ['أحذية رياضية', 'Nike', 'Adidas', 'مقارنة', 'عروض'],
      content: `## المقارنة الشاملة بين عمالقة الأحذية الرياضية

إذا كنت تبحث عن حذاء يومي للجري والتدريب اليومي، فإن الاختيار بين نايكي وأديداس يحتاج إلى النظر في الخامات وثبات النعل ومرونة وسادة الهواء.

### حذاء Nike Air Zoom Runner
يتميز بنظام وسائد هوائية مدمجة تعيد الطاقة بنسبة 15% أعلى عند كل خطوة، مما يقلل إجهاد المفاصل خصوصاً على الأسطح الخرسانية.`,
      comparison_table: [
        { product_name: 'Nike Air Zoom Runner', brand: 'Nike', price: '155,000 د.ع', material: 'Engineered Mesh', sizes: '41, 42, 43, 44', rating: '4.8 / 5', store: 'Amazon', affiliate_slug: 'nike-air-zoom-runner-pro' }
      ],
      seo_title: 'مقارنة أحذية نايكي وأديداس الرياضية 2026 وأفضل الصفقات | بابلي',
      meta_description: 'استكشف الفروقات الفنية والأسعار الحقيقية لأفضل أحذية الركض والمشي لعام 2026 وكيفية شرائها بأفضل سعر.',
      status: 'published',
      published_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  const initialAdminLogs: AdminLog[] = [
    {
      id: 'log_init_1',
      user_id: 'usr_admin_1',
      username: 'admin',
      action: 'SYSTEM_BOOTSTRAP',
      entity_type: 'SYSTEM',
      entity_id: 'SYSTEM_INIT',
      details: 'تهيئة قاعدة بيانات بابلي وربط المتاجر والعملة الأساسية (الدينار العراقي IQD)',
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    }
  ];

  const initialSettings: SiteSettings = {
    site_name: 'Bably | بابلي',
    site_name_en: 'Bably Store',
    tagline: 'منصتكم الأولى لمقارنة واقتناص أفضل العروض والأزياء من المتاجر العالمية بالدينار العراقي',
    logo_url: '/logo.svg',
    primary_color: '#0F172A',
    accent_color: '#F59E0B',
    base_currency: 'IQD',
    default_language: 'ar',
    affiliate_disclosure_ar: 'إفصاح قانوني: قد يحصل متجر بابلي (Bably) على عمولة تسويقية عند إتمام عملية الشراء من خلال بعض الروابط الموجودة في الموقع، دون أي تكلفة إضافية على المشتري. جميع الأسعار والعروض يتم تحديثها تلقائياً من المتاجر الأصلية.',
    affiliate_disclosure_en: 'Affiliate Disclosure: Bably may earn an affiliate commission when you make a purchase through links on our site, at no additional cost to you. All prices and offers are synced directly from official merchant stores.',
    contact_email: 'support@bably.store',
    contact_phone: '+964 770 000 0000',
    facebook_url: 'https://facebook.com/bablystore',
    instagram_url: 'https://instagram.com/bablystore',
    twitter_url: 'https://twitter.com/bablystore',
    telegram_url: 'https://t.me/bablystore',
    seo_meta_title: 'Bably | بابلي - متجر التسوق والأفلييت المتكامل',
    seo_meta_description: 'تصفح وقارن آلاف المنتجات والأزياء العالمية من أمازون، علي إكسبرس، إيباي وسي جي بأفضل الأسعار بالدينار العراقي.',
    robots_content: "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://bably.store/sitemap.xml",
    auto_sync_enabled: true,
    sync_interval_hours: 6,
    allow_user_registration: true
  };

  return {
    users: initialUsers,
    stores: initialStores,
    categories: initialCategories,
    brands: initialBrands,
    products: initialProducts,
    affiliate_links: initialAffLinks,
    clicks: initialClicks,
    reviews: initialReviews,
    blog_posts: initialBlogPosts,
    exchange_rates: initialExchangeRates,
    admin_logs: initialAdminLogs,
    backups: [],
    settings: initialSettings
  };
}

/**
 * Load database from disk or create initial dataset
 */
export function getDb(): DatabaseSchema {
  if (dbCache) return dbCache;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(content);
      return dbCache!;
    } catch (err) {
      console.error('Error loading db file, resetting to initial dataset:', err);
    }
  }

  // Create initial and persist
  dbCache = createInitialDatabase();
  saveDb(dbCache);
  return dbCache;
}

/**
 * Persist database to disk atomically
 */
export function saveDb(data: DatabaseSchema): void {
  dbCache = data;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = DB_FILE + '.tmp';
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

/**
 * Helper to log admin actions
 */
export function logAdminAction(
  userId: string,
  username: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string,
  ipAddress: string
): void {
  const db = getDb();
  const newLog: AdminLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    user_id: userId,
    username,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    ip_address: ipAddress,
    created_at: new Date().toISOString()
  };
  db.admin_logs.unshift(newLog);
  // Keep last 1000 logs
  if (db.admin_logs.length > 1000) {
    db.admin_logs = db.admin_logs.slice(0, 1000);
  }
  saveDb(db);
}
