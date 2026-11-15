import React from 'react';
import type { ColorVariant, HardwareModel } from '../types';

interface ProductArtProps {
  model: HardwareModel;
  color: ColorVariant;
  image?: string;
  alt?: string;
  className?: string;
  showWatermarkBadge?: boolean;
}

const MODEL_IMAGE_FALLBACK: Record<HardwareModel, string> = {
  'tws-anc-pods': '/assets/products/ub-tws-anc-01.jpg',
  'tws-gaming-pods': '/assets/products/ub-tws-game-02.jpg',
  'tws-air-mini': '/assets/products/ub-tws-air-03.jpg',
  'neckband-pro': '/assets/products/ub-nb-pro-01.jpg',
  'studio-over-ear': '/assets/products/ub-hp-studio-02.jpg',
  'neckband-sport': '/assets/products/ub-nb-sport-03.jpg',
  'watch-amoled-call': '/assets/products/ub-watch-amoled-01.jpg',
  'watch-rugged-fit': '/assets/products/ub-watch-rugged-02.jpg',
  'watch-pulse-slim': '/assets/products/ub-watch-pulse-03.jpg',
  'charger-20w-mini': '/assets/products/ub-gan-20w-01.jpg',
  'charger-65w-gan': '/assets/products/ub-gan-65w-01.jpg',
  'charger-100w-station': '/assets/products/ub-gan-100w-03.jpg',
  'cable-100w-usbc': '/assets/products/ub-cable-100w-01.jpg',
  'cable-lightning-mfi': '/assets/products/ub-cable-mfi-02.jpg',
  'cable-3in1-braided': '/assets/products/ub-cable-3in1-03.jpg',
  'powerbank-magsafe-10k': '/assets/products/ub-pb-mag-01.jpg',
  'powerbank-pd-20k': '/assets/products/ub-pb-20k-02.jpg',
  'powerbank-pocket-5k': '/assets/products/ub-pb-5k-03.jpg',
  'car-dual-adapter': '/assets/products/ub-car-dual-01.jpg',
  'car-mag-mount': '/assets/products/ub-car-alloy-02.jpg',
  'car-retract-charger': '/assets/products/ub-car-dual-01.jpg',
  'case-magsafe-frosted': '/assets/products/ub-desk-pad-01.jpg',
  'glass-edge-shield': '/assets/products/ub-stand-alu-03.jpg',
  'stand-alu-foldable': '/assets/products/ub-stand-alu-03.jpg',
};

export const ProductArt: React.FC<ProductArtProps> = ({
  model,
  color,
  image,
  alt = 'UPDATE BRO studio product',
  className = 'w-full h-full',
  showWatermarkBadge = false,
}) => {
  const src = image || MODEL_IMAGE_FALLBACK[model] || '/assets/products/ub-tws-anc-01.jpg';

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-surface ${className}`}
      style={{
        boxShadow: showWatermarkBadge
          ? `0 10px 26px -10px ${color.hex}75`
          : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-center transition-transform duration-500"
      />
      {showWatermarkBadge && (
        <span
          aria-hidden="true"
          title={color.name}
          className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 rounded-full border border-white/80 shadow-sm"
          style={{ backgroundColor: color.hex }}
        />
      )}
    </div>
  );
};
