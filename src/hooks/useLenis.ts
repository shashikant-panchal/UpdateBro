import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initializes Lenis smooth inertial momentum scrolling for desktop/laptop devices.
 * Respects user preferences for reduced motion and disables on touchscreens for native gesture fidelity.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Preserve native momentum scrolling on touch-first mobile devices
    const isTouchOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
    if (isTouchOnly) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled]);
}
