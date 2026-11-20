import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMotionConfig } from '../hooks/useMotionConfig';
import { useStorefront } from '../context/StorefrontContext';
import { SkeletonWidget } from './Skeletons';
import type { Product } from '../types';
import { ProductArt } from './ProductArt';
import { Tilt3DCard } from './motion/Tilt3DCard';

interface NewArrivalsWidgetProps {
  onQuickView: (product: Product) => void;
}

export const NewArrivalsWidget: React.FC<NewArrivalsWidgetProps> = ({ onQuickView }) => {
  const { newArrivals, isLoading } = useStorefront();
  const { addToCart } = useCart();
  const { isReduced } = useMotionConfig();

  const [addedId, setAddedId] = useState<string | null>(null);

  if (isLoading) {
    return <SkeletonWidget title="⚡ New Arrivals — Just Landed" badge="New Drops" cardsCount={4} />;
  }

  const items = newArrivals;

  if (items.length === 0) {
    return null;
  }

  const handleQuickAdd = (product: Product) => {
    addToCart(product, product.colors[0], 1, false);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId((prev) => (prev === product.id ? null : prev)), 900);
  };

  return (
    <section id="new-arrivals" className="mx-auto max-w-[1920px] px-4 pt-14 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-500">
              <Sparkles className="h-3 w-3" /> FRESH DROP
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Latest Hardware</span>
          </div>
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl tracking-tight">
            New Arrivals &amp;{' '}
            <span className="underline decoration-blue-500 decoration-4 underline-offset-4">
              Innovations
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((product, idx) => {
          const activeColor = product.colors[0];
          const isAdded = addedId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={isReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <Tilt3DCard
                maxTilt={8}
                scaleOnHover={1.02}
                glareOpacity={0.2}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-2.5 sm:p-3 transition-all duration-300 hover:border-blue-500 hover:shadow-glow"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[9px] font-extrabold text-blue-500">
                    NEW RELEASE
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-ink">
                    <Star className="h-3 w-3 fill-[#FF9500] text-[#FF9500]" />
                    {product.rating}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="group relative my-2 block aspect-square w-full overflow-hidden rounded-xl bg-cloud/70 transition"
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

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => onQuickView(product)}
                      className="truncate text-left text-xs sm:text-sm font-bold text-ink hover:underline block w-full"
                    >
                      {product.name}
                    </button>
                    <p className="mt-0.5 line-clamp-1 text-[10px] sm:text-[11px] font-medium text-muted">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-line flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-mono text-sm sm:text-base font-black text-ink truncate">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      {product.mrp > product.price && (
                        <p className="font-mono text-[10px] sm:text-[11px] text-muted line-through shrink-0">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className={`flex h-7 sm:h-8 items-center gap-1 rounded-xl px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold transition shadow-sm shrink-0 ${
                        isAdded
                          ? 'bg-green-500 text-white'
                          : 'bg-accent text-white hover:bg-accent-hover shadow-glow'
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
                </div>
              </Tilt3DCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
