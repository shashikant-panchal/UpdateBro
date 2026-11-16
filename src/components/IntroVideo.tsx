import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  onFinished: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onFinished }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable background body scrolling while intro is playing
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const videoEl = videoRef.current;
    if (videoEl) {
      // Try playing with sound, fallback to muted if browser blocks unmuted autoplay
      videoEl.muted = false;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
          })
          .catch(() => {
            // Unmuted autoplay blocked by browser policy, switch to muted and play
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
              setIsMuted(true);
            }
          });
      }
    }

    // Safety fallback: if video doesn't end within 6s, proceed to website
    const timer = setTimeout(() => {
      onFinished();
    }, 6000);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [onFinished]);

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (videoEl && videoEl.duration) {
      setProgress((videoEl.currentTime / videoEl.duration) * 100);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* 
        Video Display:
        - Landscape (desktop/tablet): 'object-cover' fills the screen while keeping the landscape ratio.
        - Mobile View: 'object-cover object-center' expands height to 100vh and crops left/right edges,
          displaying a portrait full-screen video with the center logo/animation preserved.
      */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        playsInline
        autoPlay
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onFinished}
        onError={onFinished}
        className="h-full w-full object-cover object-center"
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between sm:top-6 sm:left-6 sm:right-6">
        {/* Brand Tag */}
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-display text-xs font-black uppercase tracking-wider text-white">
            UPDATE BRO®
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20 hover:border-white/40"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={onFinished}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-white/25 hover:border-white/50"
          >
            <span>Skip Intro</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
        <div
          className="h-full bg-accent transition-all duration-100 ease-linear shadow-[0_0_8px_var(--accent-glow)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
