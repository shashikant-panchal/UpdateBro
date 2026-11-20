import React, { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Check, Eye, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMotionConfig } from '../hooks/useMotionConfig';
import type { Product } from '../types';
import { ProductArt } from './ProductArt';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const BADGE_STYLES: Record<NonNullable<Product['badgeTone']>, string> = {
  mint: 'bg-accent text-accent-ink font-extrabold',
  lavender: 'bg-[#181B24]/90 text-white dark:bg-[#2C3142] dark:text-[#F3F5F8]',
  peach: 'bg-accent/20 text-accent font-extrabold',
  sky: 'bg-[#1B5B85]/15 text-[#134263] dark:bg-[#4FA6DB]/20 dark:text-[#98D2F5]',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { tiltEnabled, isReduced } = useMotionConfig();

  const [colorIdx, setColorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [flyBurstKey, setFlyBurstKey] = useState(0);

  const activeColor = product.colors[colorIdx] ?? product.colors[0];
  const supportsHover =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(hover: hover)').matches;
  const activeTilt = tiltEnabled && supportsHover;

  // Framer Motion 3D Tilt Values
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 24 });
  const sy = useSpring(my, { stiffness: 260, damping: 24 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const glareX = useTransform(sx, [-0.5, 0.5], ['15%', '85%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['15%', '85%']);
  const glareOpacity = useTransform(
    [sx, sy],
    ([x, y]: number[]) => Math.min(0.24, Math.sqrt(x * x + y * y) * 0.6)
  );
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.38) 0%, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleAdd = () => {
    addToCart(product, activeColor, 1, false);
    setJustAdded(true);
    setFlyBurstKey((k) => k + 1);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <motion.article
      layout={!isReduced}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        activeTilt
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: 'preserve-3d',
            }
          : undefined
      }
      initial={isReduced ? {} : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 hover:border-accent hover:shadow-glow"
    >
      {/* Dynamic Specular Glare Sheen */}
      {activeTilt && !isReduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200"
          style={{
            opacity: glareOpacity,
            background: glareBg,
          }}
        />
      )}

      {/* Top Real-Photo Studio Stage */}
      <div className="relative flex flex-col bg-cloud/60">
        {/* Top-Left Pill Badge & Top-Right Quick View */}
        <div className="pointer-events-none absolute inset-x-2 top-2 z-10 flex items-center justify-between gap-1.5">
          {product.badge ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wider shadow-sm backdrop-blur-md ${
                BADGE_STYLES[product.badgeTone ?? 'mint']
              }`}
            >
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => onQuickView(product)}
            title="Quick View Specs"
            className="pointer-events-auto inline-flex h-6 sm:h-7 items-center gap-1 rounded-full border border-line bg-surface/90 px-2 text-[10px] font-bold text-ink shadow-sm backdrop-blur-md transition hover:border-accent"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">Specs</span>
          </button>
        </div>

        {/* Clickable Full-Bleed Real Product Photography */}
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="relative block aspect-square w-full overflow-hidden focus:outline-none"
        >
          <motion.div
            key={activeColor.id}
            initial={isReduced ? {} : { scale: 0.97, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          >
            <ProductArt
              model={product.hardwareModel}
              color={activeColor}
              image={product.image}
              alt={product.name}
              className="h-full w-full !rounded-none"
              showWatermarkBadge
            />
          </motion.div>
        </button>

        {/* Bottom Spec Highlight Pill Bar */}
        <div className="border-t border-line bg-accent-soft px-2.5 py-1 text-center">
          <p className="truncate text-[10px] sm:text-[11px] font-bold tracking-wide text-ink">
            {product.highlightBar}
          </p>
        </div>
      </div>

      {/* Product Details Body */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
        <div>
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px]">
            <span className="truncate font-semibold text-muted">{product.categoryLabel}</span>
            <span className="inline-flex shrink-0 items-center gap-0.5 font-bold text-ink">
              <Star className="h-3 w-3 fill-[#F5B841] text-[#F5B841]" />
              {product.rating}
              <span className="font-normal text-muted">({product.reviewsCount})</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="mt-1 line-clamp-1 text-left font-display text-xs sm:text-sm font-bold text-ink transition hover:text-muted"
          >
            {product.name}
          </button>
          <p className="mt-0.5 line-clamp-1 text-[10px] sm:text-[11px] text-muted">{product.subtitle}</p>

          {/* Interactive Color Swatch Dots */}
          <div className="mt-2 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorIdx(idx)}
                  title={c.name}
                  aria-label={`Colorway: ${c.name}`}
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border transition-transform ${
                    idx === colorIdx
                      ? 'scale-110 border-ink ring-2 ring-accent/70'
                      : 'border-black/15 opacity-80 hover:scale-105 hover:opacity-100 dark:border-white/25'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <span className="truncate text-[10px] font-medium text-muted">{activeColor.name}</span>
          </div>
        </div>

        {/* Pricing + Flying Cart Add Button */}
        <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-line pt-2.5">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-sm sm:text-base font-extrabold text-ink truncate">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-muted line-through shrink-0">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-accent">
              {product.discountPercent}% OFF
            </span>
          </div>

          <div className="relative shrink-0">
            <AnimatePresence>
              {flyBurstKey > 0 && justAdded && !isReduced && (
                <motion.span
                  key={flyBurstKey}
                  initial={{ opacity: 1, y: 0, x: 0, scale: 0.7 }}
                  animate={{ opacity: 0, y: -48, x: 16, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="pointer-events-none absolute -top-2 right-2 z-20 inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-accent-ink shadow-md"
                >
                  <ShoppingBag className="h-2.5 w-2.5" /> +1
                </motion.span>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={handleAdd}
              whileTap={isReduced ? {} : { scale: 0.94 }}
              className={`relative inline-flex h-8 sm:h-8.5 items-center gap-1 overflow-hidden rounded-xl px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold transition whitespace-nowrap ${
                justAdded
                  ? 'bg-ink text-canvas dark:bg-[#F4F5F8] dark:text-[#121318]'
                  : 'bg-accent text-accent-ink shadow-sm hover:bg-accent-hover hover:shadow-glow'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
