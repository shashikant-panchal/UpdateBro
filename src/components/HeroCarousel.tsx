import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../data/storefront';
import { PRODUCT_MAP } from '../data/catalog';
import { useMotionConfig } from '../hooks/useMotionConfig';
import type { Product } from '../types';

interface HeroCarouselProps {
  onInspectProduct: (product: Product) => void;
}

const SLIDE_DURATION_MS = 2000;

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 35 : -35,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -35 : 35,
  }),
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onInspectProduct }) => {
  const [[index, direction], setSlideState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const wasDraggedRef = useRef(false);
  const { isReduced } = useMotionConfig();

  const slide = HERO_SLIDES[index];
  const featuredProduct = PRODUCT_MAP[slide.featuredProductId];

  const paginate = (dir: number) => {
    setSlideState(([prev]) => [(prev + dir + HERO_SLIDES.length) % HERO_SLIDES.length, dir]);
  };

  const goToIndex = (targetIdx: number) => {
    setSlideState(([prev]) => [targetIdx, targetIdx >= prev ? 1 : -1]);
  };

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setSlideState(([prev]) => [(prev + 1) % HERO_SLIDES.length, 1]);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [paused, index]);

  const handleDragStart = () => {
    wasDraggedRef.current = false;
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 12) {
      wasDraggedRef.current = true;
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -45) paginate(1);
    else if (info.offset.x > 45) paginate(-1);
    window.setTimeout(() => {
      wasDraggedRef.current = false;
    }, 80);
  };

  const handleBannerClick = () => {
    if (wasDraggedRef.current) return;
    if (featuredProduct) onInspectProduct(featuredProduct);
  };

  return (
    <section
      id="top"
      className="mx-auto max-w-[1920px] px-4 pt-3 sm:px-6 sm:pt-4 md:px-8 lg:px-12 2xl:px-16 3xl:px-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-card border border-line bg-[#0B0D11] shadow-soft">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={isReduced ? undefined : slideVariants}
            initial={isReduced ? { opacity: 1 } : 'enter'}
            animate="center"
            exit={isReduced ? { opacity: 1 } : 'exit'}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${featuredProduct?.name ?? slide.title}`}
            onClick={handleBannerClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBannerClick();
              }
            }}
            drag={isReduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden h-[200px] sm:h-[260px] md:h-[310px] lg:h-[360px] xl:h-[390px] 2xl:h-[410px]"
          >
            {/* Ambient Matching Glow for wide desktop screens so it blends seamlessly */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 blur-2xl select-none"
              aria-hidden="true"
            >
              <img
                src={slide.image}
                alt=""
                className="h-full w-full object-cover object-center scale-110"
              />
            </div>

            {/* Main Sharp Complete Banner Image: 100% visible, zero cropping on all devices */}
            <img
              src={slide.image}
              alt={featuredProduct?.name ?? slide.title}
              className="relative z-10 pointer-events-none h-full w-full object-contain object-center select-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Top-Right Navigation Arrows */}
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

        {/* Bottom Center Animated Progress Indicators */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-4 sm:gap-2">
          {HERO_SLIDES.map((s, idx) => {
            const active = idx === index;
            return (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(idx);
                }}
                aria-label={`Go to banner ${idx + 1}: ${s.title}`}
                className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                  active ? 'w-6 sm:w-8 bg-white/40' : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              >
                {active && (
                  <motion.div
                    key={`${s.id}-${paused}`}
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
      </div>
    </section>
  );
};
