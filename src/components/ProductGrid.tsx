import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpDown,
  Bell,
  CheckCircle2,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useStorefront } from '../context/StorefrontContext';
import { SkeletonProductGrid } from './Skeletons';
import type { CategoryId, Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onClearSearch: () => void;
  activeLifestyle: string | null;
  onClearLifestyle: () => void;
  onQuickView: (product: Product) => void;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

export const ProductGrid: React.FC<ProductGridProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  activeLifestyle,
  onClearLifestyle,
  onQuickView,
}) => {
  const { categories, products, isLoading } = useStorefront();
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');

  const tabs: { id: CategoryId; label: string; isSoon?: boolean }[] = [
    { id: 'all', label: 'All Gear' },
    ...categories.map((c) => ({
      id: c.id as CategoryId,
      label: c.shortLabel || c.label,
      isSoon: products.filter((p) => p.category === c.id).length === 0,
    })),
  ];

  const isComingSoonCategory = useMemo(() => {
    if (activeCategory === 'all') return false;
    return products.filter((p) => p.category === activeCategory).length === 0;
  }, [activeCategory, products]);

  const activeCategoryMeta = useMemo(() => {
    return categories.find((c) => c.id === activeCategory);
  }, [activeCategory, categories]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (activeLifestyle) {
      list = list.filter((p) =>
        p.lifestyleTags.includes(activeLifestyle as 'wfh' | 'gaming' | 'travel' | 'fitness')
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.subtitle || '').toLowerCase().includes(q) ||
          (p.categoryLabel || '').toLowerCase().includes(q) ||
          (p.highlightBar || '').toLowerCase().includes(q)
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
  }, [products, activeCategory, activeLifestyle, searchQuery, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'all' || Boolean(searchQuery.trim()) || Boolean(activeLifestyle);

  const resetAllFilters = () => {
    onSelectCategory('all');
    onClearSearch();
    onClearLifestyle();
  };

  return (
    <section id="catalog-section" className="mx-auto max-w-[1920px] px-4 pt-14 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
      {/* Header + Controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Full UB Lineup • {products.length} Products Live
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Bestsellers &amp;{' '}
            <span className="underline decoration-accent decoration-4 underline-offset-4">
              Signature Drops
            </span>
          </h2>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              aria-label="Sort products"
              className="h-10 rounded-btn border border-line bg-surface pl-8 pr-3 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs with Framer Motion layoutId sliding pill */}
      <div className="no-scrollbar mt-6 flex items-center gap-2 overflow-x-auto border-b border-line pb-3">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`relative inline-flex items-center gap-1.5 shrink-0 rounded-btn px-4 py-2 text-xs font-bold transition sm:text-sm ${
                isActive ? 'text-accent-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeCategoryTab"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-btn bg-accent shadow-sm"
                />
              )}
              <span>{tab.label}</span>
              {tab.isSoon && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    isActive
                      ? 'bg-black/20 text-accent-ink'
                      : 'bg-accent/25 text-accent-ink dark:bg-accent/20 dark:text-accent'
                  }`}
                >
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Contextual Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-muted">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Active Filters:
          </span>
          {activeLifestyle && (
            <button
              type="button"
              onClick={onClearLifestyle}
              className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 font-bold text-ink"
            >
              Lifestyle: {activeLifestyle.toUpperCase()} ×
            </button>
          )}
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-1 rounded-full bg-cloud px-3 py-1 font-bold text-ink"
            >
              Query: &ldquo;{searchQuery}&rdquo; ×
            </button>
          )}
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted underline hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" /> Reset All
          </button>
        </div>
      )}

      {/* Product Grid or Coming Soon State */}
      {isComingSoonCategory ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            {activeCategoryMeta && (
              <div className="group relative mb-5 aspect-[915/1024] w-40 overflow-hidden rounded-2xl border border-line bg-white shadow-soft sm:w-48">
                <img
                  src={activeCategoryMeta.image}
                  alt={activeCategoryMeta.label}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-2.5 top-2.5 rounded-full bg-accent px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent-ink shadow-sm">
                  Soon
                </span>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-bold text-ink">
              <Sparkles className="h-3.5 w-3.5 text-accent-ink" />
              <span>DROPPING SOON • UPDATE BRO®</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-black text-ink sm:text-3xl">
              {activeCategoryMeta?.label || 'This Category'} Drops Are Coming Soon!
            </h3>
            <p className="mt-2 max-w-lg text-xs text-muted sm:text-sm">
              We&apos;re currently preparing this collection with high-fidelity acoustic drivers,
              rugged battery endurance, and instant BIS fast charging. Stay tuned!
            </p>

            <div className="mt-6 w-full max-w-md">
              {notified ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-accent-soft/80 p-3 text-xs font-bold text-[#1B8A5A] dark:text-[#8CE0B9]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>You&apos;ll be the first to know when {activeCategoryMeta?.label} drop!</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNotified(true);
                  }}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for launch alerts"
                    className="h-10 flex-1 rounded-full border border-line bg-cloud px-4 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-accent px-5 text-xs font-bold text-accent-ink shadow-sm transition hover:bg-accent-hover"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>Notify Me</span>
                  </button>
                </form>
              )}
            </div>

            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-5 py-2.5 text-xs font-bold text-ink transition hover:border-accent hover:bg-accent-soft sm:text-sm"
            >
              <span>Show All Available Gear ({products.length} Products)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="mt-8">
          <SkeletonProductGrid count={8} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-ink">No products found</p>
          <p className="mt-1 text-sm text-muted">
            {products.length === 0
              ? 'Catalog items uploading soon. New collections dropping shortly.'
              : 'Try clearing your search query or switching category filter.'}
          </p>
          {products.length > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-5 rounded-btn bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink hover:bg-accent-hover"
            >
              Show All {products.length} Products
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </section>
  );
};
