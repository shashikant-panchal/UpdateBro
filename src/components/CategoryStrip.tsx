import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { useMotionConfig } from '../hooks/useMotionConfig';
import type { CategoryId } from '../types';

interface CategoryStripProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { isReduced } = useMotionConfig();
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (offset: number) => {
    railRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section id="categories-strip" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Curated Hardware
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Shop by{' '}
            <span className="underline decoration-accent decoration-4 underline-offset-4">
              Categories
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => scrollRail(-320)}
              aria-label="Scroll categories left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(320)}
              aria-label="Scroll categories right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-xs font-bold text-ink transition hover:border-accent hover:bg-accent-soft sm:text-sm"
          >
            <span>Explore Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* boAt-Inspired Horizontal Squircle Strip across 8 Hardware Categories */}
      <div
        ref={railRef}
        className="no-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:gap-4 sm:px-0"
      >
        {CATEGORIES.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              initial={isReduced ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: idx * 0.025 }}
              whileHover={isReduced ? {} : { y: -4 }}
              whileTap={isReduced ? {} : { scale: 0.97 }}
              className="group flex w-[124px] shrink-0 flex-col items-center text-center sm:w-[138px] lg:w-[146px]"
            >
              {/* Full-Visibility Real Studio Photography Squircle */}
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-card border transition-all duration-300 ${
                  isActive
                    ? 'border-accent ring-2 ring-accent/70 shadow-glow'
                    : 'border-line bg-surface shadow-soft group-hover:border-accent group-hover:shadow-glow'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </div>

              <span className="mt-2.5 line-clamp-2 text-xs font-bold leading-snug text-ink sm:text-[13px]">
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
