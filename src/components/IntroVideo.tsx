import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LOGO_PATHS } from '../data/logoPaths';

interface IntroVideoProps {
  onFinished: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onFinished }) => {
  useEffect(() => {
    // Disable background body scrolling while intro is active
    document.body.style.overflow = 'hidden';

    // Show for exactly 2.0 seconds, then seamlessly reveal storefront
    const timer = setTimeout(() => {
      onFinished();
    }, 2000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [onFinished]);

  return (
    <motion.div
      key="ub-intro-splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
      }}
      onClick={onFinished}
      role="banner"
      aria-label="UPDATE BRO Intro"
      style={{ transform: 'translateZ(0)', willChange: 'opacity, transform' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
    >
      {/* =========================================================================
          HIGH-PERFORMANCE GPU BACKGROUND AMBIENCE (Zero Stutter / 120 FPS)
          ========================================================================= */}

      {/* 1. Subtle Perspective Horizon Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* 2. Soft Ambient Energy Bloom (Pre-blurred to avoid GPU fill-rate stalls) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.65, scale: 1.15 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        className="pointer-events-none absolute h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(255, 106, 0, 0.14) 40%, transparent 72%)',
          }}
        />
      </motion.div>

      {/* 3. Ultra-Crisp Shockwave Wavefront */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0.85 }}
        animate={{ scale: 2.8, opacity: 0 }}
        transition={{ duration: 1.25, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        className="pointer-events-none absolute h-60 w-60 rounded-full border border-white/50"
      />

      {/* 4. Horizontal Anamorphic Laser Flare */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 0.9, 0.3] }}
        transition={{ duration: 1.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        className="pointer-events-none absolute h-[1px] w-full max-w-4xl bg-gradient-to-r from-transparent via-white to-transparent"
      />

      {/* =========================================================================
          HERO LOGO LOCKUP: PURE WHITE UB MONOGRAM + WHITE UPDATE BRO WORDMARK
          ========================================================================= */}
      <div
        style={{ transform: 'translateZ(0)' }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* Soft Radial Backlight behind Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
          className="pointer-events-none absolute -top-8 h-40 w-40 sm:h-52 sm:w-52 rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 106, 0, 0.25) 45%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* UB Monogram (Fluid Apple-Grade Deceleration Curve) */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
          className="relative flex items-center justify-center"
        >
          <svg
            viewBox={LOGO_PATHS.monogramReg.viewBox}
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            shapeRendering="geometricPrecision"
            className="h-24 w-auto sm:h-32 md:h-40 drop-shadow-[0_0_24px_rgba(255,255,255,0.7)] drop-shadow-[0_0_50px_rgba(255,106,0,0.35)]"
            role="img"
            aria-label="UB Monogram"
          >
            <path d={LOGO_PATHS.monogramReg.d} />
          </svg>
        </motion.div>

        {/* UPDATE BRO Wordmark in Crisp Pure White */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
          className="relative mt-4 sm:mt-6 overflow-hidden"
        >
          <svg
            viewBox={LOGO_PATHS.wordmark.viewBox}
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            shapeRendering="geometricPrecision"
            className="h-8 w-auto sm:h-11 md:h-14 drop-shadow-[0_0_18px_rgba(255,255,255,0.6)]"
            role="img"
            aria-label="UPDATE BRO"
          >
            <path d={LOGO_PATHS.wordmark.d} />
          </svg>

          {/* Smooth Hardware-Accelerated Shimmer Light Sweep */}
          <motion.div
            initial={{ transform: 'translateX(-100%)' }}
            animate={{ transform: 'translateX(200%)' }}
            transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform' }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
          />
        </motion.div>

        {/* Subtitle / Brand Slogan Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
          className="mt-3.5 flex items-center gap-3 sm:mt-5"
        >
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/60" />
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-white/90 sm:text-[11px] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            POWER YOUR WORLD
          </span>
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/60" />
        </motion.div>
      </div>

      {/* Subtle Skip Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70 backdrop-blur-md transition hover:border-white/50 hover:bg-white/15 hover:text-white"
      >
        <span>Skip</span>
        <span>✕</span>
      </motion.div>
    </motion.div>
  );
};
