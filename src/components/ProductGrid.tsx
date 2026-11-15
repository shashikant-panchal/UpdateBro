import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
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
  const [sortBy, setSortBy] = useState<SortKey>('featured');

  const tabs: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All Gear' },
    ...CATEGORIES.map((c) => ({ id: c.id as CategoryId, label: c.shortLabel })),
  ];

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

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
  }, [activeCategory, activeLifestyle, searchQuery, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'all' || Boolean(searchQuery.trim()) || Boolean(activeLifestyle);

  const resetAllFilters = () => {
    onSelectCategory('all');
    onClearSearch();
    onClearLifestyle();
  };

  return (
    <section id="catalog-section" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
      {/* Header + Controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Full UB Lineup • {PRODUCTS.length} Branded SKUs
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
              className={`relative shrink-0 rounded-btn px-4 py-2 text-xs font-bold transition sm:text-sm ${
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
              {tab.label}
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

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-ink">No matching UPDATE BRO® gear found</p>
          <p className="mt-1 text-sm text-muted">
            Try clearing your search query or switching back to All Gear.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-5 rounded-btn bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink hover:bg-accent-hover"
          >
            Show All {PRODUCTS.length} Products
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </section>
  );
};
