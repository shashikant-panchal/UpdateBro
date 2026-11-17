import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface UnderDevelopmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  durationMs?: number;
}

/**
 * Animated "Under Development • Launching Soon" popup
 * Automatically displays for 2 seconds when the website renders and transitions smoothly out.
 * Matches the dual-theme aesthetic (Obsidian Dark / Ceramic Light) with cyber-orange accents.
 */
export const UnderDevelopmentPopup: React.FC<UnderDevelopmentPopupProps> = ({
  isOpen,
  onClose,
  durationMs = 2000,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, durationMs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dev-popup-title"
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -16, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line/80 bg-surface/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl text-ink"
          >
            {/* Ambient Radial Accent Glows */}
            <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />

            {/* Top Bar with Status Badge and Close Button */}
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-accent shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Launching Soon
              </span>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-cloud hover:text-ink focus:outline-none"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Central Animated Icon & Copy */}
            <div className="relative mt-5 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, rotate: -8 }}
                animate={{ scale: [1, 1.06, 1], rotate: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-tr from-accent/20 via-accent/10 to-transparent text-accent shadow-lg shadow-accent/20"
              >
                <Rocket className="h-8 w-8" />
              </motion.div>

              <h3
                id="dev-popup-title"
                className="mt-4 font-display text-xl sm:text-2xl font-black tracking-tight text-ink"
              >
                Our Website is Under Development
              </h3>

              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-muted">
                We are crafting an extraordinary next-generation shopping experience. Official flagship store launching soon!
              </p>

              {/* Brand Lockup Pill */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-line bg-cloud/70 px-4 py-2 text-xs font-bold text-muted">
                <BrandLogo variant="monogram" className="h-4 w-4 text-accent" />
                <span className="font-bold text-ink">UPDATE BRO®</span>
                <span className="text-muted/60">•</span>
                <span className="font-extrabold text-accent">Power Your World.</span>
              </div>
            </div>

            {/* 2-Second Countdown Progress Bar */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-line/60">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: durationMs / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-accent to-accent-hover"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
