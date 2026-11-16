import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { useMotionConfig } from '../hooks/useMotionConfig';
import type { CategoryId } from '../types';
import { Tilt3DCard } from './motion/Tilt3DCard';

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
    <section id="categories-strip" className="mx-auto max-w-[1920px] px-4 pt-10 sm:px-6 sm:pt-12 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
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
          <div className="hidden items-center gap-1.5 sm:flex 2xl:hidden">
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
            <span>Explore All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* boAt-Inspired Strip across 10 Hardware Categories (fluid rail on mobile/laptop, full-width 10-col grid on wide monitors) */}
      <div
        ref={railRef}
        className="no-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:gap-4 sm:px-0 2xl:grid 2xl:grid-cols-10 2xl:gap-3 3xl:gap-4 2xl:overflow-visible"
      >
        {CATEGORIES.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          const productCount = PRODUCTS.filter((p) => p.category === cat.id).length;
          const isComingSoon = productCount === 0;

          return (
            <motion.div
              key={cat.id}
              initial={isReduced ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: idx * 0.025 }}
              className="w-[130px] shrink-0 sm:w-[145px] lg:w-[155px] xl:w-[165px] 2xl:w-full"
            >
              <Tilt3DCard
                maxTilt={10}
                scaleOnHover={1.03}
                glareOpacity={0.2}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative aspect-[915/1024] w-full overflow-hidden rounded-2xl border transition-all duration-300 bg-white cursor-pointer ${
                  isActive
                    ? 'border-accent ring-2 ring-accent/70 shadow-glow'
                    : 'border-line shadow-soft hover:border-accent hover:shadow-glow'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="h-full w-full object-contain p-1 transition-transform duration-500 hover:scale-[1.03]"
                />

                {isComingSoon && (
                  <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent-ink shadow-sm">
                    Soon
                  </span>
                )}
              </Tilt3DCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
