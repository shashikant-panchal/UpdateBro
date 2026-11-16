import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface IntroVideoProps {
  onFinished: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onFinished }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Disable background body scrolling while intro is playing
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = false;
      videoEl.volume = 1.0;

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts unmuted autoplay before user interaction,
          // start playing immediately so video is never blocked
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }

    // Immediately enable sound on any user gesture (click, tap, keypress)
    const handleGesture = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });

    // Safety fallback: if video doesn't end within 6 seconds (video is ~4s), smoothly reveal website
    const timer = setTimeout(() => {
      onFinished();
    }, 6000);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black select-none pointer-events-none"
    >
      {/* 
        Full Screen Responsive Video:
        - Landscape: Fills screen edge-to-edge.
        - Mobile Portrait: 'object-cover object-center' fills 100vh height and focuses on center,
          cropping left/right edges for a seamless portrait full-screen presentation.
      */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        playsInline
        autoPlay
        onEnded={onFinished}
        onError={onFinished}
        className="h-full w-full object-cover object-center"
      />
    </motion.div>
  );
};
