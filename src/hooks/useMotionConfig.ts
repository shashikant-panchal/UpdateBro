import { useEffect, useState } from 'react';

export const useMotionConfig = () => {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isReduced = prefersReduced;
  const tiltEnabled = !isReduced;

  const spring = {
    type: 'spring' as const,
    stiffness: 310,
    damping: 26,
    mass: 0.8,
  };

  const revealProps = isReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.14 },
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
      };

  return {
    isReduced,
    tiltEnabled,
    spring,
    revealProps,
  };
};
