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
  ArrowRight,
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
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-2xl transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between gap-4 px-4 sm:h-[76px] sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
          {/* Left: Official Brand Logo Lockup */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              if (onGoHome) onGoHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex shrink-0 items-center rounded-xl py-1 focus:outline-none"
          >
            <BrandLogo className="text-ink transition-transform duration-300 group-hover:scale-[1.02]" />
          </a>

          {/* Center: Desktop Navigation Pill Bar */}
          <nav className="hidden items-center gap-1 rounded-full border border-line bg-surface/90 px-2 py-1 shadow-sm backdrop-blur-lg lg:flex">
            {/* Categories Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsMegaOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold text-ink transition hover:bg-cloud"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition-transform duration-200 ${isMegaOpen ? 'rotate-180 text-accent' : ''
                    }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {isMegaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute left-0 top-full mt-2 w-[580px] rounded-2xl border border-line bg-surface p-4 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-line pb-2.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-muted">
                        Hardware Collections
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePickCategory('all')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent transition hover:opacity-80"
                      >
                        <span>View All Drops</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handlePickCategory(cat.id)}
                          className={`flex items-center gap-3 rounded-xl border p-2 text-left transition ${activeCategory === cat.id
                            ? 'border-accent bg-accent/10 shadow-sm'
                            : 'border-transparent bg-cloud/40 hover:border-accent/40 hover:bg-cloud'
                            }`}
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-surface p-0.5">
                            <img
                              src={cat.image}
                              alt={cat.label}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-xs font-bold text-ink">{cat.label}</p>
                              {cat.count === 0 && (
                                <span className="rounded bg-accent/20 px-1.5 py-0.2 text-[8px] font-black uppercase text-accent">
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="truncate text-[10px] text-muted">{cat.tagline}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-[10px] text-muted">
                      <span>
                        <strong className="text-ink">UPDATE BRO®</strong> •{' '}
                        <strong className="text-accent">Power Your World.</strong> (Hyderabad)
                      </span>
                      <a
                        href="https://www.updatebro.in"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-bold text-accent hover:underline"
                      >
                        www.updatebro.in
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Section Nav Buttons */}
            <button
              type="button"
              onClick={() => scrollToSection('flash-deals')}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold text-ink transition hover:bg-cloud"
            >
              <Flame className="h-3.5 w-3.5 text-[#FF6A00]" />
              <span>Daily Drops</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('combos-section')}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold text-ink transition hover:bg-cloud"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Combos</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('lifestyle-bento')}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold text-ink transition hover:bg-cloud"
            >
              <Layers className="h-3.5 w-3.5 text-muted" />
              <span>Lifestyle</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Predictive Search Bar */}
            <div ref={searchRef} className="relative hidden w-56 lg:block xl:w-72 2xl:w-80">
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
                className="h-10 w-full rounded-full border border-line bg-surface/90 pl-10 pr-8 text-xs font-semibold text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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

              {/* Predictive Search Floating Results */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-2xl"
                  >
                    <div className="mb-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                      {searchQuery ? 'Top Matches' : 'Popular Drops'}
                    </div>

                    <div className="space-y-1 max-h-80 overflow-y-auto no-scrollbar">
                      {predictiveMatches.map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => {
                            setIsSearchFocused(false);
                            onQuickView(prod);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-cloud"
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cloud p-1">
                            <ProductArt
                              model={prod.hardwareModel}
                              color={prod.colors[0]}
                              image={prod.image}
                              alt={prod.name}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-ink">{prod.name}</p>
                            <p className="truncate text-[10px] text-muted">{prod.highlightBar}</p>
                          </div>
                          <span className="font-mono text-xs font-black text-ink">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-[10px] text-muted">
                      <span>
                        <strong className="text-ink">UPDATE BRO®</strong> •{' '}
                        <strong className="text-accent">Power Your World.</strong> (Hyderabad)
                      </span>
                      <a
                        href="https://www.updatebro.in"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-bold text-accent hover:underline"
                      >
                        www.updatebro.in
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={cycleMode}
              title={`Theme: ${mode.toUpperCase()} (click to switch)`}
              className="hidden h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-xs font-bold text-ink transition hover:border-accent lg:inline-flex"
              aria-label="Toggle theme mode"
            >
              <motion.span
                key={mode}
                initial={{ rotate: -30, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.22 }}
              >
                <ThemeIcon className="h-4 w-4 text-accent" />
              </motion.span>
              <span className="capitalize">{mode} Mode</span>
            </button>

            {/* Cart Button */}
            <motion.button
              type="button"
              onClick={() => setIsCartOpen(true)}
              animate={cartBounce ? { scale: [1, 1.15, 0.95, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-xs font-black uppercase tracking-wider text-canvas shadow-sm transition hover:opacity-90 dark:bg-accent dark:text-accent-ink"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 font-mono text-xs font-black text-accent-ink dark:bg-ink dark:text-canvas">
                {itemCount}
              </span>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-accent lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="relative z-10 flex h-full w-full max-w-xs flex-col border-l border-line bg-canvas shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-4">
                <BrandLogo />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-cloud text-ink"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {/* Search */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Search Products
                  </label>
                  <div className="relative mt-1.5">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Earbuds, chargers, cables..."
                      className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-8 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                      Theme
                    </span>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-accent">
                      {resolvedTheme}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex h-9 items-center justify-center rounded-xl border text-xs font-bold capitalize transition ${mode === m
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-line bg-cloud text-ink'
                          }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Explore
                  </span>
                  {[
                    { label: 'All Categories', action: () => handlePickCategory('all') },
                    { label: 'Daily Drops', action: () => scrollToSection('flash-deals') },
                    { label: 'Combos & Bundles', action: () => scrollToSection('combos-section') },
                    { label: 'Lifestyle Store', action: () => scrollToSection('lifestyle-bento') },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={item.action}
                      className="flex w-full items-center justify-between rounded-xl p-3 text-left text-xs font-bold text-ink transition hover:bg-cloud"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted" />
                    </button>
                  ))}
                </div>

                {/* Brand & Corporate Details */}
                <div className="rounded-2xl border border-line bg-cloud/60 p-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">UPDATE BRO®</span>
                    <span className="text-[10px] font-black uppercase text-accent">Power Your World.</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">
                    Next-generation mobile &amp; audio accessories
                  </p>
                  <div className="mt-2 text-[10px] text-muted space-y-0.5 border-t border-line/60 pt-2">
                    <p>Hyderabad, Telangana, India</p>
                  </div>
                  <div className="mt-2 text-[9px] text-muted/80">
                    <p>UPDATE BRO – Powering Connections.</p>
                    <p className="font-semibold text-accent">Power Your World – Every Device, Everywhere.</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
