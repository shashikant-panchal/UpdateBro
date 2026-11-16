import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../types';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: {
  id: ThemeMode;
  name: string;
  tagline: string;
  desc: string;
  icon: typeof Sun;
  previewBg: string;
}[] = [
  {
    id: 'light',
    name: 'Light Mode',
    tagline: 'Clean Studio Daylight',
    desc: 'Crisp bright backgrounds with high-contrast typography.',
    icon: Sun,
    previewBg: 'bg-white text-neutral-900 border-neutral-200',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    tagline: 'OLED Stealth Black',
    desc: 'Pure dark aesthetic with glowing neon amber accents.',
    icon: Moon,
    previewBg: 'bg-[#121316] text-white border-neutral-800',
  },
  {
    id: 'system',
    name: 'System Auto',
    tagline: 'Device Adaptive',
    desc: 'Automatically matches your smartphone or tablet theme.',
    icon: Monitor,
    previewBg: 'bg-gradient-to-r from-white to-[#121316] text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700',
  },
];

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { mode, resolvedTheme, setMode } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet / Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col rounded-t-[28px] border border-line bg-surface shadow-2xl sm:rounded-3xl"
          >
            {/* Grab Handle for Mobile */}
            <div className="flex w-full justify-center pt-3 sm:hidden">
              <div className="h-1.5 w-12 rounded-full bg-muted/40" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-ink sm:text-lg">Personalization</h2>
                  <p className="text-xs text-muted">Choose your storefront theme</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-cloud text-muted transition hover:bg-cloud/80 hover:text-ink"
                aria-label="Close personalization"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Theme Options */}
            <div className="space-y-3 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Select Theme
                </label>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-ink">
                  Active: {resolvedTheme}
                </span>
              </div>

              <div className="space-y-2.5">
                {THEME_OPTIONS.map((opt) => {
                  const active = mode === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMode(opt.id)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all ${
                        active
                          ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent/40'
                          : 'border-line bg-cloud/40 hover:border-accent/40 hover:bg-cloud'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                          active
                            ? 'border-accent bg-accent text-accent-ink'
                            : 'border-line bg-surface text-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-ink">{opt.name}</p>
                          {active && (
                            <span className="flex items-center gap-1 text-xs font-bold text-accent">
                              <Check className="h-4 w-4" />
                              <span>Active</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-accent">{opt.tagline}</p>
                        <p className="mt-0.5 text-xs text-muted leading-tight">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Done Button */}
            <div className="border-t border-line bg-surface px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-full items-center justify-center rounded-full bg-accent font-display text-sm font-black uppercase tracking-wider text-accent-ink shadow-md transition hover:brightness-105 active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
