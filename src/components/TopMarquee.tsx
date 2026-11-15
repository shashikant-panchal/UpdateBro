import React from 'react';
import { MARQUEE_MESSAGES } from '../data/storefront';

export const TopMarquee: React.FC = () => {
  return (
    <div className="relative z-50 w-full overflow-hidden border-b border-line bg-ink text-canvas dark:bg-[#191B24] dark:text-ink">
      <div className="animate-marquee py-2 text-xs font-semibold tracking-wide sm:text-[13px]">
        {[...MARQUEE_MESSAGES, ...MARQUEE_MESSAGES].map((msg, idx) => (
          <span key={idx} className="mx-6 inline-flex items-center gap-2 whitespace-nowrap">
            <span>{msg}</span>
            <span className="h-1 w-1 rounded-full bg-accent opacity-80" />
          </span>
        ))}
      </div>
    </div>
  );
};
