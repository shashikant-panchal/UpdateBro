import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Layers, Plus, Gift, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMotionConfig } from '../hooks/useMotionConfig';
import { useStorefront } from '../context/StorefrontContext';
import { SkeletonWidget } from './Skeletons';
import type { Product } from '../types';
import { ProductArt } from './ProductArt';
import { Tilt3DCard } from './motion/Tilt3DCard';

interface CombosSectionProps {
  onQuickView: (product: Product) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({ onQuickView }) => {
  const { combos, isLoading } = useStorefront();
  const { addToCart } = useCart();
  const { isReduced } = useMotionConfig();
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  if (isLoading) {
    return <SkeletonWidget title="Power Combos & Value Bundles" badge="Bundle & Save" cardsCount={3} />;
  }

  if (combos.length === 0) {
    return null;
  }

  const handleAddCombo = (product: Product) => {
    addToCart(product, product.colors[0], 1, false);
    setAddedComboId(product.id);
    window.setTimeout(() => setAddedComboId((prev) => (prev === product.id ? null : prev)), 1300);
  };

  return (
    <section id="combos-section" className="mx-auto max-w-[1920px] px-4 pt-16 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-500">
              <Gift className="h-3 w-3" /> VALUE PACKS
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Double Up &amp; Save More</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Power{' '}
            <span className="underline decoration-purple-500 decoration-4 underline-offset-4">
              Combos &amp; Kits
            </span>
          </h2>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted sm:inline-flex">
          <Layers className="h-3.5 w-3.5 text-accent" /> Pair with UPDATE10 for extra 10% OFF
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
        {combos.map((product, idx) => {
          const isAdded = addedComboId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={isReduced ? {} : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
            >
              <Tilt3DCard
                maxTilt={8}
                scaleOnHover={1.02}
                glareOpacity={0.2}
                className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-3.5 sm:p-4 shadow-soft transition hover:border-purple-500 hover:shadow-glow"
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-block rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[9px] font-extrabold text-purple-500">
                      🎁 POWER COMBO
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-ink">
                      <Star className="h-3 w-3 fill-[#FF9500] text-[#FF9500]" />
                      {product.rating}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    className="group relative my-2.5 block aspect-[16/10] w-full overflow-hidden rounded-xl bg-cloud/70 transition"
                  >
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <ProductArt
                        model={product.hardwareModel}
                        color={product.colors[0]}
                        image={product.image}
                        alt={product.name}
                        showWatermarkBadge
                      />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    className="truncate text-left font-display text-sm sm:text-base font-bold text-ink hover:underline block w-full"
                  >
                    {product.name}
                  </button>
                  <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted">
                    {product.subtitle}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-line pt-3">
                  <div className="min-w-0">
                    <span className="font-mono text-base sm:text-lg font-extrabold text-ink truncate">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.mrp > product.price && (
                      <span className="ml-1.5 font-mono text-[10px] sm:text-xs text-muted line-through shrink-0">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddCombo(product)}
                    className={`inline-flex h-8 sm:h-9 items-center gap-1 rounded-xl px-3 text-xs font-bold transition shrink-0 ${
                      isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-accent text-white hover:bg-accent-hover shadow-glow'
                    }`}
                  >
                    {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>{isAdded ? 'Added!' : 'Add Combo'}</span>
                  </button>
                </div>
              </Tilt3DCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
