import React from 'react';

/**
 * Modern tactile shimmer box with subtle pulse and reflection shine
 */
export const SkeletonBox: React.FC<{
  className?: string;
  rounded?: string;
}> = ({ className = 'h-4 w-full', rounded = 'rounded-xl' }) => {
  return (
    <div
      className={`animate-shimmer ${rounded} bg-cloud/80 dark:bg-cloud/40 border border-line/40 ${className}`}
    />
  );
};

/**
 * Hero Banner Shimmer Skeleton
 */
export const SkeletonHeroBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-cloud/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="animate-shimmer relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] w-full overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-12 flex flex-col justify-between">
          <div className="space-y-4 max-w-lg">
            <SkeletonBox className="h-6 w-36" rounded="rounded-full" />
            <SkeletonBox className="h-10 sm:h-14 w-full" rounded="rounded-2xl" />
            <SkeletonBox className="h-5 sm:h-6 w-3/4" rounded="rounded-xl" />
            <div className="pt-4 flex gap-3">
              <SkeletonBox className="h-12 w-36 sm:w-44" rounded="rounded-2xl" />
              <SkeletonBox className="h-12 w-32" rounded="rounded-2xl" />
            </div>
          </div>
          <div className="hidden sm:block absolute right-8 bottom-8 lg:right-16 lg:bottom-12 h-64 w-64 lg:h-80 lg:w-80 rounded-3xl bg-cloud/50 border border-line/60" />
        </div>
      </div>
    </section>
  );
};

/**
 * Category Strip Shimmer Skeleton
 */
export const SkeletonCategoryStrip: React.FC = () => {
  return (
    <section className="border-y border-line bg-surface/50 py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 shrink-0 rounded-2xl border border-line bg-surface px-4 py-2.5 animate-shimmer"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-cloud" />
              <div className="space-y-1.5 w-24">
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-2 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Individual Product Card Shimmer Skeleton
 */
export const SkeletonProductCard: React.FC = () => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-2.5 sm:p-3 shadow-sm animate-shimmer">
      {/* Image Container Skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cloud/60 border border-line/50 mb-2 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-cloud border border-line/40 opacity-70" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-1">
            <SkeletonBox className="h-2.5 w-14" rounded="rounded-full" />
            <SkeletonBox className="h-2.5 w-8" rounded="rounded-full" />
          </div>
          <SkeletonBox className="h-3.5 w-5/6 mb-1" />
          <SkeletonBox className="h-2.5 w-3/5" />
        </div>

        <div className="pt-2 border-t border-line/60 flex items-center justify-between">
          <div className="space-y-1">
            <SkeletonBox className="h-3.5 w-14" />
            <SkeletonBox className="h-2 w-8" />
          </div>
          <SkeletonBox className="h-7 w-16" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Product Grid Shimmer Skeleton
 */
export const SkeletonProductGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
};

/**
 * Widget Section Shimmer Skeleton
 */
export const SkeletonWidget: React.FC<{
  title?: string;
  badge?: string;
  cardsCount?: number;
}> = ({ title = 'Loading Showcase...', badge = 'Live Sync', cardsCount = 5 }) => {
  return (
    <section className="py-10 border-b border-line/60">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                {badge}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-ink">{title}</h2>
          </div>
          <SkeletonBox className="h-4 w-20 hidden sm:block" />
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: cardsCount }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
