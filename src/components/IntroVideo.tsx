import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface IntroVideoProps {
  onFinished: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onFinished }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const unmuteAndPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      video.play().catch(() => {});
    }
  };

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
        playPromise
          .then(() => {
            // Unmuted autoplay permitted by browser
            setIsMuted(false);
          })
          .catch(() => {
            // Browser autoplay policy blocked unmuted audio:
            // Start video playing muted, and prompt user for tap to enable audio
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
              setIsMuted(true);
            }
          });
      }
    }

    // Safety fallback: if video doesn't end within 6.5s, smoothly proceed
    const timer = setTimeout(() => {
      onFinished();
    }, 6500);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [onFinished]);

  const handleTimeUpdate = () => {
    if (videoRef.current && bgVideoRef.current) {
      if (Math.abs(videoRef.current.currentTime - bgVideoRef.current.currentTime) > 0.25) {
        bgVideoRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={unmuteAndPlay}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
    >
      {/* 
        Ambient Video Glow Layer:
        Fills the vertical mobile screen with glowing, reactive video motion
        so there are no harsh empty black voids.
      */}
      <video
        ref={bgVideoRef}
        src="/assets/intro.mp4"
        playsInline
        autoPlay
        muted
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center blur-2xl opacity-50 scale-110"
      />

      {/* 
        Main Sharp Video Layer:
        - Landscape (desktop/monitor/tablets): 'object-cover' fills the screen edge-to-edge.
        - Mobile Portrait: 'object-contain' shows the full video width edge-to-edge without cutting
          off the logo, text, or graphics!
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
        className="relative z-10 h-full w-full object-contain md:object-cover landscape:object-cover object-center"
      />

      {/* 
        Sound Prompt (displayed ONLY if browser blocked unmuted autoplay):
        Disappears immediately as soon as the user taps anywhere on screen.
      */}
      {isMuted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            unmuteAndPlay();
          }}
          className="absolute bottom-10 z-20 flex items-center gap-2 rounded-full border border-white/30 bg-black/80 px-5 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition hover:scale-105 active:scale-95 animate-bounce"
        >
          <Volume2 className="h-4 w-4 text-accent animate-pulse" />
          <span>Tap for Sound 🔊</span>
        </button>
      )}
    </motion.div>
  );
};
