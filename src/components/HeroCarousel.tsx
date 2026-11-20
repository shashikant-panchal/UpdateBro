import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMotionConfig } from '../hooks/useMotionConfig';
import { useStorefront } from '../context/StorefrontContext';
import { SkeletonHeroBanner } from './Skeletons';
import type { Product } from '../types';

interface HeroCarouselProps {
  onInspectProduct: (product: Product) => void;
}

const SLIDE_DURATION_MS = 3500;

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    zIndex: 2,
    x: dir > 0 ? 30 : -30,
  }),
  center: {
    opacity: 1,
    zIndex: 2,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    zIndex: 1,
    x: dir > 0 ? -30 : 30,
  }),
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onInspectProduct }) => {
  // 1. All Hooks MUST be called unconditionally at top of component (Rules of Hooks)
  const { banners = [], products = [], isLoading } = useStorefront();
  const [[index, direction], setSlideState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const wasDraggedRef = useRef(false);
  const { isReduced } = useMotionConfig();

  // Reset index if banners array changes
  useEffect(() => {
    setSlideState([0, 1]);
  }, [banners?.length]);

  // Auto-slide interval (Only when there are 2 or more banners)
  useEffect(() => {
    if (paused || !banners || banners.length <= 1) return;
    const id = window.setInterval(() => {
      setSlideState(([prev]) => [((prev + 1) % banners.length + banners.length) % banners.length, 1]);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [paused, index, banners?.length]);

  // 2. Conditional returns are safe AFTER all hooks have executed
  if (isLoading) {
    return <SkeletonHeroBanner />;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const safeIndex = ((Math.floor(index || 0) % banners.length) + banners.length) % banners.length;
  const slide = banners[safeIndex] || banners[0];

  if (!slide) {
    return null;
  }

  // Safe product match: If no matching product exists, display banner as a pure showcase image (avoid navigation)
  const featuredProduct =
    products?.find((p) => p && p.id === slide.featuredProductId) || null;

  const hasClickAction = Boolean(featuredProduct);

  const paginate = (dir: number) => {
    if (banners.length <= 1) return;
    setSlideState(([prev]) => {
      const nextIdx = ((prev + dir) % banners.length + banners.length) % banners.length;
      return [nextIdx, dir];
    });
  };

  const goToIndex = (targetIdx: number) => {
    if (banners.length <= 1) return;
    const bounded = ((targetIdx % banners.length) + banners.length) % banners.length;
    setSlideState(([prev]) => [bounded, bounded >= prev ? 1 : -1]);
  };

  const handleDragStart = () => {
    wasDraggedRef.current = false;
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 12) {
      wasDraggedRef.current = true;
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (banners.length <= 1) return;
    if (info.offset.x < -45) paginate(1);
    else if (info.offset.x > 45) paginate(-1);
    window.setTimeout(() => {
      wasDraggedRef.current = false;
    }, 80);
  };

  const handleBannerClick = () => {
    if (wasDraggedRef.current) return;
    if (featuredProduct) {
      onInspectProduct(featuredProduct);
    }
  };

  return (
    <section
      id="top"
      className="mx-auto max-w-[1920px] px-4 pt-3 sm:px-6 sm:pt-4 md:px-8 lg:px-12 2xl:px-16 3xl:px-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-card border border-line bg-surface shadow-soft aspect-[2.1/1] sm:aspect-[2.4/1] md:aspect-[2.7/1] lg:aspect-[1920/640]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id || `banner-${safeIndex}`}
            custom={direction}
            variants={isReduced ? undefined : slideVariants}
            initial={isReduced ? { opacity: 1 } : 'enter'}
            animate="center"
            exit={isReduced ? { opacity: 1 } : 'exit'}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            role={hasClickAction ? 'button' : undefined}
            tabIndex={hasClickAction ? 0 : undefined}
            aria-label={
              featuredProduct?.name
                ? `View details for ${featuredProduct.name}`
                : slide.title || 'Featured Banner'
            }
            onClick={hasClickAction ? handleBannerClick : undefined}
            onKeyDown={
              hasClickAction
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleBannerClick();
                    }
                  }
                : undefined
            }
            drag={isReduced || banners.length <= 1 ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden ${
              hasClickAction ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <img
              src={slide.image || '/assets/ub-logo-official.jpg'}
              alt={featuredProduct?.name ?? slide.title ?? 'Hero Banner'}
              className="pointer-events-none h-full w-full object-cover object-center select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/ub-logo-official.jpg';
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Top-Right Navigation Arrows (Only when more than 1 banner) */}
        {banners.length > 1 && (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              aria-label="Previous banner"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-sm backdrop-blur-md transition hover:bg-black/90 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              aria-label="Next banner"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-sm backdrop-blur-md transition hover:bg-black/90 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        )}

        {/* Bottom Center Animated Progress Indicators (Only when more than 1 banner) */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-4 sm:gap-2">
            {banners.map((s, idx) => {
              const active = idx === safeIndex;
              return (
                <button
                  key={s?.id || `dot-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(idx);
                  }}
                  aria-label={`Go to banner ${idx + 1}: ${s?.title || 'Slide'}`}
                  className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                    active ? 'w-6 sm:w-8 bg-white/40' : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                >
                  {active && (
                    <motion.div
                      key={`${s?.id || idx}-${paused}`}
                      initial={{ width: '0%' }}
                      animate={{ width: paused ? '50%' : '100%' }}
                      transition={{
                        duration: paused ? 0.2 : SLIDE_DURATION_MS / 1000,
                        ease: 'linear',
                      }}
                      className="h-full rounded-full bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
