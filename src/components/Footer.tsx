import React, { useState } from 'react';
import { Check, Instagram, Mail, Send, Twitter, Youtube } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import type { CategoryId } from '../types';
import { BrandLogo } from './BrandLogo';
import type { InfoModalTopic } from './InfoModal';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenInfo: (topic: Exclude<InfoModalTopic, null>) => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenInfo, onReplayIntro }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    window.setTimeout(() => setSubscribed(false), 3500);
  };

  const jumpCatalog = (cat: CategoryId) => {
    onSelectCategory(cat);
  };

  return (
    <footer className="mt-16 border-t border-line bg-surface pb-10 pt-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
        {/* Newsletter Club Card */}
        <div className="mb-12 rounded-card border border-line bg-gradient-to-r from-cloud via-accent-soft to-cloud p-6 sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full bg-surface px-3 py-1 text-[11px] font-extrabold tracking-wider text-ink">
                UB VIP CLUB • EARLY DROPS
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Get ₹250 Off Your First Drop &amp; Flash Alerts
              </h3>
              <p className="mt-1 text-sm text-muted">
                No spam—just early access to GaN tech drops, ANC launches, and firmware updates.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2.5 sm:flex-row lg:col-span-5"
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="h-12 w-full rounded-btn border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-btn bg-ink px-5 text-sm font-bold text-canvas transition hover:opacity-90 dark:bg-accent dark:text-accent-ink"
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Join Club</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo variant="full" className="text-ink" />
            <p className="mt-2 text-xs font-black uppercase tracking-wider text-accent">
              Power Your World.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              UPDATE BRO is a next-generation mobile accessories brand dedicated to delivering quality, performance, reliability and modern technology.
            </p>
            <p className="mt-1 text-xs text-muted">
              We specialize in innovative fast chargers, data cables, power banks, car chargers, TWS earbuds and connectivity solutions.
            </p>

            {/* Corporate Directory Card */}
            <div className="mt-3.5 space-y-1 rounded-xl border border-line bg-cloud/50 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Brand:</span>
                <span className="font-bold text-ink">UPDATE BRO®</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Motto:</span>
                <span className="font-bold text-accent">Power Your World.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Location:</span>
                <span className="font-medium text-ink">Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Slogan Lockup */}
            <div className="mt-3 rounded-lg border border-line bg-surface px-3 py-2 text-[11px] font-semibold text-muted">
              <p><span className="font-bold text-accent">UPDATE BRO</span> – Powering Connections.</p>
              <p className="mt-0.5"><span className="font-bold text-ink">UPDATE BRO®</span> – Power Your World.</p>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              {[
                { label: 'Instagram', Icon: Instagram, url: 'https://instagram.com' },
                { label: 'YouTube', Icon: Youtube, url: 'https://youtube.com' },
                { label: 'X / Twitter', Icon: Twitter, url: 'https://x.com' },
              ].map(({ label, Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-btn border border-line bg-cloud text-muted transition hover:border-accent hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Shop Categories
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpCatalog(c.id)}
                    className="text-left transition hover:text-ink"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              More Gear &amp; Support
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              {CATEGORIES.slice(5).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpCatalog(c.id)}
                    className="text-left transition hover:text-ink"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
              {onReplayIntro && (
                <li>
                  <button
                    type="button"
                    onClick={onReplayIntro}
                    className="inline-flex items-center gap-1.5 text-left font-bold text-accent transition hover:underline"
                  >
                    <span>▶ Watch Brand Intro</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('warranty')}
                  className="text-left font-semibold text-ink transition hover:underline"
                >
                  Warranty Registration
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Company &amp; Policies
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('about')}
                  className="text-left font-bold text-accent transition hover:underline"
                >
                  About UPDATE BRO®
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('replacement')}
                  className="text-left transition hover:text-ink"
                >
                  7-Day Replacement Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('shipping')}
                  className="text-left transition hover:text-ink"
                >
                  Shipping &amp; Delivery Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('gst')}
                  className="text-left transition hover:text-ink"
                >
                  Corporate &amp; Bulk GST Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('privacy')}
                  className="text-left transition hover:text-ink"
                >
                  Privacy Policy &amp; E-Waste Compliance
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright + Payment Badges */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start text-xs text-muted">
            <p>
              © {new Date().getFullYear()} UPDATE BRO® • Power Your World. Hyderabad, Telangana, India.
            </p>
            <p className="text-[11px] text-muted/80">
              UPDATE BRO – Powering Connections. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 items-center rounded-md border border-line bg-cloud px-2.5 font-mono text-[11px] font-extrabold tracking-wider text-ink">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#2BAE66]" />
              UPI
            </span>
            <span className="inline-flex h-7 items-center rounded-md border border-line bg-cloud px-2.5 font-display text-[11px] font-black italic tracking-wider text-[#1A4DB3] dark:text-[#7FB0FF]">
              VISA
            </span>
            <span className="inline-flex h-7 items-center gap-1 rounded-md border border-line bg-cloud px-2.5 text-[11px] font-bold text-ink">
              <span className="inline-flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#EB001B]" />
                <span className="-ml-1.5 h-3 w-3 rounded-full bg-[#F79E1B]/90" />
              </span>
              Mastercard
            </span>
            <span className="inline-flex h-7 items-center rounded-md border border-line bg-cloud px-2.5 font-display text-[11px] font-extrabold tracking-wide text-ink">
              Ru<span className="text-[#F26522]">Pay</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
