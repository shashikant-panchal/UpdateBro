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

const SLIDE_DURATION_MS = 6500;

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 44 : -44,
    scale: 1.025,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -34 : 34,
    scale: 0.985,
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
    if (info.offset.x < -55) paginate(1);
    else if (info.offset.x > 55) paginate(-1);
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
      className="mx-auto max-w-[1920px] px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-card border border-line bg-[#F3F5F8] shadow-soft">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={isReduced ? undefined : slideVariants}
            initial={isReduced ? { opacity: 1 } : 'enter'}
            animate="center"
            exit={isReduced ? { opacity: 1 } : 'exit'}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
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
            className="group relative flex aspect-[16/9] min-h-[205px] w-full cursor-pointer items-center overflow-hidden sm:aspect-auto sm:min-h-[395px] lg:min-h-[470px] 2xl:min-h-[540px] 3xl:min-h-[600px]"
          >
            {/* Full Clear Light Studio Hardware Photography with Gentle Living Breath Motion */}
            <motion.img
              src={slide.image}
              alt={featuredProduct?.name ?? slide.title}
              initial={isReduced ? {} : { scale: 1.05, x: direction > 0 ? 14 : -14 }}
              animate={
                isReduced
                  ? { scale: 1, x: 0 }
                  : {
                      scale: [1.0, 1.032, 1.0],
                      x: [0, -6, 0],
                    }
              }
              transition={
                isReduced
                  ? { duration: 0 }
                  : {
                      scale: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                      x: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                    }
              }
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 group-hover:scale-[1.03] sm:object-center"
            />

            {/* Subtle Ambient Studio Light-Sheen Reflection Sweep */}
            {!isReduced && (
              <motion.div
                aria-hidden="true"
                initial={{ x: '-120%' }}
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
            )}

            {/* Whisper-Soft Light Left Edge Cushion Only — Never Obscures Products */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 via-32% to-transparent sm:from-white/45 sm:via-white/10 sm:via-38%" />

            {/* Left-Side Compact Dark Copy (No Buttons — Strictly Left Open Space, Dark Over Light Backdrop) */}
            <div className="relative z-10 w-[45%] max-w-[45%] pb-6 pl-3.5 pr-1 pt-3 sm:w-auto sm:max-w-[44%] sm:px-9 sm:py-12 lg:max-w-[42%] lg:px-12 2xl:max-w-[40%] 2xl:px-16 3xl:px-20">
              <motion.div
                initial={isReduced ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36 }}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#16181F]/15 bg-white/75 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#16181F] backdrop-blur-sm sm:px-3 sm:py-1 sm:text-[11px]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16181F]" />
                <span className="truncate">{slide.eyebrow.split('•')[0].trim()}</span>
              </motion.div>

              <motion.h1
                initial={isReduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="mt-1.5 font-display text-[17px] font-extrabold leading-[1.12] tracking-tight text-[#14171F] sm:mt-3 sm:text-3xl lg:text-[42px] 2xl:text-[50px] 3xl:text-[56px]"
              >
                {slide.title}
              </motion.h1>

              <motion.div
                initial={isReduced ? {} : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.14 }}
                className="mt-1.5 h-0.5 w-7 origin-left rounded-full bg-[#14171F]/70 sm:mt-3 sm:h-1 sm:w-12"
              />

              <motion.p
                initial={isReduced ? {} : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.44, delay: 0.14 }}
                className="mt-1.5 line-clamp-2 text-[10px] font-semibold leading-snug text-[#3F4554] sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-relaxed lg:text-[15px] 2xl:text-[17px]"
              >
                {slide.subtitle}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Subtle Top-Right Controls */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 sm:right-5 sm:top-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              paginate(-1);
            }}
            aria-label="Previous banner"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#14171F]/15 bg-white/80 text-[#14171F] shadow-sm backdrop-blur-md transition hover:bg-white sm:h-9 sm:w-9"
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
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#14171F]/15 bg-white/80 text-[#14171F] shadow-sm backdrop-blur-md transition hover:bg-white sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Bottom-Left Animated Progress Indicators */}
        <div className="absolute bottom-2.5 left-3.5 z-20 flex w-24 items-center gap-1.5 sm:bottom-5 sm:left-9 sm:w-44 sm:gap-2 lg:left-12">
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
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-[#14171F]/20 sm:h-1.5"
              >
                {active && (
                  <motion.div
                    key={`${s.id}-${paused}`}
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? '45%' : '100%' }}
                    transition={{
                      duration: paused ? 0.2 : SLIDE_DURATION_MS / 1000,
                      ease: 'linear',
                    }}
                    className="h-full rounded-full bg-[#14171F]"
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
