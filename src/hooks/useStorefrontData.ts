import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { optimizeCloudinaryUrl } from '../lib/cloudinary';
import type { DbBanner, DbCategory, DbProduct, DbStoreSettings } from '../types/database';
import type { Product, CategoryMeta, HeroSlide } from '../types';

const CACHE_KEY = 'ub_storefront_cache_v4';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh cache

// Invalidate legacy demo caches
try {
  sessionStorage.removeItem('ub_storefront_cache_v2');
  sessionStorage.removeItem('ub_storefront_cache_v3');
  localStorage.removeItem('ub_storefront_cache_v2');
  localStorage.removeItem('ub_storefront_cache_v3');
} catch {}

interface CachedStorefrontPayload {
  timestamp: number;
  banners: HeroSlide[];
  categories: CategoryMeta[];
  products: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  combos: Product[];
  featuredProducts: Product[];
  storeSettings: DbStoreSettings;
}

function loadCache(): CachedStorefrontPayload | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY) || localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedStorefrontPayload;
    if (parsed && typeof parsed.timestamp === 'number') {
      // Discard any legacy demo banners
      const cleanBanners = (parsed.banners || []).filter(
        (b) => !b.id.startsWith('slide-')
      );
      return {
        ...parsed,
        banners: cleanBanners,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveCache(payload: Omit<CachedStorefrontPayload, 'timestamp'>) {
  try {
    const item: CachedStorefrontPayload = {
      ...payload,
      timestamp: Date.now(),
    };
    const serialized = JSON.stringify(item);
    sessionStorage.setItem(CACHE_KEY, serialized);
    localStorage.setItem(CACHE_KEY, serialized);
  } catch {
    // Ignore storage quota errors
  }
}

export function useStorefrontData() {
  const initialCache = useRef(loadCache()).current;

  // Banners are strictly populated from the API / database - no hardcoded demo slides
  const [banners, setBanners] = useState<HeroSlide[]>(() => initialCache?.banners || []);
  const [categories, setCategories] = useState<CategoryMeta[]>(() => initialCache?.categories || []);
  const [products, setProducts] = useState<Product[]>(() => initialCache?.products || []);
  const [bestSellers, setBestSellers] = useState<Product[]>(() => initialCache?.bestSellers || []);
  const [newArrivals, setNewArrivals] = useState<Product[]>(() => initialCache?.newArrivals || []);
  const [combos, setCombos] = useState<Product[]>(() => initialCache?.combos || []);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => initialCache?.featuredProducts || []);
  const [storeSettings, setStoreSettings] = useState<DbStoreSettings>(
    () =>
      initialCache?.storeSettings || {
        id: 1,
        announcement_text: '',
        whatsapp_number: '',
        shipping_charge: 0,
        free_shipping_above: 0,
        cod_enabled: true,
      }
  );

  // If valid cache was loaded, avoid skeleton delay!
  const [isLoading, setIsLoading] = useState(!initialCache);
  const debounceTimerRef = useRef<number | null>(null);

  const fetchStorefrontData = useCallback(async (force = false) => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check if cache is still fresh within TTL unless force refresh is requested
    const existingCache = loadCache();
    if (!force && existingCache && Date.now() - existingCache.timestamp < CACHE_TTL_MS) {
      setBanners(existingCache.banners);
      setCategories(existingCache.categories);
      setProducts(existingCache.products);
      setBestSellers(existingCache.bestSellers);
      setNewArrivals(existingCache.newArrivals);
      setCombos(existingCache.combos);
      setFeaturedProducts(existingCache.featuredProducts);
      setStoreSettings(existingCache.storeSettings);
      setIsLoading(false);
      return;
    }

    try {
      if (!existingCache) {
        setIsLoading(true);
      }

      // Execute optimized single batched queries
      const [bannersRes, categoriesRes, productsRes, settingsRes] = await Promise.all([
        supabase
          .from('banners')
          .select('id, title, subtitle, cta_text, cta_link, image_url, sort_order, is_active, created_at')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),

        supabase
          .from('categories')
          .select('id, name, slug, image_url, sort_order, is_active, created_at')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),

        supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false }),

        supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle(),
      ]);

      const fetchedBanners = (bannersRes.data as DbBanner[]) || [];
      const fetchedCategories = (categoriesRes.data as DbCategory[]) || [];
      const fetchedProducts = (productsRes.data as DbProduct[]) || [];
      const rawSettings = settingsRes.data as DbStoreSettings | null;
      const effectiveTagline =
        rawSettings?.tagline?.trim() ||
        rawSettings?.announcement_text?.trim() ||
        'Power Your World';

      const fetchedSettings: DbStoreSettings = {
        id: 1,
        announcement_text: rawSettings?.announcement_text || '',
        whatsapp_number: rawSettings?.whatsapp_number || '',
        shipping_charge: Number(rawSettings?.shipping_charge || 0),
        free_shipping_above: Number(rawSettings?.free_shipping_above || 0),
        cod_enabled: rawSettings?.cod_enabled ?? true,
        tagline: effectiveTagline,
      };

      // 1. Settings
      setStoreSettings(fetchedSettings);

      // 2. Categories
      const catMap: Record<string, DbCategory> = {};
      fetchedCategories.forEach((c) => {
        catMap[c.id] = c;
      });

      const mappedCats: CategoryMeta[] = fetchedCategories.map((c) => ({
        id: (c.slug as any) || 'all',
        label: c.name || 'Category',
        shortLabel: (c.name || 'Category').split(' ')[0],
        tagline: 'Precision Hardware',
        pastelTint: '#FFF4ED',
        image: optimizeCloudinaryUrl(c.image_url || '/assets/ub-logo-official.jpg') || '/assets/ub-logo-official.jpg',
        sampleModel: 'tws-anc-pods',
        sampleColor: {
          id: 'black',
          name: 'Obsidian Black',
          hex: '#0D0E12',
          secondaryHex: '#2A2D3A',
        },
        count: 0,
      }));
      setCategories(mappedCats);

      // 3. Products
      const mappedProds: Product[] = fetchedProducts.map((p) => {
        const price = Number(p.price);
        const mrp = Number(p.compare_at_price || p.price);
        const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
        const matchedCat = p.category_id ? catMap[p.category_id] : null;
        const categorySlug = (matchedCat?.slug as any) || 'all';
        const categoryLabel = matchedCat?.name || 'Accessories';
        const primaryImage = p.images?.[0] || '/assets/ub-logo-official.jpg';

        const badge = p.is_best_seller
          ? 'Best Seller'
          : p.is_new_arrival
          ? 'New Arrival'
          : p.is_combo
          ? 'Power Combo'
          : p.is_featured
          ? 'Featured'
          : undefined;

        const badgeTone = p.is_best_seller
          ? 'peach'
          : p.is_new_arrival
          ? 'sky'
          : p.is_combo
          ? 'lavender'
          : 'mint';

        // Parse specs from p.specs or fallback to highlights
        const parsedSpecs = Array.isArray(p.specs) && p.specs.length > 0
          ? p.specs
          : (p.highlights || []).map((h) => {
              const colonIdx = h.indexOf(':');
              if (colonIdx > 0) {
                return {
                  label: h.slice(0, colonIdx).trim(),
                  value: h.slice(colonIdx + 1).trim(),
                };
              }
              return { label: 'Highlight', value: h };
            });

        const parsedWarranty = p.warranty || '1 Year Official Replacement Warranty';

        return {
          id: p.id,
          sku: p.sku || (p.slug ? p.slug.toUpperCase() : 'PRD0001'),
          name: p.name,
          subtitle: p.highlights?.[0] || p.description?.slice(0, 85) || 'Engineered for high performance & durability.',
          category: categorySlug,
          categoryLabel,
          hardwareModel: 'tws-anc-pods',
          image: optimizeCloudinaryUrl(primaryImage),
          price,
          mrp,
          discountPercent,
          rating: 4.9,
          reviewsCount: 120,
          badge,
          badgeTone,
          highlightBar: p.highlights?.[0] || parsedWarranty,
          isFlashDeal: Boolean(p.is_best_seller),
          claimedPercent: 72,
          stockLeft: 12,
          lifestyleTags: ['gaming', 'travel', 'wfh'],
          colors: [
            { id: 'black', name: 'Stealth Black', hex: '#0B0C10', secondaryHex: '#232733' },
            { id: 'white', name: 'Ceramic White', hex: '#FFFFFF', secondaryHex: '#E2E8F0' },
          ],
          specs: parsedSpecs,
          warranty: parsedWarranty,
          inBox: p.in_box && p.in_box.length > 0
            ? p.in_box
            : ['1x Hardware Unit', '1x Fast Charge Cable', 'User Manual', 'Warranty Card'],
          description: p.description || p.name,
          isFeatured: Boolean(p.is_featured),
          isBestSeller: Boolean(p.is_best_seller),
          isNewArrival: Boolean(p.is_new_arrival),
          isCombo: Boolean(p.is_combo),
        };
      });

      const bestSellersList = mappedProds.filter((p) => p.isBestSeller);
      const newArrivalsList = mappedProds.filter((p) => p.isNewArrival);
      const combosList = mappedProds.filter((p) => p.isCombo);
      const featuredProductsList = mappedProds.filter((p) => p.isFeatured);

      setProducts(mappedProds);
      setBestSellers(bestSellersList);
      setNewArrivals(newArrivalsList);
      setCombos(combosList);
      setFeaturedProducts(featuredProductsList);

      // 4. Banners - strictly populated from API
      const mappedBanners: HeroSlide[] = fetchedBanners.map((b, idx) => ({
        id: b.id,
        eyebrow: 'UPDATE BRO® FLAGSHIP',
        title: b.title || 'Flagship Hardware',
        highlightWord: 'Next-Gen',
        subtitle: b.subtitle || 'Power Your World with next-gen audio & mobile hardware.',
        ctaLabel: b.cta_text || 'Shop Now',
        secondaryCtaLabel: 'Explore Specs',
        targetCategory: 'all',
        featuredProductId: mappedProds[0]?.id || 'hero-product',
        image: optimizeCloudinaryUrl(b.image_url) || '/assets/ub-logo-official.jpg',
        gradientLight: 'from-amber-50/60 via-orange-50/30 to-transparent',
        gradientDark: 'from-amber-950/20 via-orange-950/10 to-transparent',
        pillTint: 'bg-accent/15 text-accent border-accent/30',
        floatingBadge: {
          label: 'Flagship Edition',
          metric: `#${idx + 1} Spotlight`,
        },
      }));
      setBanners(mappedBanners);

      // Persist to client cache
      saveCache({
        banners: mappedBanners,
        categories: mappedCats,
        products: mappedProds,
        bestSellers: bestSellersList,
        newArrivals: newArrivalsList,
        combos: combosList,
        featuredProducts: featuredProductsList,
        storeSettings: fetchedSettings,
      });
    } catch (err) {
      console.warn('Failed to load live storefront data from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorefrontData(false);

    if (!isSupabaseConfigured) return;

    // Debounced realtime updater to protect free tier quotas from rapid-fire API hits
    const triggerDebouncedFetch = () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        fetchStorefrontData(true);
      }, 400);
    };

    const channel = supabase
      .channel('storefront_live_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, triggerDebouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, triggerDebouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, triggerDebouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, triggerDebouncedFetch)
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [fetchStorefrontData]);

  return {
    banners,
    categories,
    products,
    bestSellers,
    newArrivals,
    combos,
    featuredProducts,
    storeSettings,
    isLoading,
    refreshStorefront: () => fetchStorefrontData(true),
  };
}
