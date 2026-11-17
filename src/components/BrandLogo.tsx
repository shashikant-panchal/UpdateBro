import React from 'react';
import { LOGO_PATHS } from '../data/logoPaths';

export type BrandLogoVariant = 'full' | 'horizontal' | 'monogram' | 'monogramReg' | 'wordmark' | 'official';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  color?: string;
  showSubtitle?: boolean;
  ariaLabel?: string;
}

/**
 * UpdateBro (UB) Official Brand Logo
 * Geometric Monogram, Dynamic Extended Wordmark, and "Power Your World" tagline.
 * Adaptive via `currentColor` and branded cyber-orange accents (#FF6A00).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  color,
  showSubtitle = true,
  ariaLabel = 'UPDATE BRO® — Power Your World',
}) => {
  if (variant === 'official') {
    return (
      <div className={`relative inline-block overflow-hidden rounded-xl ${className}`}>
        <img
          src="/assets/ub-logo-official.jpg"
          alt={ariaLabel}
          className="h-full w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'monogram') {
    return (
      <svg
        viewBox={LOGO_PATHS.ubOnly.viewBox}
        fill={color ?? 'currentColor'}
        fillRule="evenodd"
        clipRule="evenodd"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        <path d={LOGO_PATHS.ubOnly.d} />
      </svg>
    );
  }

  if (variant === 'monogramReg') {
    return (
      <svg
        viewBox={LOGO_PATHS.monogramReg.viewBox}
        fill={color ?? 'currentColor'}
        fillRule="evenodd"
        clipRule="evenodd"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        <path d={LOGO_PATHS.monogramReg.d} />
      </svg>
    );
  }

  if (variant === 'wordmark') {
    return (
      <svg
        viewBox={LOGO_PATHS.wordmark.viewBox}
        fill={color ?? 'currentColor'}
        fillRule="evenodd"
        clipRule="evenodd"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        <path d={LOGO_PATHS.wordmark.d} />
      </svg>
    );
  }

  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center text-center select-none ${className}`}
        style={color ? { color } : undefined}
        role="img"
        aria-label={ariaLabel}
      >
        {/* Monogram + Registered Mark */}
        <div className="relative flex items-center justify-center">
          <svg
            viewBox={LOGO_PATHS.monogramReg.viewBox}
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            className="h-16 w-auto shrink-0 drop-shadow-[0_4px_16px_rgba(255,106,0,0.25)] sm:h-20"
          >
            <path d={LOGO_PATHS.monogramReg.d} />
          </svg>
        </div>

        {/* Wordmark */}
        <svg
          viewBox={LOGO_PATHS.wordmark.viewBox}
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          className="mt-2.5 h-6 w-auto shrink-0 sm:h-8"
        >
          <path d={LOGO_PATHS.wordmark.d} />
        </svg>

        {/* Power Your World */}
        {showSubtitle && (
          <div className="mt-3 flex items-center gap-2">
            <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-accent/80 sm:w-8" />
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-accent sm:text-[10px]">
              Power Your World
            </span>
            <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-accent/80 sm:w-8" />
          </div>
        )}
      </div>
    );
  }

  // Horizontal lockup optimized for Navbar & Mobile Bar
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={color ? { color } : undefined}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Monogram */}
      <svg
        viewBox={LOGO_PATHS.monogramReg.viewBox}
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        className="h-7 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-8"
      >
        <path d={LOGO_PATHS.monogramReg.d} />
      </svg>

      {/* Typography with sub-brand */}
      <div className="flex flex-col">
        <svg
          viewBox={LOGO_PATHS.wordmark.viewBox}
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          className="h-4 w-auto shrink-0 sm:h-[18px]"
        >
          <path d={LOGO_PATHS.wordmark.d} />
        </svg>

        {showSubtitle && (
          <div className="mt-0.5 flex items-center gap-1">
            <span className="h-[1px] w-3 bg-accent/60" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.18em] text-accent sm:text-[8px]">
              Power Your World
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
