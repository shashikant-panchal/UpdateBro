import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Sliders,
  Volume2,
  Smartphone,
  Check,
  Moon,
  Sun,
  Monitor,
  Headphones,
  Zap,
  Gamepad2,
  Radio,
  Layers,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../types';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLifestyle?: (lifestyle: string) => void;
}

const EQ_PROFILES = [
  {
    id: 'bass',
    name: 'UB Bass Overdrive',
    tag: 'Punchy Sub-Bass',
    desc: 'Deep 12.4mm dynamic diaphragm boost for EDM, Hip-Hop & workouts.',
    icon: Volume2,
    badgeColor: 'bg-amber-500/20 text-amber-500',
  },
  {
    id: 'balanced',
    name: 'Studio Reference',
    tag: 'Hi-Res Balanced',
    desc: 'Flat neutral response curve tuned for acoustic purity and mastering.',
    icon: Headphones,
    badgeColor: 'bg-blue-500/20 text-blue-500',
  },
  {
    id: 'gaming',
    name: 'Blitz 40ms Gaming',
    tag: 'Spatial Low-Latency',
    desc: 'Zero-lag sync with enhanced treble for footsteps and directional audio.',
    icon: Gamepad2,
    badgeColor: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: 'vocal',
    name: 'Vocal & Podcast Clear',
    tag: 'Crisp Mids',
    desc: 'Enhanced dialogue and frequency separation for meetings and calls.',
    icon: Radio,
    badgeColor: 'bg-purple-500/20 text-purple-500',
  },
];

