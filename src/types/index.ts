export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export type CategoryId =
  | 'all'
  | 'tws-earbuds'
  | 'neckbands-headphones'
  | 'smartwatches'
  | 'fast-chargers'
  | 'braided-cables'
  | 'power-banks'
  | 'car-accessories'
  | 'cases-stands';

export type HardwareModel =
  | 'tws-anc-pods'
  | 'tws-gaming-pods'
  | 'tws-air-mini'
  | 'neckband-pro'
  | 'studio-over-ear'
  | 'neckband-sport'
  | 'watch-amoled-call'
  | 'watch-rugged-fit'
  | 'watch-pulse-slim'
  | 'charger-20w-mini'
  | 'charger-65w-gan'
  | 'charger-100w-station'
  | 'cable-100w-usbc'
  | 'cable-lightning-mfi'
  | 'cable-3in1-braided'
  | 'powerbank-magsafe-10k'
  | 'powerbank-pd-20k'
  | 'powerbank-pocket-5k'
  | 'car-dual-adapter'
  | 'car-mag-mount'
  | 'car-retract-charger'
  | 'case-magsafe-frosted'
  | 'glass-edge-shield'
  | 'stand-alu-foldable';

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  secondaryHex: string;
  detailHex?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  hardwareModel: HardwareModel;
  image: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  badgeTone?: 'mint' | 'lavender' | 'peach' | 'sky';
  highlightBar: string;
  isFlashDeal?: boolean;
  claimedPercent?: number;
  stockLeft?: number;
  lifestyleTags: ('wfh' | 'gaming' | 'travel' | 'fitness')[];
  colors: ColorVariant[];
  specs: ProductSpec[];
  warranty: string;
  inBox: string[];
  description: string;
}

export interface CategoryMeta {
  id: Exclude<CategoryId, 'all'>;
  label: string;
  shortLabel: string;
  tagline: string;
  pastelTint: string;
  image: string;
  sampleModel: HardwareModel;
  sampleColor: ColorVariant;
  count: number;
}

export interface CartItem {
  key: string; // `${productId}:${colorId}`
  productId: string;
  sku: string;
  name: string;
  price: number;
  mrp: number;
  hardwareModel: HardwareModel;
  image?: string;
  color: ColorVariant;
  quantity: number;
  highlightBar: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  targetCategory: CategoryId;
  featuredProductId: string;
  image: string;
  gradientLight: string;
  gradientDark: string;
  pillTint: string;
  floatingBadge: {
    label: string;
    metric: string;
  };
}

export interface LifestyleTile {
  id: 'wfh' | 'gaming' | 'travel' | 'fitness';
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  spanClass: string;
  accentHex: string;
  featuredSkus: string[];
}

export interface BundleCombo {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  productIds: [string, string];
  comboPrice: number;
  combinedMrp: number;
  pastelBg: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  city: string;
  paymentMethod: string;
  total: number;
  status: 'Confirmed' | 'Packed' | 'In Transit' | 'Out for Delivery';
  eta: string;
  itemsCount: number;
}
