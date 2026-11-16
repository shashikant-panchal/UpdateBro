import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { BrandLogo } from './BrandLogo';
import { ProductArt } from './ProductArt';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'warranty'>('specs');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setColorIdx(0);
    setQty(1);
    setActiveTab('specs');
    setAdded(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  const handleAdd = (buyNow = false) => {
    if (!product) return;
    const activeColor = product.colors[colorIdx] ?? product.colors[0];
    addToCart(product, activeColor, qty, buyNow);
    if (buyNow) {
      onClose();
    } else {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1200);
    }
  };

  return (
    <AnimatePresence>
      {product && (() => {
        const activeColor = product.colors[colorIdx] ?? product.colors[0];
        return (
          <div key={product.id} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label={product.name}
              className="relative z-10 grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-card border border-line bg-surface shadow-2xl md:grid-cols-12"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/90 text-muted transition hover:border-accent hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Left Visual Showcase */}
              <div className="flex flex-col justify-between bg-cloud/85 p-6 md:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-surface px-3 py-1 font-mono text-[11px] font-bold text-muted">
                    {product.sku}
                  </span>
                  <BrandLogo variant="horizontal" className="h-5 w-auto" />
                </div>

                <motion.div
                  key={activeColor.id}
                  initial={{ scale: 0.96, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="my-4 aspect-square w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
                >
                  <ProductArt
                    model={product.hardwareModel}
                    color={activeColor}
                    image={product.image}
                    alt={product.name}
                    showWatermarkBadge
                  />
                </motion.div>

                {/* Colorway Selector */}
                <div className="rounded-btn border border-line bg-surface p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Colorway: <span className="text-ink">{activeColor.name}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {product.colors.map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColorIdx(idx)}
                        aria-label={c.name}
                        className={`h-7 w-7 rounded-full border transition ${
                          idx === colorIdx
                            ? 'scale-110 border-ink ring-2 ring-accent'
                            : 'border-black/15 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Specs & Purchase Panel */}
              <div className="flex flex-col justify-between p-6 md:col-span-7">
                <div>
                  <div className="flex items-center gap-2 pr-8 text-xs">
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-bold text-ink">
                      {product.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-ink">
                      <Star className="h-3.5 w-3.5 fill-[#F5B841] text-[#F5B841]" />
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                  </div>

                  <h2 className="mt-2.5 font-display text-2xl font-bold text-ink">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted">{product.description}</p>

                  {/* Price Row */}
                  <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
                    <span className="font-mono text-3xl font-extrabold text-ink">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="font-mono text-sm text-muted line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-extrabold text-accent">
                      SAVE {product.discountPercent}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">
                    Inclusive of all taxes • Extra 10% off with code{' '}
                    <span className="font-mono font-bold text-ink">UPDATE10</span>
                  </p>

                  {/* Specs / Warranty Tabs */}
                  <div className="mt-5 flex gap-2 border-b border-line pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('specs')}
                      className={`rounded-btn px-3 py-1.5 text-xs font-bold transition ${
                        activeTab === 'specs'
                          ? 'bg-accent text-accent-ink'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      Technical Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('warranty')}
                      className={`rounded-btn px-3 py-1.5 text-xs font-bold transition ${
                        activeTab === 'warranty'
                          ? 'bg-accent text-accent-ink'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      Warranty &amp; Box Contents
                    </button>
                  </div>

                  {activeTab === 'specs' ? (
                    <div className="mt-3 divide-y divide-line rounded-btn border border-line bg-cloud/50">
                      {product.specs.map((sp) => (
                        <div
                          key={sp.label}
                          className="flex items-center justify-between gap-4 px-3.5 py-2 text-xs"
                        >
                          <span className="font-medium text-muted">{sp.label}</span>
                          <span className="text-right font-semibold text-ink">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3 rounded-btn border border-line bg-cloud/50 p-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <div>
                          <p className="font-bold text-ink">Official Coverage</p>
                          <p className="text-muted">{product.warranty}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Box className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <div>
                          <p className="font-bold text-ink">What&apos;s in the Box</p>
                          <ul className="mt-1 grid grid-cols-1 gap-1 text-muted sm:grid-cols-2">
                            {product.inBox.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                  {/* Quantity */}
                  <div className="inline-flex h-11 items-center rounded-btn border border-line bg-cloud px-1">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-ink hover:bg-surface"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-sm font-bold text-ink">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-ink hover:bg-surface"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(false)}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-btn border border-line bg-surface px-4 text-sm font-bold text-ink transition hover:border-accent hover:bg-cloud"
                  >
                    {added ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAdd(true)}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-btn bg-accent px-5 text-sm font-bold text-accent-ink shadow-glow transition hover:bg-accent-hover"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}
    </AnimatePresence>
  );
};
