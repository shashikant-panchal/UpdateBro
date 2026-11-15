import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LIFESTYLE_TILES } from '../data/storefront';
import { useMotionConfig } from '../hooks/useMotionConfig';
import { BrandLogo } from './BrandLogo';

interface LifestyleBentoProps {
  onSelectLifestyle: (id: 'wfh' | 'gaming' | 'travel' | 'fitness') => void;
}

export const LifestyleBento: React.FC<LifestyleBentoProps> = ({ onSelectLifestyle }) => {
  const { isReduced } = useMotionConfig();

  const handleTileClick = (id: 'wfh' | 'gaming' | 'travel' | 'fitness') => {
    onSelectLifestyle(id);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="lifestyle-bento" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Built For Every Move
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Shop by{' '}
            <span className="underline decoration-accent decoration-4 underline-offset-4">
              Lifestyle
            </span>
          </h2>
        </div>
        <p className="text-xs font-medium text-muted sm:text-sm">
          Tap any curated vibe to filter matching UPDATE BRO® gear
        </p>
      </div>

      <div className="grid auto-rows-[230px] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[220px]">
        {LIFESTYLE_TILES.map((tile, idx) => (
          <motion.button
            key={tile.id}
            type="button"
            onClick={() => handleTileClick(tile.id)}
            initial={isReduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            whileHover={isReduced ? {} : { y: -4 }}
            className={`group relative overflow-hidden rounded-card border border-line bg-surface text-left shadow-soft transition hover:border-accent ${tile.spanClass}`}
          >
            <img
              src={tile.image}
              alt={tile.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121318]/90 via-[#121318]/35 to-transparent" />

            {/* Top Tag + Subtle UB Mark */}
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
              <span
                className="rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#14171F] shadow-sm"
                style={{ backgroundColor: tile.accentHex }}
              >
                {tile.tag}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition group-hover:bg-accent group-hover:text-accent-ink">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {/* Bottom Title & Watermark */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {tile.title}
                </h3>
                <p className="mt-1 line-clamp-2 max-w-sm text-xs text-white/80 sm:text-sm">
                  {tile.subtitle}
                </p>
              </div>
              <BrandLogo
                variant="monogram"
                color="rgba(255,255,255,0.45)"
                className="hidden h-5 w-auto shrink-0 sm:block"
              />
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
