import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Plus, Star, Timer, Zap } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { useCart } from '../context/CartContext';
import { useMotionConfig } from '../hooks/useMotionConfig';
import { useStorefront } from '../context/StorefrontContext';
import { SkeletonWidget } from './Skeletons';
import type { Product } from '../types';
import { ProductArt } from './ProductArt';
import { Tilt3DCard } from './motion/Tilt3DCard';

interface FlashDealsProps {
  onQuickView: (product: Product) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({ onQuickView }) => {
  const { bestSellers, isLoading } = useStorefront();
  const countdown = useCountdown(5 * 3600 + 42 * 60 + 18);
  const { addToCart } = useCart();
  const { isReduced } = useMotionConfig();

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const [addedId, setAddedId] = useState<string | null>(null);

  if (isLoading) {
    return <SkeletonWidget title="🔥 Best Sellers & Top Trending" badge="Best Sellers" cardsCount={5} />;
  }

  const dealProducts = bestSellers;

  if (dealProducts.length === 0) {
    return null;
  }

  const handleQuickAdd = (product: Product) => {
    const colorIdx = selectedColors[product.id] ?? 0;
    addToCart(product, product.colors[colorIdx], 1, false);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId((prev) => (prev === product.id ? null : prev)), 900);
  };

  return (
    <section id="flash-deals" className="mx-auto max-w-[1920px] px-4 pt-14 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
      <div className="rounded-card border border-line bg-gradient-to-br from-surface via-surface to-accent-soft p-5 shadow-soft sm:p-7">
        {/* Header with Live Ticking Countdown */}
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Daily Flash Deals
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-extrabold text-accent">
                  <Flame className="h-3 w-3 fill-current" /> LIVE
                </span>
              </div>
              <p className="text-xs text-muted sm:text-sm">
                Limited-batch drops with extra code <span className="font-mono font-bold text-accent">UPDATE10</span> stackable at checkout
              </p>
            </div>
          </div>

          {/* Live Countdown Pill */}
          <div className="flex items-center gap-2.5 self-start rounded-btn border border-line bg-cloud px-4 py-2.5 sm:self-auto">
            <Timer className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-muted">Ends in</span>
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-ink">
              <span className="rounded-md bg-surface px-2 py-1 shadow-sm">{countdown.hours}h</span>
              <span className="text-muted">:</span>
              <span className="rounded-md bg-surface px-2 py-1 shadow-sm">{countdown.minutes}m</span>
              <span className="text-muted">:</span>
              <span className="rounded-md bg-surface px-2 py-1 text-ink shadow-sm">
                {countdown.seconds}s
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Deal Cards */}
        <div className="no-scrollbar -mx-2 mt-6 flex gap-2.5 overflow-x-auto px-2 pb-2 sm:gap-3.5 lg:grid lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 lg:overflow-visible">
          {dealProducts.map((product, idx) => {
            const cIdx = selectedColors[product.id] ?? 0;
            const activeColor = product.colors[cIdx];
            const claimed = product.claimedPercent ?? 78;
            const isAdded = addedId === product.id;

            return (
              <motion.div
                key={product.id}
                initial={isReduced ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="w-40 sm:w-48 md:w-52 shrink-0 lg:w-auto"
              >
                <Tilt3DCard
                  maxTilt={8}
                  scaleOnHover={1.02}
                  glareOpacity={0.2}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-2.5 sm:p-3 transition-colors hover:border-accent hover:shadow-glow"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-extrabold text-accent">
                      {product.discountPercent}% OFF
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-ink">
                      <Star className="h-3 w-3 fill-[#FF9500] text-[#FF9500]" />
                      {product.rating}
                    </span>
                  </div>

                  {/* Clickable Real-Photo Showcase */}
                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    className="group relative my-2 block aspect-square w-full overflow-hidden rounded-xl bg-cloud/75 transition"
                  >
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <ProductArt
                        model={product.hardwareModel}
                        color={activeColor}
                        image={product.image}
                        alt={product.name}
                        showWatermarkBadge
                      />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    className="truncate text-left text-xs sm:text-sm font-bold text-ink hover:underline"
                  >
                    {product.name}
                  </button>
                  <p className="mt-0.5 truncate text-[10px] sm:text-[11px] font-medium text-muted">
                    {product.highlightBar}
                  </p>

                  {/* Color Swatch Dots */}
                  <div className="mt-2 flex items-center gap-1.5">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColors((prev) => ({ ...prev, [product.id]: i }))}
                        title={c.name}
                        aria-label={`Select ${c.name}`}
                        className={`h-3.5 w-3.5 rounded-full border transition ${
                          cIdx === i
                            ? 'scale-110 border-ink ring-2 ring-accent/60'
                            : 'border-black/15 opacity-80 hover:opacity-100 dark:border-white/20'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  {/* Stock Claimed Progress Bar */}
                  <div className="mt-2.5">
                    <div className="mb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-bold">
                      <span className="text-muted">{claimed}% Claimed</span>
                      <span className="text-accent font-extrabold">
                        Only {product.stockLeft} left
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-cloud">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${claimed}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-accent to-[#FFA026]"
                      />
                    </div>
                  </div>

                  {/* Price & Quick Add */}
                  <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-line">
                    <div className="min-w-0">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-ink truncate">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="ml-1 font-mono text-[10px] sm:text-xs text-muted line-through shrink-0">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className={`inline-flex h-7 sm:h-8 items-center gap-1 rounded-xl px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold transition shrink-0 ${
                        isAdded
                          ? 'bg-ink text-canvas dark:bg-white dark:text-black'
                          : 'bg-accent text-accent-ink hover:bg-accent-hover shadow-sm hover:shadow-glow'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </Tilt3DCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
