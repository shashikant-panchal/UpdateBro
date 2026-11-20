import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MARQUEE_MESSAGES } from '../data/storefront';

interface TopMarqueeProps {
  announcementText?: string;
}

export const TopMarquee: React.FC<TopMarqueeProps> = ({ announcementText }) => {
  const [copied, setCopied] = useState(false);

  const messages = announcementText
    ? [announcementText, ...MARQUEE_MESSAGES]
    : MARQUEE_MESSAGES;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('UPDATE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-50 w-full overflow-hidden border-b border-line bg-[#0A0C12] text-white selection:bg-accent/40">
      <div className="flex items-center">
        {/* Fixed Left Live Offer Pill on Desktop */}
        <div className="relative z-20 hidden shrink-0 items-center gap-2 border-r border-white/10 bg-[#0A0C12] px-4 py-2 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
            FLAGSHIP DROP
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-accent transition hover:bg-accent hover:text-black"
            title="Click to copy coupon code UPDATE10"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span>UPDATE10</span>
          </button>
        </div>

        {/* Continuous Smooth Marquee Ticker */}
        <div className="animate-marquee py-2 text-xs font-semibold tracking-wide sm:text-[13px]">
          {[...messages, ...messages].map((msg, idx) => (
            <span key={idx} className="mx-6 inline-flex items-center gap-2.5 whitespace-nowrap text-white/85">
              <span>{msg}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#FF6A00]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