const ECOSYSTEMS = [
  { id: 'android', name: 'Android', desc: 'Fast Pair & LDAC HD audio', icon: '🤖' },
  { id: 'apple', name: 'Apple iOS', desc: 'AAC audio & MagSafe alignment', icon: '🍎' },
  { id: 'windows', name: 'Windows / Mac', desc: 'Multipoint dual sync', icon: '💻' },
];

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  onSelectLifestyle,
}) => {
  const { mode, setMode } = useTheme();

  const [activeEq, setActiveEq] = useState<string>(() => {
    return localStorage.getItem('ub-eq-profile') || 'bass';
  });

  const [activeEcosystem, setActiveEcosystem] = useState<string>(() => {
    return localStorage.getItem('ub-ecosystem') || 'android';
  });

  const [engravingText, setEngravingText] = useState<string>(() => {
    return localStorage.getItem('ub-engraving-text') || 'UPDATE BRO';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSave = () => {
    localStorage.setItem('ub-eq-profile', activeEq);
    localStorage.setItem('ub-ecosystem', activeEcosystem);
    localStorage.setItem('ub-engraving-text', engravingText.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

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

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-[28px] border border-line bg-surface shadow-2xl sm:max-h-[85vh] sm:rounded-3xl"
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-ink sm:text-lg">Personalization</h2>
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent-ink">
                      Studio
                    </span>
                  </div>
                  <p className="text-xs text-muted">Customize audio signature, theme & devices</p>
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

            {/* Scrollable Content */}
            <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
              {/* Section 1: Sound Signature Tuning */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                    <Sliders className="h-3.5 w-3.5 text-accent" />
                    <span>Sound EQ Signature</span>
                  </label>
                  <span className="text-[11px] font-semibold text-accent">DSP 24-bit</span>
                </div>

                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {EQ_PROFILES.map((profile) => {
                    const active = activeEq === profile.id;
                    const Icon = profile.icon;
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => setActiveEq(profile.id)}
                        className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                          active
                            ? 'border-accent bg-accent/10 shadow-sm'
                            : 'border-line bg-cloud/40 hover:border-accent/40 hover:bg-cloud'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                            active ? 'bg-accent text-accent-ink' : 'bg-surface text-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-xs font-bold text-ink">{profile.name}</p>
                            {active && <Check className="h-3.5 w-3.5 text-accent" />}
                          </div>
                          <span
                            className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold ${profile.badgeColor}`}
                          >
                            {profile.tag}
                          </span>
                          <p className="mt-1 line-clamp-2 text-[10px] text-muted leading-tight">
                            {profile.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Case Laser Engraving Preview */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span>Custom Case Engraving Preview</span>
                </label>

                <div className="mt-2.5 rounded-2xl border border-line bg-cloud/50 p-4">
                  {/* Case Simulation Graphic */}
                  <div className="relative mx-auto flex h-28 w-44 items-center justify-center rounded-[32px] border border-white/20 bg-gradient-to-b from-[#2B2D33] via-[#1E2025] to-[#121316] shadow-xl">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-[9px] font-black tracking-widest text-white/50">
                        UPDATE BRO®
                      </span>
                      {/* Laser Engraved User Name */}
                      <div className="mt-2 rounded border border-white/10 bg-white/5 px-2.5 py-0.5 shadow-inner">
                        <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-300/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                          {engravingText.trim() || 'YOUR NAME'}
                        </span>
                      </div>
                      <div className="mt-2.5 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    </div>
                  </div>

                  {/* Input field */}
                  <div className="mt-3">
                    <input
                      type="text"
                      maxLength={14}
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                      placeholder="ENTER NAME (MAX 14 CHARS)"
                      className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                    <p className="mt-1.5 text-center text-[10px] text-muted">
                      ✨ Precision fiber laser engraving launching on next audio drop.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Ecosystem Setup */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                  <Smartphone className="h-3.5 w-3.5 text-accent" />
                  <span>Your Primary Device Ecosystem</span>
                </label>

                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {ECOSYSTEMS.map((eco) => {
                    const active = activeEcosystem === eco.id;
                    return (
                      <button
                        key={eco.id}
                        type="button"
                        onClick={() => setActiveEcosystem(eco.id)}
                        className={`flex flex-col items-center rounded-2xl border p-2.5 text-center transition ${
                          active
                            ? 'border-accent bg-accent/10 shadow-sm'
                            : 'border-line bg-cloud/40 hover:bg-cloud'
                        }`}
                      >
                        <span className="text-xl">{eco.icon}</span>
                        <p className="mt-1 text-xs font-bold text-ink">{eco.name}</p>
                        <p className="mt-0.5 text-[9px] text-muted line-clamp-1">{eco.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Visual Theme Preference */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                  <Sun className="h-3.5 w-3.5 text-accent" />
                  <span>Display Theme</span>
                </label>

                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', name: 'Light', icon: Sun },
                    { id: 'dark', name: 'Dark', icon: Moon },
                    { id: 'system', name: 'Auto', icon: Monitor },
                  ].map((t) => {
                    const active = mode === t.id;
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMode(t.id as ThemeMode)}
                        className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition ${
                          active
                            ? 'border-accent bg-accent text-accent-ink'
                            : 'border-line bg-cloud/50 text-ink hover:border-accent/50'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Routine Filter Shortcuts */}
              {onSelectLifestyle && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                    <Layers className="h-3.5 w-3.5 text-accent" />
                    <span>Explore by Lifestyle</span>
                  </label>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {[
                      { id: 'wfh', label: '💼 WFH & Desk Setup' },
                      { id: 'gaming', label: '🎮 Pro Gaming Sync' },
                      { id: 'travel', label: '✈️ Travel & Fast Charge' },
                      { id: 'fitness', label: '🏃 Fitness & Sport' },
                    ].map((life) => (
                      <button
                        key={life.id}
                        type="button"
                        onClick={() => {
                          onSelectLifestyle(life.id);
                          onClose();
                        }}
                        className="flex h-10 items-center justify-center rounded-xl border border-line bg-cloud/50 px-3 text-xs font-bold text-ink transition hover:border-accent hover:bg-accent-soft"
                      >
                        {life.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-line bg-surface px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleSave}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-sm font-black uppercase tracking-wider text-accent-ink shadow-lg transition hover:brightness-105 active:scale-[0.98]"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Apply My Studio Profile</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
