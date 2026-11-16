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
      videoEl.playbackRate = 2.5;
      videoEl.muted = false;
      videoEl.volume = 1.0;

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts unmuted autoplay before user interaction,
          // play with muted=true so video playback begins immediately without freezing
          if (videoRef.current) {
            videoRef.current.playbackRate = 2.5;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }

    // Auto-unmute and ensure sound plays upon any user interaction at 2.5X speed
    const ensureAudio = () => {
      const video = videoRef.current;
      if (video) {
        video.playbackRate = 2.5;
        if (video.muted) {
          video.muted = false;
        }
        video.volume = 1.0;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    };

    window.addEventListener('pointerdown', ensureAudio, { passive: true });
    window.addEventListener('touchstart', ensureAudio, { passive: true });
    window.addEventListener('touchend', ensureAudio, { passive: true });
    window.addEventListener('click', ensureAudio, { passive: true });
    window.addEventListener('keydown', ensureAudio, { passive: true });

    // Safety fallback: at 2.5X speed video finishes in ~2.6s, smoothly proceed if not finished in 3.2s
    const timer = setTimeout(() => {
      onFinished();
    }, 3200);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      window.removeEventListener('pointerdown', ensureAudio);
      window.removeEventListener('touchstart', ensureAudio);
      window.removeEventListener('touchend', ensureAudio);
      window.removeEventListener('click', ensureAudio);
      window.removeEventListener('keydown', ensureAudio);
    };
  }, [onFinished]);

  const handlePointerInteraction = () => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 2.5;
      if (video.muted) {
        video.muted = false;
      }
      video.volume = 1.0;
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onPointerDown={handlePointerInteraction}
      onTouchStart={handlePointerInteraction}
      onClick={handlePointerInteraction}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
    >
      {/* 
        Responsive Edge-to-Edge Intro Video (Plays at 2.5X speed):
        - Landscape (desktop monitors, laptops, landscape tablets/phones): 'landscape:object-cover' fills the screen edge-to-edge.
        - Mobile Portrait: 'portrait:object-contain' displays the full video width edge-to-edge without cutting off any content on the sides.
        - Clean presentation: No buttons, badges, or overlays.
      */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        playsInline
        autoPlay
        preload="auto"
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = 2.5;
          }
        }}
        onPlay={() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = 2.5;
          }
        }}
        onEnded={onFinished}
        onError={onFinished}
        className="h-full w-full portrait:object-contain landscape:object-cover object-center"
      />
    </motion.div>
  );
};
