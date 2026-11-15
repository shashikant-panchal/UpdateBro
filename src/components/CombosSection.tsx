import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Layers, Plus } from 'lucide-react';
import { POWER_COMBOS } from '../data/storefront';
import { PRODUCT_MAP } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useMotionConfig } from '../hooks/useMotionConfig';
import type { Product } from '../types';
import { ProductArt } from './ProductArt';

interface CombosSectionProps {
  onQuickView: (product: Product) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({ onQuickView }) => {
  const { addToCart } = useCart();
  const { isReduced } = useMotionConfig();
  const [addedCombo, setAddedCombo] = useState<string | null>(null);

  const handleAddCombo = (comboId: string, ids: [string, string]) => {
    ids.forEach((id) => {
      const prod = PRODUCT_MAP[id];
      if (prod) addToCart(prod, prod.colors[0], 1, false);
    });
    setAddedCombo(comboId);
    window.setTimeout(() => setAddedCombo((prev) => (prev === comboId ? null : prev)), 1300);
  };

  return (
    <section id="combos-section" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Double Up &amp; Save More
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Power{' '}
            <span className="underline decoration-accent decoration-4 underline-offset-4">
              Combos &amp; Kits
            </span>
          </h2>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted sm:inline-flex">
          <Layers className="h-3.5 w-3.5 text-accent" /> Pair with UPDATE10 for extra 10% OFF
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {POWER_COMBOS.map((combo, idx) => {
          const p1 = PRODUCT_MAP[combo.productIds[0]];
          const p2 = PRODUCT_MAP[combo.productIds[1]];
          if (!p1 || !p2) return null;
          const isAdded = addedCombo === combo.id;

          return (
            <motion.div
              key={combo.id}
              initial={isReduced ? {} : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`flex flex-col justify-between overflow-hidden rounded-card border border-line bg-gradient-to-br ${combo.pastelBg} bg-surface p-5 shadow-soft transition hover:border-accent`}
            >
              <div>
                <span className="inline-block rounded-full bg-surface/90 px-3 py-1 text-[10px] font-extrabold tracking-wider text-ink shadow-sm">
                  {combo.badge}
                </span>

                {/* Dual Clickable Product Visual Pair */}
                <div className="mt-4 grid grid-cols-2 items-center gap-2 rounded-xl border border-line bg-surface/80 p-3">
                  <button
                    type="button"
                    onClick={() => onQuickView(p1)}
                    title={`Inspect ${p1.name}`}
                    className="h-28 overflow-hidden rounded-lg transition hover:opacity-95"
                  >
                    <ProductArt
                      model={p1.hardwareModel}
                      color={p1.colors[0]}
                      image={p1.image}
                      alt={p1.name}
                    />
                  </button>
                  <div className="relative border-l border-dashed border-line pl-2">
                    <span className="pointer-events-none absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-xs font-bold text-ink shadow-sm">
                      +
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuickView(p2)}
                      title={`Inspect ${p2.name}`}
                      className="h-28 w-full overflow-hidden rounded-lg transition hover:opacity-95"
                    >
                      <ProductArt
                        model={p2.hardwareModel}
                        color={p2.colors[0]}
                        image={p2.image}
                        alt={p2.name}
                      />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-ink">{combo.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{combo.subtitle}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div>
                  <span className="font-mono text-xl font-extrabold text-ink">
                    ₹{combo.comboPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted line-through">
                    ₹{combo.combinedMrp.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddCombo(combo.id, combo.productIds)}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-btn px-4 text-xs font-bold transition ${
                    isAdded
                      ? 'bg-ink text-canvas dark:bg-white dark:text-black'
                      : 'bg-accent text-accent-ink hover:bg-accent-hover'
                  }`}
                >
                  {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{isAdded ? 'Kit Added!' : 'Add Both'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
