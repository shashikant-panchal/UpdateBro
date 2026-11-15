import React from 'react';
import { LOGO_PATHS } from '../data/logoPaths';

export type BrandLogoVariant = 'full' | 'horizontal' | 'monogram' | 'monogramReg' | 'wordmark';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  color?: string;
  ariaLabel?: string;
}

/**
 * Vector replication of the official UB UPDATE BRO® geometric monogram & wordmark.
 * Adapts automatically via `currentColor` (#1E1E24 in Light Mode, #F4F5F8 in Dark Mode)
 * or accepts an explicit `color` prop when embossed/watermarked on product surfaces.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  color,
  ariaLabel = 'UPDATE BRO®',
}) => {
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
      <svg
        viewBox={LOGO_PATHS.fullLockup.viewBox}
        fill={color ?? 'currentColor'}
        fillRule="evenodd"
        clipRule="evenodd"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        <path d={LOGO_PATHS.fullLockup.d} />
      </svg>
    );
  }

  // Horizontal lockup optimized for Navbar & Footer bars
  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={color ? { color } : undefined}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={LOGO_PATHS.monogramReg.viewBox}
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        className="h-7 w-auto shrink-0 sm:h-8"
      >
        <path d={LOGO_PATHS.monogramReg.d} />
      </svg>
      <svg
        viewBox={LOGO_PATHS.wordmark.viewBox}
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        className="h-5 w-auto shrink-0 sm:h-6"
      >
        <path d={LOGO_PATHS.wordmark.d} />
      </svg>
    </span>
  );
};
