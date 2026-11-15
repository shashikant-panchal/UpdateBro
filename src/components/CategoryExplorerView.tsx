import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpDown, Minus, Plus, Search, Star, X } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useMotionConfig } from '../hooks/useMotionConfig';
import type { CategoryId, Product } from '../types';

interface CategoryExplorerViewProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onBackHome: () => void;
  onQuickView: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

interface RailCategoryItem {
  id: CategoryId;
  label: string;
  shortLabel: string;
  tagline: string;
  image: string;
}

export const CategoryExplorerView: React.FC<CategoryExplorerViewProps> = ({
  activeCategory,
  onSelectCategory,
  onBackHome,
  onQuickView,
  searchQuery,
  onSearchChange,
}) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { isReduced } = useMotionConfig();

  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const contentTopRef = useRef<HTMLDivElement>(null);

  const railCategories: RailCategoryItem[] = useMemo(
    () => [
      {
        id: 'all',
        label: 'All Gear',
        shortLabel: 'All Gear',
        tagline: 'Every UPDATE BRO® Drop',
        image: '/assets/products/ub-tws-anc-01.jpg',
      },
      ...CATEGORIES.map((c) => ({
        id: c.id as CategoryId,
        label: c.label,
        shortLabel: c.shortLabel,
        tagline: c.tagline,
        image: c.image,
      })),
    ],
    []
  );

  const currentMeta = useMemo(
    () => railCategories.find((c) => c.id === activeCategory) ?? railCategories[0],
    [activeCategory, railCategories]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRailSwitch = (id: CategoryId) => {
    onSelectCategory(id);
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = useMemo(() => {
    let list =
      activeCategory === 'all'
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.highlightBar.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        list.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      default:
        break;
    }

    return list;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <motion.section
      initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={isReduced ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="min-h-[calc(100vh-74px)] bg-canvas"
    >
      {/* Sticky Top Category Explorer Toolbar */}
      <div className="sticky top-16 z-30 border-b border-line bg-surface/95 backdrop-blur-md sm:top-[74px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2.5 px-3 py-2.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-cloud px-3 text-xs font-bold text-ink transition hover:border-accent hover:bg-accent-soft sm:px-3.5 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Home</span>
            </button>

            <div className="min-w-0">
              <h1 className="truncate font-display text-sm font-extrabold text-ink sm:text-lg">
                {currentMeta.label}
              </h1>
              <p className="hidden truncate text-xs text-muted sm:block">
                {currentMeta.tagline} • {filteredProducts.length} items
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Compact Filter Input inside Explorer */}
            <div className="relative hidden md:block md:w-52">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter this view..."
                className="h-9 w-full rounded-full border border-line bg-cloud pl-8 pr-7 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex h-9 items-center gap-1.5 rounded-full border border-line bg-cloud px-2.5 text-xs font-semibold text-ink sm:px-3">
              <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                aria-label="Sort category products"
                className="bg-transparent text-xs font-bold text-ink focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Max % Off</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Blinkit-Style Split View: Long Vertical Left Rail + Right Product Grid */}
      <div className="mx-auto flex max-w-7xl">
        {/* Left Vertical Category Sidebar */}
        <aside
          aria-label="Category list"
          className="sticky top-[120px] h-[calc(100vh-120px)] w-[88px] shrink-0 overflow-y-auto border-r border-line bg-surface/75 py-2 sm:top-[130px] sm:h-[calc(100vh-130px)] sm:w-[116px] md:w-[235px] no-scrollbar"
        >
          <div className="flex flex-col gap-1 px-1 sm:px-2">
            {railCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleRailSwitch(cat.id)}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl px-1.5 py-2.5 text-center transition md:flex-row md:gap-3 md:px-3 md:py-2.5 md:text-left ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {/* Animated Vertical Moving Pill Indicator (Blinkit Signature Style) */}
                  {isActive && (
                    <motion.span
                      layoutId="blinkitVerticalIndicator"
                      transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      className="absolute bottom-2 right-0 top-2 z-10 w-1 rounded-l-full bg-accent shadow-sm md:w-1.5"
                    />
                  )}

                  {/* Animated Subtle Sliding Surface Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="blinkitActiveCategoryBg"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className="pointer-events-none absolute inset-0 rounded-xl border border-accent/40 bg-accent-soft/85"
                    />
                  )}

                  {/* Real-Photo Category Thumbnail */}
                  <div
                    className={`relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded-xl border transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 ${
                      isActive ? 'border-accent shadow-sm' : 'border-line bg-cloud'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Category Name & Item Count */}
                  <div className="relative z-10 min-w-0 flex-1">
                    <p
                      className={`line-clamp-2 text-[11px] leading-tight sm:text-xs md:text-sm ${
                        isActive ? 'font-extrabold text-ink' : 'font-semibold'
                      }`}
                    >
                      <span className="md:hidden">{cat.shortLabel}</span>
                      <span className="hidden md:inline">{cat.label}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Scrollable Product Feed */}
        <div ref={contentTopRef} className="min-w-0 flex-1 scroll-mt-36 p-2.5 sm:p-5 lg:p-6">
          {/* Active Filter Chip if Search Active */}
          {searchQuery.trim() && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs">
              <span>
                Showing matches for <strong className="text-ink">&ldquo;{searchQuery}&rdquo;</strong>
              </span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="font-bold text-ink underline decoration-accent decoration-2 underline-offset-2"
              >
                Clear filter
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${sortBy}`}
              initial={isReduced ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReduced ? {} : { opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-card border border-line bg-surface px-4 py-14 text-center">
                  <p className="font-display text-base font-bold text-ink sm:text-lg">
                    No matching products in {currentMeta.label}
                  </p>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Try clearing your search filter or switch categories from the left sidebar.
                  </p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="mt-4 rounded-btn bg-accent px-4 py-2 text-xs font-bold text-accent-ink"
                    >
                      Show All in {currentMeta.shortLabel}
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const cIdx = selectedColors[product.id] ?? 0;
                    const activeColor = product.colors[cIdx] ?? product.colors[0];
                    const cartKey = `${product.id}:${activeColor.id}`;
                    const inCartItem = items.find((item) => item.key === cartKey);

                    return (
                      <article
                        key={product.id}
                        className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft transition hover:border-accent"
                      >
                        {/* Real Studio Photo Area */}
                        <button
                          type="button"
                          onClick={() => onQuickView(product)}
                          className="relative aspect-square w-full overflow-hidden bg-cloud text-left focus:outline-none"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute left-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-extrabold text-[#1B8A5A] shadow-sm backdrop-blur-sm dark:text-[#8CE0B9]">
                            {product.discountPercent}% OFF
                          </span>
                        </button>

                        {/* Product Info + Instant ADD / Stepper */}
                        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
                          <div>
                            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px]">
                              <span className="truncate font-semibold text-muted">
                                {product.highlightBar}
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-0.5 font-bold text-ink">
                                <Star className="h-3 w-3 fill-[#F5B841] text-[#F5B841]" />
                                {product.rating}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onQuickView(product)}
                              className="mt-1 line-clamp-2 text-left font-display text-xs font-bold leading-snug text-ink hover:underline sm:text-sm"
                            >
                              {product.name}
                            </button>

                            {/* Color Swatch Selector */}
                            <div className="mt-2 flex items-center gap-1.5">
                              {product.colors.map((c, idx) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedColors((prev) => ({ ...prev, [product.id]: idx }))
                                  }
                                  title={c.name}
                                  aria-label={`Select ${c.name}`}
                                  className={`h-4 w-4 rounded-full border transition ${
                                    cIdx === idx
                                      ? 'scale-110 border-ink ring-2 ring-accent/70'
                                      : 'border-black/15 opacity-75 hover:opacity-100 dark:border-white/25'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Price + Blinkit ADD / Stepper */}
                          <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-line pt-2.5">
                            <div className="min-w-0">
                              <p className="font-mono text-sm font-extrabold text-ink sm:text-base">
                                ₹{product.price.toLocaleString('en-IN')}
                              </p>
                              <p className="font-mono text-[10px] text-muted line-through sm:text-[11px]">
                                ₹{product.mrp.toLocaleString('en-IN')}
                              </p>
                            </div>

                            {inCartItem ? (
                              <div className="inline-flex h-8 items-center rounded-btn bg-accent px-1 text-accent-ink shadow-sm sm:h-9">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(cartKey, -1)}
                                  aria-label="Decrease quantity"
                                  className="flex h-7 w-6 items-center justify-center rounded-md hover:bg-black/10"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-[18px] text-center font-mono text-xs font-extrabold">
                                  {inCartItem.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(cartKey, 1)}
                                  aria-label="Increase quantity"
                                  className="flex h-7 w-6 items-center justify-center rounded-md hover:bg-black/10"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addToCart(product, activeColor, 1, false)}
                                className="inline-flex h-8 items-center justify-center rounded-btn border border-accent bg-accent-soft px-3 text-xs font-extrabold text-ink transition hover:bg-accent hover:text-accent-ink sm:h-9 sm:px-4"
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};
