import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LOGO_PATHS } from '../data/logoPaths';

interface IntroVideoProps {
  onFinished: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onFinished }) => {
  useEffect(() => {
    // Disable background body scrolling while intro is displayed
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Show for exactly 2 seconds, then seamlessly finish
    const timer = setTimeout(() => {
      onFinished();
    }, 2000);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onFinished}
      role="banner"
      aria-label="UPDATE BRO Intro"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
    >
      {/* =========================================================================
          BACKGROUND EFFECT: DEEP CYBER SPACE & AMBIENT ENERGY CORE
          ========================================================================= */}

      {/* 1. Perspective Depth Grid Floor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 75%)',
        }}
      />

      {/* 2. Pulsing Radial Energy Core */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.8, 1.35, 1.15], opacity: [0.35, 0.75, 0.55] }}
        transition={{ duration: 2.0, ease: 'easeOut' }}
        className="pointer-events-none absolute h-[550px] w-[550px] sm:h-[750px] sm:w-[750px] rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 106, 0, 0.16) 38%, rgba(255, 106, 0, 0) 70%)',
        }}
      />

      {/* 3. Concentric Shockwave Rings */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute h-64 w-64 rounded-full border border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.7)]"
      />
      <motion.div
        initial={{ scale: 0.2, opacity: 0.7 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute h-80 w-80 rounded-full border border-accent/40 shadow-[0_0_50px_rgba(255,106,0,0.4)]"
      />

      {/* 4. Horizontal Anamorphic Lens Flare */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1.4, 0.8], opacity: [0, 1, 0.4] }}
        transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
        className="pointer-events-none absolute h-[2px] w-[110%] max-w-5xl bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#FFFFFF,0_0_40px_#FF6A00]"
      />

      {/* 5. Ambient Luminous Ember Particles */}
      {[
        { x: -140, y: -90, s: 3, delay: 0.2 },
        { x: 160, y: -110, s: 4, delay: 0.4 },
        { x: -190, y: 70, s: 3, delay: 0.3 },
        { x: 180, y: 80, s: 4, delay: 0.5 },
        { x: -60, y: -140, s: 2, delay: 0.1 },
        { x: 80, y: 130, s: 3, delay: 0.6 },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0, x: p.x * 0.4, y: p.y * 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.4, 0.2],
            x: p.x,
            y: p.y - 40,
          }}
          transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
          className="pointer-events-none absolute rounded-full bg-white shadow-[0_0_12px_#FFFFFF,0_0_20px_#FF6A00]"
          style={{ width: p.s, height: p.s }}
        />
      ))}

      {/* =========================================================================
          HERO LOGO LOCKUP: WHITE UB MONOGRAM + WHITE UPDATE BRO WORDMARK
          ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* UB Monogram with Dynamic Electric Pop */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0, filter: 'blur(16px)' }}
          animate={{
            scale: [0.4, 1.12, 1],
            opacity: [0, 1, 1],
            filter: ['blur(16px)', 'blur(0px)', 'blur(0px)'],
          }}
          transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
          className="relative flex items-center justify-center drop-shadow-[0_0_35px_rgba(255,255,255,0.95)] drop-shadow-[0_0_80px_rgba(255,106,0,0.5)]"
        >
          <svg
            viewBox={LOGO_PATHS.monogramReg.viewBox}
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            className="h-24 w-auto sm:h-32 md:h-40"
            role="img"
            aria-label="UB Monogram"
          >
            <path d={LOGO_PATHS.monogramReg.d} />
          </svg>
        </motion.div>

        {/* UPDATE BRO Wordmark in Crisp Pure White */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-4 sm:mt-6 overflow-hidden drop-shadow-[0_0_24px_rgba(255,255,255,0.7)]"
        >
          <svg
            viewBox={LOGO_PATHS.wordmark.viewBox}
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            className="h-8 w-auto sm:h-11 md:h-14"
            role="img"
            aria-label="UPDATE BRO"
          >
            <path d={LOGO_PATHS.wordmark.d} />
          </svg>

          {/* Shimmer Light Reflection Sweep across the White Wordmark */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '220%' }}
            transition={{ duration: 1.1, delay: 0.6, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-25deg] mix-blend-overlay"
          />
        </motion.div>

        {/* Subtitle / Registered Brand Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: 'easeOut' }}
          className="mt-4 flex items-center gap-3 sm:mt-5"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="h-[1px] w-8 sm:w-12 origin-right bg-gradient-to-r from-transparent to-white/70"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.32em] text-white/90 sm:text-[11px] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            POWER YOUR WORLD
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="h-[1px] w-8 sm:w-12 origin-left bg-gradient-to-l from-transparent to-white/70"
          />
        </motion.div>
      </div>

      {/* Subtle Skip Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70 backdrop-blur-md transition hover:border-white/50 hover:bg-white/15 hover:text-white"
      >
        <span>Tap to skip</span>
        <span>✕</span>
      </motion.div>
    </motion.div>
  );
};
