import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Flame,
  Layers,
  Menu,
  Monitor,
  Moon,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import type { CategoryId, Product, ThemeMode } from '../types';
import { BrandLogo } from './BrandLogo';
import { ProductArt } from './ProductArt';

interface NavbarProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onGoHome?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickView: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onGoHome,
  searchQuery,
  onSearchChange,
  onQuickView,
}) => {
  const { mode, resolvedTheme, setMode, cycleMode } = useTheme();
  const { itemCount, setIsCartOpen, lastAddedTick } = useCart();

  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastAddedTick > 0) {
      setCartBounce(true);
      const t = window.setTimeout(() => setCartBounce(false), 450);
      return () => window.clearTimeout(t);
    }
  }, [lastAddedTick]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const predictiveMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 5);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsMegaOpen(false);
    if (onGoHome) onGoHome();
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 90);
  };

  const handlePickCategory = (cat: CategoryId) => {
    setIsMobileMenuOpen(false);
    setIsMegaOpen(false);
    onSelectCategory(cat);
  };

  const ThemeIcon = mode === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[74px] sm:px-6 lg:px-8">
          {/* Left: Brand Logo (clean across mobile & desktop) */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              if (onGoHome) onGoHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex shrink-0 items-center rounded-btn py-1 focus:outline-none"
          >
            <BrandLogo className="text-ink transition-transform duration-200 group-hover:scale-[1.02]" />
          </a>

          {/* Center Desktop Navigation Pill Bar */}
          <nav className="hidden items-center gap-1 rounded-full border border-line bg-surface/85 px-2 py-1 shadow-sm lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsMegaOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:bg-cloud"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition-transform duration-200 ${
                    isMegaOpen ? 'rotate-180 text-ink' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isMegaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-full mt-3 w-[680px] rounded-card border border-line bg-surface p-5 shadow-soft"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Shop UPDATE BRO® Categories
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePickCategory('all')}
                        className="text-xs font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:opacity-80"
                      >
                        Explore Categories
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handlePickCategory(cat.id)}
                          className={`flex items-center gap-3 rounded-btn border p-2.5 text-left transition hover:border-accent hover:bg-cloud ${
                            activeCategory === cat.id
                              ? 'border-accent bg-accent-soft'
                              : 'border-transparent bg-cloud/50'
                          }`}
                        >
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
                            <ProductArt
                              model={cat.sampleModel}
                              color={cat.sampleColor}
                              image={cat.image}
                              alt={cat.label}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink">{cat.label}</p>
                            <p className="truncate text-xs text-muted">{cat.tagline}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('flash-deals')}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:bg-cloud"
            >
              <Flame className="h-3.5 w-3.5 text-[#FF8870]" />
              <span>Daily Deals</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('combos-section')}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:bg-cloud"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Combos</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('lifestyle-bento')}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:bg-cloud"
            >
              <Layers className="h-3.5 w-3.5 text-muted" />
              <span>Lifestyle</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Predictive Search */}
            <div ref={searchRef} className="relative hidden w-60 lg:block xl:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search buds, 65W GaN, watch..."
                className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-8 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-card border border-line bg-surface p-2.5 shadow-soft"
                  >
                    <p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                      {searchQuery.trim() ? 'Matching Products' : 'Trending Gear'}
                    </p>
                    {predictiveMatches.length === 0 ? (
                      <p className="px-2 py-4 text-center text-xs text-muted">
                        No gear found for &ldquo;{searchQuery}&rdquo;
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {predictiveMatches.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              setIsSearchFocused(false);
                              onQuickView(prod);
                            }}
                            className="flex w-full items-center gap-3 rounded-btn p-2 text-left transition hover:bg-cloud"
                          >
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cloud">
                              <ProductArt
                                model={prod.hardwareModel}
                                color={prod.colors[0]}
                                image={prod.image}
                                alt={prod.name}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-ink">{prod.name}</p>
                              <p className="truncate text-[11px] text-muted">{prod.highlightBar}</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-ink">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Light / Dark / System Toggle */}
            <button
              type="button"
              onClick={cycleMode}
              title={`Theme: ${mode.toUpperCase()} (click to switch)`}
              className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-xs font-bold text-ink transition hover:border-accent lg:inline-flex"
              aria-label="Toggle color mode"
            >
              <motion.span
                key={mode}
                initial={{ rotate: -25, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ThemeIcon className="h-4 w-4" />
              </motion.span>
              <span className="capitalize">{mode} Theme</span>
            </button>

            {/* Cart Button (Visible on both Mobile & Desktop) */}
            <motion.button
              type="button"
              onClick={() => setIsCartOpen(true)}
              animate={cartBounce ? { scale: [1, 1.15, 0.95, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-ink px-3.5 text-sm font-bold text-canvas transition hover:opacity-90 dark:bg-accent dark:text-accent-ink"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 font-mono text-xs font-bold text-accent-ink dark:bg-ink dark:text-canvas">
                {itemCount}
              </span>
            </motion.button>

            {/* Mobile 3-Lines Menu Button (Beside Cart at Right Side) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-accent lg:hidden"
              aria-label="Open menu and theme settings"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Right Slide-Over Drawer: Theme Settings, Search & Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="relative z-10 flex h-full w-full max-w-xs flex-col border-l border-line bg-canvas shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-4">
                <BrandLogo />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cloud text-ink"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Settings + Navigation */}
              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {/* Mobile Search */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Search Store
                  </label>
                  <div className="relative mt-1.5">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Earbuds, watches, GaN..."
                      className="h-11 w-full rounded-btn border border-line bg-surface pl-9 pr-8 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {searchQuery.trim() && (
                    <div className="mt-2 space-y-1.5">
                      {predictiveMatches.slice(0, 3).map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onQuickView(prod);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-btn border border-line bg-surface p-2 text-left"
                        >
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-cloud">
                            <ProductArt
                              model={prod.hardwareModel}
                              color={prod.colors[0]}
                              image={prod.image}
                              alt={prod.name}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-ink">{prod.name}</p>
                            <p className="font-mono text-[11px] text-muted">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clean Light / Dark Appearance Selector */}
                <div className="rounded-card border border-line bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink">
                      Appearance
                    </p>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink">
                      {resolvedTheme}
                    </span>
                  </div>

                  {/* Mode Pills */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex h-10 items-center justify-center gap-1.5 rounded-btn border text-xs font-bold capitalize transition ${
                          mode === m
                            ? 'border-accent bg-accent text-accent-ink'
                            : 'border-line bg-cloud text-ink hover:border-accent/60'
                        }`}
                      >
                        {m === 'light' && <Sun className="h-3.5 w-3.5" />}
                        {m === 'dark' && <Moon className="h-3.5 w-3.5" />}
                        {m === 'system' && <Monitor className="h-3.5 w-3.5" />}
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Storefront Navigation */}
                <div className="space-y-1.5">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                    Quick Sections
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection('categories-strip')}
                    className="flex h-11 w-full items-center justify-between rounded-btn border border-line bg-surface px-3.5 text-sm font-bold text-ink"
                  >
                    <span>Shop by Categories</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('flash-deals')}
                    className="flex h-11 w-full items-center justify-between rounded-btn border border-line bg-surface px-3.5 text-sm font-bold text-ink"
                  >
                    <span>Daily Flash Deals</span>
                    <span className="rounded-full bg-[#FF9B85]/25 px-2 py-0.5 text-[10px] font-extrabold text-[#B83B24] dark:text-[#FFB3A2]">
                      LIVE
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('combos-section')}
                    className="flex h-11 w-full items-center justify-between rounded-btn border border-line bg-surface px-3.5 text-sm font-bold text-ink"
                  >
                    <span>Power Combos &amp; Kits</span>
                    <span className="text-xs text-muted">Save Extra</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('lifestyle-bento')}
                    className="flex h-11 w-full items-center justify-between rounded-btn border border-line bg-surface px-3.5 text-sm font-bold text-ink"
                  >
                    <span>Shop by Lifestyle</span>
                    <span className="text-xs text-muted">→</span>
                  </button>
                </div>

                {/* All Categories */}
                <div className="space-y-1">
                  <p className="px-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                    Browse Categories
                  </p>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handlePickCategory(cat.id)}
                      className={`flex h-10 w-full items-center justify-between rounded-btn px-3 text-sm font-semibold transition ${
                        activeCategory === cat.id
                          ? 'bg-accent text-accent-ink font-bold'
                          : 'text-ink hover:bg-cloud'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
